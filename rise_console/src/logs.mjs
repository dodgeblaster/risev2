import {
    CloudWatchLogsClient,
    DescribeLogStreamsCommand,
    GetLogEventsCommand
} from '@aws-sdk/client-cloudwatch-logs'

const client = new CloudWatchLogsClient({})

export async function getLogStreams(name) {
    const input = {
        logGroupName: name,
        descending: true,
        limit: 3,
        // logStreamNamePrefix: 'STRING_VALUE',
        // nextToken: 'STRING_VALUE',
        orderBy: 'LastEventTime' //LogStreamName | LastEventTime
    }
    const command = new DescribeLogStreamsCommand(input)
    const res = await client.send(command)
    if (res.logStreams) {
        return res.logStreams[0].logStreamName
    } else {
        return false
    }
}

export async function getLogEvents(group, stream) {
    const input = {
        logGroupName: group /* required */,
        logStreamName: stream /* required */,
        //endTime: 'NUMBER_VALUE',
        limit: 1000,
        // nextToken: 'STRING_VALUE',
        startFromHead: true
        // startTime: 'NUMBER_VALUE'
    }
    const command = new GetLogEventsCommand(input)
    const res = await client.send(command)

    if (res.events) {
        return res.events.map((x) => x.message)
    } else {
        return []
    }
}

export async function getLogs(name) {
    const streamName = await getLogStreams('/aws/codebuild/' + name)
    if (streamName) {
        return await getLogEvents('/aws/codebuild/' + name, streamName)
    } else {
        return []
    }
}
