import {
    CodePipelineClient,
    ListPipelinesCommand,
    StartPipelineExecutionCommand,
    GetPipelineCommand,
    GetPipelineStateCommand
} from '@aws-sdk/client-codepipeline'

const client = new CodePipelineClient({})

export async function listPipelines() {
    const input = {
        // ListPipelinesInput
        nextToken: 'STRING_VALUE',
        maxResults: Number('int')
    }
    const command = new ListPipelinesCommand(input)
    const response = await client.send(command)
    return response.pipelines.map((x) => x.name)
}

export async function startPipeline(name) {
    const input = {
        // StartPipelineExecutionInput
        name // required
    }
    const command = new StartPipelineExecutionCommand(input)
    const response = await client.send(command)
    return response
}

async function getPipeline(name) {
    const input = {
        // GetPipelineInput
        name
    }
    const command = new GetPipelineCommand(input)
    const res = await client.send(command)
    return {
        arn: res.metadata.pipelineArn,
        name: res.pipeline.name,
        stages: res.pipeline.stages.map((x) => ({
            name: x.name,
            actions: x.actions.map((x) => ({
                type: x.actionTypeId.category,
                config: x.configuration
            }))
        }))
    }
}

async function getPipelineState(name) {
    const command = new GetPipelineStateCommand({
        name
    })
    const response = await client.send(command)
    return response
}

export async function getPipelineData(name) {
    //const name = 'rise-cli-foundation-pipeline' // 'coffee-core-pipeline'
    const p = await getPipeline(name)
    const s = await getPipelineState(name)

    let res = {
        name: p.name,
        stages: []
    }

    // @ts-ignore
    let stacks = []

    p.stages.forEach((x, i) => {
        let def = x
        let state = s.stageStates[i]
        let stackId = null
        let time = null
        let stage = {
            name: x.name,
            actions: x.actions.map((x, i) => {
                let status = 'InProgress'
                if (
                    state.actionStates[i].latestExecution &&
                    state.actionStates[i].latestExecution.lastStatusChange
                ) {
                    time =
                        state.actionStates[i].latestExecution.lastStatusChange
                    if (i === 0) {
                        stackId =
                            state.actionStates[i].latestExecution
                                .pipelineExecutionId
                    }
                }
                if (
                    state.actionStates[i].latestExecution &&
                    state.actionStates[i].latestExecution.status
                ) {
                    status = state.actionStates[i].latestExecution.status
                }

                return {
                    name: state.actionStates[i].actionName,
                    status: status,
                    isBuildProject: x.type === 'Build',
                    type: x.type,
                    logGroup: x.type === 'Build' ? x.config.ProjectName : 'none'
                }
            })
        }

        if (!stackId) {
            stackId = state.latestExecution?.pipelineExecutionId
        }

        // @ts-ignore
        stage.time = time

        // @ts-ignore
        res.stages.push(stage)
        stacks.push(stackId)
    })

    // @ts-ignore
    const newStateMap = stacks.reverse().reduce((acc, id, i, li) => {
        if (acc[id]) {
            return {
                ...acc,
                [id]: {
                    ...acc[id],
                    stackNumber: acc[id].stackNumber - 1
                }
            }
        }
        return {
            ...acc,
            [id]: {
                id,
                stackNumber: li.length - (i + 1),
                stages: res.stages.filter((_, ii) => ii <= li.length - (i + 1))
            }
        }
    }, {})

    const newState = Object.keys(newStateMap).map((k) => newStateMap[k])

    return {
        executions: newState,
        name: res.name
    }
}
