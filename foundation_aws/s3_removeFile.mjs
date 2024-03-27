import awsLite from '@aws-lite/client'

/**
 * @param {string} props.bucket
 * @param {string} props.key
 */
export async function removeFile(props) {
    const aws = await awsLite({
        region: region || process.env.AWS_REGION || 'us-east-1',
        plugins: [import('@aws-lite/s3')]
    })

    const input = {
        Bucket: props.bucket,
        Key: props.key
    }

    await aws.S3.DeleteObjects(input)
    return true
}
