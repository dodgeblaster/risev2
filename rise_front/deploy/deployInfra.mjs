import * as filesystem from '../../foundation_fs/index.mjs'
import { deployInfra } from '../../deploy_infra/index.mjs'
import { makeLambdaErrorAlarm } from './cfn_alarm.mjs'
import { makeLambda } from './cfn_lambda.mjs'
import { makeEventRule } from './cfn_eventRule.mjs'
import { makeScheduleTrigger } from './cfn_scheduletrigger.mjs'
import { makeLambdaUrl } from './cfn_lambdaUrl.mjs'
import process from 'node:process'

/**
 * @param {object} props
 * @param {string} props.region
 * @param {string} props.appName
 * @param {string} props.bucketArn
 * @param {string} props.stage
 * @param {boolean} props.dashboard
 * @param {object} props.config
 * @param {object} props.zipConfig
 * @param {object} [props.additionalResources]
 */
export async function deployApplication({
    region,
    appName,
    bucketArn,
    stage,
    config,
    zipConfig
}) {
    let outputs = []

    /**
     * Helpers
     */
    const getZipPaths = () => {
        const lambaPaths = zipConfig.functionsLocation
        const lambdas = filesystem.getDirectories({
            path: lambaPaths,
            projectRoot: process.cwd()
        })
        const path = zipConfig.zipTarget.split(zipConfig.hiddenFolder + '/')[1]
        return [
            ...lambdas.map((x) => ({
                path: `${path}/${x}.zip`,
                name: x
            }))
        ]
    }

    /**
     * Initialize State
     */
    let template = {
        Resources: {},
        Outputs: {}
    }

    const zipPaths = getZipPaths()
    zipPaths.forEach((x) => {
        const permissions = config[x.name]
            ? config[x.name].permissions.map((x) => ({
                  ...x,
                  Effect: 'Allow'
              }))
            : []

        let lambdaEnv = {}

        /**
         * Make Lambda
         */
        const res = makeLambda({
            appName: appName,
            name: x.name,
            stage: stage,
            bucketArn: bucketArn,
            bucketKey: x.path,
            env: config[x.name]
                ? { ...config[x.name].env, ...lambdaEnv }
                : lambdaEnv,
            handler: 'index.handler',
            permissions: permissions,
            timeout:
                config[x.name] && config[x.name].timeout
                    ? config[x.name].timeout
                    : 6,
            layers: config[x.name] ? config[x.name].layers : []
        })

        template.Resources = {
            ...template.Resources,
            ...res.Resources
        }
        template.Outputs = {
            ...template.Outputs,
            ...{
                [`Lambda${x.name}${stage}Arn`]: {
                    Value: {
                        'Fn::GetAtt': [`Lambda${x.name}${stage}`, 'Arn']
                    }
                }
            }
        }

        /**
         * Event Rule
         */
        const t = config[x.name].eventRule
        if (t !== 'None') {
            t.forEach((r) => {
                const cf = makeEventRule({
                    appName: appName + stage,
                    eventBus: r.bus || 'default',
                    eventSource: r.source,
                    eventName: r.name,
                    lambdaName: `Lambda${x.name}${stage}`
                })
                template.Resources = {
                    ...template.Resources,
                    ...cf.Resources
                }
            })
        }

        /**
         * Schedule
         */
        const schedule = config[x.name].schedule
        if (typeof config[x.name].schedule === 'number') {
            const cf = makeScheduleTrigger({
                lambdaName: x.name,
                rate: schedule
            })
            template.Resources = {
                ...template.Resources,
                ...cf.Resources
            }
        }

        /**
         * Url
         */
        const url = config[x.name].url
        if (url !== 'None') {
            const cf = makeLambdaUrl({
                lambdaName: x.name
            })
            template.Resources = {
                ...template.Resources,
                ...cf.Resources
            }
            template.Outputs = {
                ...template.Outputs,
                ...cf.Outputs
            }

            Object.keys(cf.Outputs).forEach((k) => outputs.push(k))
        }

        /**
         * Make Alarm
         */
        const alarmConfig = config[x.name].alarm
        if (alarmConfig !== 'None') {
            const cf = makeLambdaErrorAlarm({
                appName,
                stage,
                name: x.name + 'Alarm',
                description: alarmConfig.description || '',
                functionName: `${appName}-${x.name}-${stage}`,
                threshold: alarmConfig.threshold,
                period: alarmConfig.period || 300,
                evaluationPeriods: alarmConfig.evaluationPeriods || 3,
                snsTopic: alarmConfig.snsTopic || undefined
            })

            template.Resources = {
                ...template.Resources,
                ...cf.Resources
            }
        }
    })

    /**
     * Result
     */

    // if (urlConfigs.length > 0) {
    //     outputs.push('ApiUrl')
    // }

    // if (addAuth) {
    //     outputs.push('UserPoolClientId')
    //     outputs.push('UserPoolId')
    // }

    const result = await deployInfra({
        name: appName,
        stage,
        region,
        template: JSON.stringify(template),
        outputs
    })

    if (result.status === 'error') {
        throw new Error(result.message)
    }

    const theResult = { endpoints: [] }
    outputs.forEach((k) => {
        theResult.endpoints.push(`${k}: ${result.outputs[k]}`)
    })

    // if (urlConfigs.length > 0) {
    //     theResult.endpoints = urlConfigs.map((x) => {
    //         const n = x.name.slice(6) //.slice(0, -Math.abs(stage.length))
    //         return `${n}: ${result.outputs['ApiUrl']}/${x.path}`
    //     })
    // }

    // if (addAuth) {
    //     theResult.userPoolClient = result.outputs['UserPoolClientId']
    //     theResult.userPool = result.outputs['UserPoolId']
    // }

    return theResult
}
