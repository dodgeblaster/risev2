import { makeFolders } from './makeFolders.mjs'
import { getAppConfig } from './appconfig.mjs'
import { getFunctionConfig } from './functionconfig.mjs'
import { copyProject } from './moveFiles.mjs'

export const getConfig = async (flags) => {
    await makeFolders()
    await copyProject()

    let appConfig = await getAppConfig()
    appConfig.stage = flags.stage
    appConfig.region = flags.region

    let additionalResources = {
        Resources: {},
        Outputs: {}
    }

    return {
        app: appConfig,
        functions: {
            site: {
                url: true,
                eventRule: 'None',
                env: {},
                permissions: [],
                alarm: 'None',
                timeout: 6,
                schedule: 'None'
            }
        },
        deployName: appConfig.appName.replace(/\s/g, '') + 'functions',
        zipConfig: {
            functionsLocation: '/.rise/src/lambdas',
            zipTarget: '/.rise/lambdas',
            hiddenFolder: '.rise'
        },

        additionalResources,
        deployInfra: true //flags.ci === 'true'
    }
}
