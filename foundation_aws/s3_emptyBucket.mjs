import awsLite from '@aws-lite/client'

/**
 * @param {string} props.bucketName
 * @param {string} props.key
 */
export async function emptyBucket(props) {
    const aws = await awsLite({
        region: region || process.env.AWS_REGION || 'us-east-1',
        plugins: [import('@aws-lite/s3')]
    })

    const input = {
        Bucket: props.bucketName
    }

    const resp = await aws.S3.ListObjectsV2(input)

    const contents = resp.Contents
    let testPrefix = false
    let prefixRegexp

    if (!contents || !contents[0]) {
        return Promise.resolve()
    }

    if (props.keyPrefix) {
        testPrefix = true
        prefixRegexp = new RegExp('^' + props.keyPrefix)
    }

    const objectsToDelete = contents
        .map((content) => ({ Key: content.Key }))
        .filter((content) => !testPrefix || prefixRegexp.test(content.Key))

    const willEmptyBucket = objectsToDelete.length === contents.length

    if (objectsToDelete.length === 0) {
        return Promise.resolve(willEmptyBucket)
    }

    const params = {
        Bucket: props.bucketName,
        Delete: { Objects: objectsToDelete }
    }

    await aws.S3.DeleteObjects(params)

    return willEmptyBucket
}
