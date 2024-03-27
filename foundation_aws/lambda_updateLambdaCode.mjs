import awsLite from '@aws-lite/client'

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.bucket
 * @param {string} props.filePath
 * @param {string} props.region
 */
export async function updateLambdaCode({ name, bucket, filePath, region }) {
    const input = {
        FunctionName: name,
        Publish: true,
        S3Bucket: bucket,
        S3Key: filePath
    }

    const aws = await awsLite({
        region: region || process.env.AWS_REGION || 'us-east-1',
        plugins: [import('@aws-lite/lambda')]
    })

    const res = await aws.Lambda.UpdateFunctionCode(input)
    return res.FunctionArn
}
