/** function that takes in a string and removes all instances of - and _ */
export function toCamelCase(str) {
    return str
        .replace(/[-_](\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/[-_]/g, '')
}

export const makeLambdaUrl = (config) => {
    const k = config.lambdaName
    return {
        Resources: {
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
        },
        Outputs: {
            [`${toCamelCase(k)}Url`]: {
                Value: {
                    'Fn::GetAtt': [`Furl${k}`, 'FunctionUrl']
                }
            }
        }
    }
}
