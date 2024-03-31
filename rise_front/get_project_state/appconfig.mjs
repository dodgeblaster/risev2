import * as filesystem from '../../foundation_fs/index.mjs'
import process from 'node:process'

async function getLocalAppConfig() {
    try {
        const app = await filesystem.getJsFile({
            path: '/rise.mjs',
            projectRoot: process.cwd()
        })

        const config = app.default

        return {
            appName: config.name,
            region: config.region || 'us-east-1',
            stage: config.stage || 'dev',
            dashboard: config.dashboard || false,
            table: config.table || false,
            auth: config.auth || false
        }
    } catch (e) {
        throw new Error('Must have a rise.mjs file')
    }
}

async function getLocalBucketName() {
    try {
        const { config } = await filesystem.getJsFile({
            path: '/.rise/data.mjs',
            projectRoot: process.cwd()
        })

        return config.bucketName
    } catch (e) {
        return undefined
    }
}

export async function getAppConfig() {
    const config = await getLocalAppConfig()
    let bucketName = await getLocalBucketName()

    return {
        appName: config.appName,
        domain: config.domain
            ? {
                  name: config.domain.name,
                  path: config.domain.path,
                  stage: config.domain.stage
              }
            : false,
        auth: config.auth,
        bucketName: bucketName,
        region: config.region || 'us-east-1',
        stage: config.stage || 'dev',
        dashboard: config.dashboard,
        table: config.table
    }
}
