import * as filesystem from '../foundation_fs/index.mjs'
import * as aws from '../foundation_aws/index.mjs'
import { deployInfra } from '../deploy_infra/index.mjs'
import { makeBucket } from './makeBucket.mjs'
import process from 'node:process'

/**
 * Deploy code bucket
 *
 * @param {string} appName
 * @param {string} stage
 * @param {string} region
 */
export async function deployCodeBucket({ name, stage, region }) {
    const bucketTemplate = makeBucket('Main')
    const stackName = name + stage + '-bucket'
    const deploy = deployInfra
    const result = await deploy({
        name: stackName,
        stage,
        region,
        template: JSON.stringify(bucketTemplate),
        outputs: ['MainBucket']
    })

    if (result.status === 'error') {
        throw new Error(result.message)
    }

    return result.outputs.MainBucket
}

/**
 * Zip code
 *
 * @param {object} config
 * @param {string} config.functionsLocation
 * @param {string} config.zipTarget
 */
export async function zipCode(config) {
    const fs = filesystem
    function getLambdaFunctionPaths(folderName) {
        let lambdas = []
        try {
            lambdas = fs.getDirectories({
                path: folderName,
                projectRoot: process.cwd()
            })
        } catch (e) {
            lambdas = []
        }

        return lambdas.map((name) => {
            return {
                path: folderName + '/' + name,
                name
            }
        })
    }

    const lambdas = getLambdaFunctionPaths(config.functionsLocation)
    for (const lambda of lambdas) {
        await fs.zipFolder({
            source: lambda.path,
            target: config.zipTarget,
            name: lambda.name,
            projectRoot: process.cwd()
        })
    }
}

/**
 * Upload code to bucket
 *
 * @param {object} config
 * @param {string} config.bucketName
 * @param {string} config.functionsLocation
 * @param {string} config.zipTarget
 * @param {string} config.hiddenFolder
 */
export async function uploadCode(config) {
    const fs = filesystem
    const uploadFile = aws.s3.uploadFile
    const getAllPaths = () => {
        const lambaPaths = config.functionsLocation
        const lambdas = fs.getDirectories({
            path: lambaPaths,
            projectRoot: process.cwd()
        })
        return lambdas.map((name) => `${config.zipTarget}/${name}.zip`)
    }

    let result = []
    const paths = getAllPaths()
    for (const path of paths) {
        const file = await fs.getFile({
            path,
            projectRoot: process.cwd()
        })
        const res = await uploadFile({
            file,
            bucket: config.bucketName,
            key: path.split(config.hiddenFolder + '/')[1]
        })
        result.push(res)
    }

    return result
}

/**
 * Update lambda code
 *
 * @param {string} appName
 * @param {string} stage
 * @param {string} region
 * @param {string} bucket
 * @param {object} config
 * @param {string} config.functionsLocation
 * @param {string} config.zipTarget
 * @param {string} config.hiddenFolder
 */
export async function updateLambdaCode({
    appName,
    stage,
    region,
    bucket,
    zipConfig
}) {
    const getDirectories = filesystem.getDirectories
    const updateCode = aws.lambda.updateLambdaCode

    const getAllPaths = () => {
        const lambaPaths = zipConfig.functionsLocation
        const lambdas = getDirectories({
            path: lambaPaths,
            projectRoot: process.cwd()
        })
        const path = zipConfig.zipTarget.split(zipConfig.hiddenFolder + '/')[1]
        return lambdas.map((x) => ({
            path: `${path}/${x}.zip`,
            name: x
        }))
    }

    const getFunctionName = (name) => `${appName}-${name}-${stage}`
    for (const l of getAllPaths()) {
        const lambdaName = getFunctionName(l.name)
        await updateCode({
            name: lambdaName,
            filePath: l.path,
            bucket: bucket,
            region
        })
    }
}

/**
 * Empty and remove bucket
 *
 * @param {string} bucketName
 * @param {string} [keyPrefix]
 */
export async function emptyCodeBucket({ bucketName, keyPrefix }) {
    return aws.s3.emptyBucket({ bucketName, keyPrefix })
}
