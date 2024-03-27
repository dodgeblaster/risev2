import awsLite from '@aws-lite/client'

/**
 * @param {any} props.file
 * @param {string} props.bucket
 * @param {string} props.key
 */
export async function uploadFile(props) {
    const aws = await awsLite({
        region: region || process.env.AWS_REGION || 'us-east-1',
        plugins: [import('@aws-lite/s3')]
    })

    const input = {
        Body: props.file,
        Bucket: props.bucket,
        Key: props.key
    }

    const x = aws.S3.PutObject(input)
    return {
        etag: x.ETag
    }
}
