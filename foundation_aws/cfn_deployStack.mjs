import awsLite from '@aws-lite/client'

async function createStack(props) {
    const aws = await awsLite({
        region: props.region || process.env.AWS_REGION || 'us-east-1',
        plugins: [import('@aws-lite/cloudformation')]
    })
    const input = {
        StackName: props.name,
        Capabilities: [
            'CAPABILITY_IAM',
            'CAPABILITY_AUTO_EXPAND',
            'CAPABILITY_NAMED_IAM'
        ],
        TemplateBody: props.template
    }
    return await aws.CloudFormation.CreateStack(input)
}

async function updateStack(props) {
    const aws = await awsLite({
        region: props.region || process.env.AWS_REGION || 'us-east-1',
        plugins: [import('@aws-lite/cloudformation')]
    })
    const input = {
        StackName: props.name,
        Capabilities: [
            'CAPABILITY_IAM',
            'CAPABILITY_AUTO_EXPAND',
            'CAPABILITY_NAMED_IAM'
        ],
        TemplateBody: props.template
    }
    return await aws.CloudFormation.UpdateStack(input)
}

export async function deployStack(props) {
    try {
        const res = await updateStack({
            region: props.region,
            name: props.name,
            template: props.template
        })

        return {
            status: 'updating',
            id: res.StackId
        }
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('does not exist')) {
                const res = await createStack({
                    region: props.region,
                    name: props.name,
                    template: props.template
                })

                return {
                    status: 'creating',
                    id: res.StackId
                }
            }

            if (e.message.includes('No updates are to be performed.')) {
                return {
                    status: 'nothing'
                }
            }

            if (e.message.includes('CREATE_IN_PROGRESS')) {
                return {
                    status: 'createinprogress'
                }
            }

            if (e.message.includes('UPDATE_IN_PROGRESS')) {
                return {
                    status: 'updateinprogress'
                }
            }

            if (e.message.includes('DELETE_IN_PROGRESS')) {
                return {
                    status: 'deleteinprogress'
                }
            }
            throw new Error(e.message)
        }
    }
}
