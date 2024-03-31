export function makeEventRuleSchedule({
    appName,
    eventBus,
    minutes,
    lambdaName
}) {
    // expression rules: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html
    const schedule = `rate(${minutes} minutes)`
    return {
        Resources: {
            [`EventListener${appName}${lambdaName}`]: {
                Type: 'AWS::Events::Rule',
                Properties: {
                    EventBusName: eventBus,
                    ScheduleExpression: schedule,
                    State: 'ENABLED',
                    Targets: [
                        {
                            Arn: {
                                'Fn::GetAtt': [lambdaName, 'Arn']
                            },
                            Id: `EventListener${appName}${lambdaName}`
                        }
                    ]
                }
            },

            [`EventRuleRole${appName}${lambdaName}`]: {
                Type: 'AWS::Lambda::Permission',
                Properties: {
                    FunctionName: {
                        'Fn::GetAtt': [lambdaName, 'Arn']
                    },
                    Action: 'lambda:InvokeFunction',
                    Principal: 'events.amazonaws.com',
                    SourceArn: {
                        'Fn::GetAtt': [
                            `EventListener${appName}${lambdaName}`,
                            'Arn'
                        ]
                    }
                }
            }
        },
        Outputs: {}
    }
}
