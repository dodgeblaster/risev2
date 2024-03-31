import { makeFolders } from './makeFolders.mjs'
import { getAppConfig } from './appconfig.mjs'
import { getFunctionConfig } from './functionconfig.mjs'

export const getConfig = async (flags) => {
    await makeFolders()

    let appConfig = await getAppConfig()
    appConfig.stage = flags.stage
    appConfig.region = flags.region

    const { functionConfigs, deployInfra } = await getFunctionConfig(
        appConfig.appName,
        appConfig.region,
        appConfig.stage
    )

    let additionalResources = {
        Resources: {},
        Outputs: {}
    }

    Object.keys(functionConfigs).forEach((k) => {
        if (typeof functionConfigs[k].schedule === 'number') {
            additionalResources.Resources = {
                ...additionalResources.Resources,
                [`ScheduledRule${k}`]: {
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        Description: 'ScheduledRule',
                        ScheduleExpression: `rate(${functionConfigs[k].schedule} minutes)`,
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: {
                                    'Fn::GetAtt': [`Lambda${k}`, 'Arn']
                                },
                                Id: 'TargetFunction' + `${k}`
                            }
                        ]
                    }
                },
                [`ScheduleRulePermission${k}`]: {
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        FunctionName: { Ref: `Lambda${k}` },
                        Action: 'lambda:InvokeFunction',
                        Principal: 'events.amazonaws.com',
                        SourceArn: {
                            'Fn::GetAtt': [`ScheduledRule${k}`, 'Arn']
                        }
                    }
                }
            }
        }

        if (functionConfigs[k].furl) {
            additionalResources.Resources = {
                ...additionalResources.Resources,
                [`Furl${k}`]: {
                    Type: 'AWS::Lambda::Url',
                    Properties: {
                        AuthType: 'NONE',
                        //Cors: Cors,
                        //   Qualifier: String,
                        TargetFunctionArn: {
                            'Fn::GetAtt': [`Lambda${k}`, 'Arn']
                        }
                    }
                },
                [`InvokePermission${k}`]: {
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        FunctionName: { Ref: `Lambda${k}` },
                        FunctionUrlAuthType: 'NONE',
                        Principal: '*',
                        Action: 'lambda:InvokeFunctionUrl'
                    }
                }
            }
        }
    })

    return {
        app: appConfig,
        functions: functionConfigs,
        deployName: appConfig.appName.replace(/\s/g, '') + 'functions',
        zipConfig: {
            functionsLocation: '/.rise/src/lambdas',
            zipTarget: '/.rise/lambdas',
            hiddenFolder: '.rise'
        },
        deployInfra: deployInfra,
        additionalResources,
        deployInfra: true //flags.ci === 'true'
    }
}
