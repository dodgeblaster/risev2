import awsLite from '@aws-lite/client'

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} [props.region]
 */
export async function removeStack(props) {
    const aws = await awsLite({
        region: props.region || process.env.AWS_REGION || 'us-east-1',
        plugins: [import('@aws-lite/cloudformation')]
    })

    const input = {
        StackName: props.name
    }

    return await aws.CloudFormation.DeleteStack(input)
}
