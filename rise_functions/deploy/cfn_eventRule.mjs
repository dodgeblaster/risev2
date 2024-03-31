/** function that takes in a string and removes all instances of - and _ */
export function toCamelCase(str) {
    return str
        .replace(/[-_](\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/[-_]/g, '')
}

/**
 * @param {object} props
 * @param {string} props.appName
 * @param {string} props.eventBus
 * @param {string} props.eventSource
 * @param {string} props.eventName
 * @param {string} props.lambdaName
 */
export function makeEventRule({
    appName,
    eventBus,
    eventSource,
    eventName,
    lambdaName
}) {
    const eventLogicalId = toCamelCase(`EventListener${appName}${eventName}`)
    const roleLogicalId = toCamelCase(`EventRuleRole${appName}${eventName}`)
    return {
        Resources: {
            [eventLogicalId]: {
                Type: 'AWS::Events::Rule',
                Properties: {
                    EventBusName: eventBus,
                    EventPattern: {
                        source: [`${eventSource}`],
                        'detail-type': [eventName]
                    },
                    Targets: [
                        {
                            Arn: {
                                'Fn::GetAtt': [lambdaName, 'Arn']
                            },
                            Id: eventLogicalId
                        }
                    ]
                }
            },

            [roleLogicalId]: {
                Type: 'AWS::Lambda::Permission',
                Properties: {
                    FunctionName: {
                        'Fn::GetAtt': [lambdaName, 'Arn']
                    },
                    Action: 'lambda:InvokeFunction',
                    Principal: 'events.amazonaws.com',
                    SourceArn: {
                        'Fn::GetAtt': [eventLogicalId, 'Arn']
                    }
                }
            }
        },
        Outputs: {}
    }
}
