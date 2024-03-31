export const makeScheduleTrigger = (config) => {
    const k = config.lambdaName
    const rate = config.rate
    return {
        Resources: {
            [`ScheduledRule${k}`]: {
                Type: 'AWS::Events::Rule',
                Properties: {
                    Description: 'ScheduledRule',
                    ScheduleExpression: `rate(${rate} minutes)`,
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
        },
        Outputs: {}
    }
}
