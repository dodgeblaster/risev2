/**
 * @param {object} props
 * @param {string} props.appName
 * @param {string} props.stage
 * @param {string} props.bucketArn
 * @param {string} props.bucketKey
 * @param {Array.of<object>} props.permissions
 * @param {string} [props.handler]
 * @param {number} [props.timeout]
 * @param {Array.of<string>} [props.layers]
 * @param {object} [props.env]
 */
export function makeLambda(props) {
    const b = props.bucketArn.split(':::')[1]
    const basePermissions = [
        {
            Action: ['logs:CreateLogStream'],
            Resource: [
                {
                    'Fn::Sub': [
                        `arn:aws:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/${props.appName}-${props.name}-${props.stage}:*`,
                        {}
                    ]
                }
            ],
            Effect: 'Allow'
        },
        {
            Action: ['logs:PutLogEvents'],
            Resource: [
                {
                    'Fn::Sub': [
                        `arn:aws:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/${props.appName}-${props.name}-${props.stage}:*:*`,
                        {}
                    ]
                }
            ],
            Effect: 'Allow'
        }
    ]

    const permissions = [...basePermissions, ...props.permissions]
    return {
        Resources: {
            /**
             * Log Group
             */
            [`Lambda${props.name}${props.stage}LogGroup`]: {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: `/aws/lambda/${props.appName}-${props.name}-${props.stage}`
                }
            },

            /**
             * Lambda Function
             */
            [`Lambda${props.name}${props.stage}`]: {
                Type: 'AWS::Lambda::Function',
                Properties: {
                    Code: {
                        S3Bucket: b,
                        S3Key: props.bucketKey
                    },
                    FunctionName: `${props.appName}-${props.name}-${props.stage}`,
                    Handler: props.handler || 'index.handler',
                    MemorySize: 1024,
                    Role: {
                        'Fn::GetAtt': [
                            `Lambda${props.name}${props.stage}Role`,
                            'Arn'
                        ]
                    },
                    Runtime: 'nodejs18.x',
                    Timeout: props.timeout || 6,
                    Environment: {
                        Variables: props.env || {}
                    },
                    Layers: props.layers || []
                },
                DependsOn: [`Lambda${props.name}${props.stage}LogGroup`]
            },

            /**
             * Lambda Function Role
             */
            [`Lambda${props.name}${props.stage}Role`]: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: {
                                    Service: ['lambda.amazonaws.com']
                                },
                                Action: ['sts:AssumeRole']
                            }
                        ]
                    },
                    Policies: [
                        {
                            PolicyName: `Lambda${props.appName}${props.name}${props.stage}RolePolicy`,
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: permissions
                            }
                        }
                    ],
                    Path: '/',
                    RoleName: `Lambda${props.appName}${props.name}${props.stage}Role`
                }
            }
        },
        Outputs: {}
    }
}
