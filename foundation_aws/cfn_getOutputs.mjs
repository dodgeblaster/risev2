import awsLite from '@aws-lite/client'

/**
 * @param {object} props
 * @param {string} props.stack
 * @param {Array.<string>} props.outputs
 * @param {string} [props.region]
 */
export async function getOutputs(props) {
    const aws = await awsLite({
        region: 'us-east-1',
        plugins: [import('@aws-lite/cloudformation')]
    })

    function getOutput(outputs, value) {
        const v = outputs.find((x) => x.OutputKey === value)
        return v ? v.OutputValue : false
    }

    const input = {
        StackName: props.stack
    }

    try {
        const x = await aws.CloudFormation.DescribeStacks(input)

        if (!x.Stacks || x.Stacks.length === 0) {
            throw new Error('No stacks found with the name ' + props.stack)
        }

        const details = x.Stacks[0]

        if (!details.Outputs) {
            return {}
        }

        const res = {}
        const outputs = details.Outputs

        for (const o of props.outputs) {
            res[o] = getOutput(outputs, o)
        }

        return res
    } catch (e) {
        throw new Error(e)
    }
}
