import * as aws from '../../foundation_aws/index.mjs'

async function addKeywordsToAlarmConfig(config, keywords) {
    if (config.alarm !== 'None') {
        try {
            const res = await aws.account.getKeyword(
                keywords,
                config.alarm.snsTopic
            )
            keywords = res.state
            config.alarm.snsTopic = res.result
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message)
            }
        }
    }

    return {
        config,
        keywords
    }
}

async function addKeywordsToEnv(config, keywords) {
    try {
        for (const k of Object.keys(config.env)) {
            const res = await aws.account.getKeyword(keywords, config.env[k])

            keywords = res.state
            config.env[k] = res.result
        }
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message)
        }
    }

    return {
        config,
        keywords
    }
}

async function addKeywordsToEventRule(config, keywords) {
    if (config.eventRule === 'None') {
        return {
            config,
            keywords
        }
    }

    let formattedRuleArray = []
    const ruleArray = Array.isArray(config.eventRule)
        ? config.eventRule
        : [config.eventRule]

    for (const rule of ruleArray) {
        try {
            const sourceK = await aws.account.getKeyword(keywords, rule.source)
            keywords = sourceK.state
            const nameK = await aws.account.getKeyword(keywords, rule.name)
            keywords = nameK.state
            const busK = rule.bus
                ? await aws.account.getKeyword(keywords, rule.bus)
                : { result: 'default' }
            formattedRuleArray.push({
                source: sourceK.result,
                name: nameK.result,
                bus: busK.result
            })
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message)
            }
        }
    }

    return {
        config: {
            ...config,
            eventRule: formattedRuleArray
        },
        keywords
    }
}

async function addKeywordsToPermissions(config, keywords) {
    try {
        let permissions = []
        for (const k of config.permissions) {
            if (Array.isArray(k.Resource)) {
                const resource = []
                for (const r of k.Resource) {
                    const res = await aws.account.getKeyword(keywords, r)
                    keywords = res.state
                    resource.push(res.result)
                }
                permissions.push({
                    Effect: k.Effect,
                    Action: k.Action,
                    Resource: resource
                })
            } else {
                const res = await aws.account.getKeyword(keywords, k.Resource)
                keywords = res.state
                permissions.push({
                    Effect: k.Effect,
                    Action: k.Action,
                    Resource: res.result
                })
            }
        }
        config.permissions = permissions
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message)
        }
    }

    return {
        config,
        keywords
    }
}

export async function applyKeywords(config, keywords) {
    await addKeywordsToAlarmConfig(config, keywords)
    await addKeywordsToEnv(config, keywords)
    await addKeywordsToEventRule(config, keywords)
    await addKeywordsToPermissions(config, keywords)

    return config
}
