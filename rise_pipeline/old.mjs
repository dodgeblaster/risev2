const fs = require('fs')
module.exports.deploy = async function (cli, aws) {
    try {
        const codestar = aws.codestar
        const cloudformation = aws.cloudformation

        const def = await cli.filesystem.getJsFile('/pipeline.js')

        let template = {
            Resources: {
                ...codestar.makeGithubConnection(def.name).Resources,
                ...codestar.makeArtifactBucket(def.name).Resources
            },
            Outputs: {}
        }

        let pipelineStages = []
        for (const s of def.stages) {
            let actions = []

            for (const x of s.actions) {
                const valid = [
                    'BUILD',
                    'SOURCE',
                    'INVOKE',
                    'APPROVAL',
                    'DEPLOY'
                ]

                if (!valid.includes(x.type)) {
                    throw new Error(x.type + ' is not a valid action')
                }

                if (x.type === 'BUILD') {
                    const text = fs.readFileSync(
                        process.cwd() + x.script,
                        'UTF-8'
                    )
                    const name = (def.name + x.script).replace(
                        /[^a-zA-Z ]/g,
                        ''
                    )
                    const build = codestar.makeBuildProject({
                        name: name,
                        buildSpec: text,
                        env: {}
                    })
                    template = {
                        Resources: {
                            ...template.Resources,
                            ...build.Resources
                        },
                        Outputs: {
                            ...template.Outputs,
                            ...build.Outputs
                        }
                    }

                    actions.push({
                        ...x,
                        env: x.env || {},
                        projectCFName: name,
                        inputArtifact: x.inputArtifact || 'sourceZip',
                        outputArtifact: x.outputArtifact || x.name + 'Zip'
                    })
                } else {
                    if (x.type === 'SOURCE') {
                        x.outputArtifact = x.outputArtifact || 'sourceZip'
                    } else {
                        x.inputArtifact = x.inputArtifact || 'sourceZip'
                        x.outputArtifact = x.outputArtifact || x.name + 'Zip'
                    }
                    actions.push(x)
                }
            }

            pipelineStages.push({
                name: s.name,
                actions
            })
        }

        const pipe = codestar.makePipeline({
            pipelineName: def.name,
            stages: pipelineStages
        })

        template = {
            Resources: {
                ...template.Resources,
                ...pipe.Resources
            },
            Outputs: {
                ...template.Outputs,
                ...pipe.Outputs
            }
        }

        await cloudformation.deployStack({
            name: def.name,
            template: JSON.stringify(template)
        })

        cli.terminal.clear()
        cli.terminal.printInfoMessage('Deploying pipeline...')

        await cloudformation.getDeployStatus({
            config: {
                stackName: def.name,
                minRetryInterval: 5000,
                maxRetryInterval: 10000,
                backoffRate: 1.1,
                maxRetries: 200,
                onCheck: (resources) => {
                    cli.terminal.clear()
                    resources.forEach((item) => {
                        cli.terminal.printInfoMessage(
                            `${item.id}: ${item.status}`
                        )
                    })
                }
            }
        })

        cli.terminal.clear()
        cli.terminal.printSuccessMessage('Deployment Complete')
    } catch (e) {
        cli.terminal.clear()
        cli.terminal.printErrorMessage('Rise Pipeline Error')
        cli.terminal.printInfoMessage(e.message)
    }
}
