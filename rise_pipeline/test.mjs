import cfn from './cfn/index.mjs'

const definition = {
    name: 'rise-pipeline-pipeline',
    stages: [
        {
            name: 'Source',
            actions: [
                {
                    type: 'SOURCE',
                    name: 'GithubRepo',
                    repo: 'rise-pipeline',
                    owner: 'rise-cli',
                    outputArtifact: 'sourceZip'
                }
            ]
        },
        {
            name: 'Prod',
            actions: [
                {
                    type: 'BUILD',
                    name: 'DeployDocumentation',
                    script: [
                        `cd ./docs`,
                        `npm i -g rise-docs`,
                        `rise-docs deploy`
                    ]
                },
                {
                    type: 'BUILD',
                    name: 'PublishToNpm',
                    script: [
                        `cd ./app`,
                        `npm config set '//registry.npmjs.org/:_authToken' "\${NPM_TOKEN}"`,
                        `npm i`,
                        `npm publish`
                    ],
                    env: {
                        NPM_TOKEN: '@secret.NPM_KEY'
                    }
                }
            ]
        }
    ]
}

const res = cfn(definition)
console.log(JSON.stringify(res, null, 2))
