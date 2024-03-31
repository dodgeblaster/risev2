function validateAlarmConfig(input) {
    if (!input.config.alarm) return 'None'
    const alarm = input.config.alarm

    /**
     * Required
     */
    if (!alarm.threshold) {
        throw new Error(
            input.functionName + ' config.alarm must have a threshold property'
        )
    }

    if (typeof alarm.threshold !== 'number') {
        throw new Error(
            input.functionName + ' config.alarm.threshold must be a number'
        )
    }

    if (!alarm.snsTopic) {
        throw new Error(
            input.functionName + ' config.alarm must have a snsTopic property'
        )
    }

    if (typeof alarm.snsTopic !== 'string') {
        throw new Error(
            input.functionName + ' config.alarm.snsTopic must be a string'
        )
    }

    /**
     * Optional
     */
    if (alarm.period && typeof alarm.period !== 'number') {
        throw new Error(
            input.functionName + ' config.alarm.period must be a number'
        )
    }

    if (
        alarm.evaluationPeriods &&
        typeof alarm.evaluationPeriods !== 'number'
    ) {
        throw new Error(
            input.functionName +
                ' config.alarm.evaluationPeriods must be a number'
        )
    }

    if (alarm.evaluationPeriods && alarm.evaluationPeriods < 10) {
        throw new Error(
            input.functionName +
                ' config.alarm.evaluationPeriods must be above or greater than 10'
        )
    }

    if (alarm.description && typeof alarm.description !== 'string') {
        throw new Error(
            input.functionName + ' config.alarm.description must be a string'
        )
    }

    return alarm
}

function validateEnv(input) {
    if (!input.config.env) return {}
    const env = input.config.env

    Object.keys(env).forEach((k) => {
        if (typeof env[k] !== 'string') {
            throw new Error(
                input.functionName + ' config.env values must be a string'
            )
        }
    })

    return env
}

function validateEventRuleConfig(input) {
    if (!input.config.eventRule) return 'None'

    let formattedRuleArray = []
    const ruleArray = Array.isArray(input.config.eventRule)
        ? input.config.eventRule
        : [input.config.eventRule]

    for (const eventRule of ruleArray) {
        if (!eventRule.source) {
            throw new Error(
                input.functionName +
                    ' config.eventRule must have a source property'
            )
        }

        if (typeof eventRule.source !== 'string') {
            throw new Error(
                input.functionName + ' config.eventRule.source must be a string'
            )
        }

        if (!eventRule.name) {
            throw new Error(
                input.functionName +
                    ' config.eventRule must have a name property'
            )
        }

        if (typeof eventRule.name !== 'string') {
            throw new Error(
                input.functionName + ' config.eventRule.name must be a string'
            )
        }

        formattedRuleArray.push({
            ...eventRule,
            bus: eventRule.eventBus || 'default'
        })
    }

    return formattedRuleArray
}

function validatePermissions(input) {
    if (!input.config.permissions) return []
    const permissions = input.config.permissions

    permissions.forEach((permission) => {
        if (typeof permission !== 'object') {
            throw new Error(
                input.functionName +
                    ' config.permissions must be an array of objects'
            )
        }

        if (!permission.Action) {
            throw new Error(
                input.functionName +
                    ' config.permissions objects must have a Action property'
            )
        }

        if (
            typeof permission.Action !== 'string' &&
            !Array.isArray(permission.Action)
        ) {
            throw new Error(
                input.functionName +
                    ' config.permissions objects Action must be a string or an array '
            )
        }

        if (!permission.Effect) {
            throw new Error(
                input.functionName +
                    ' config.permissions objects must have a Effect property'
            )
        }

        if (typeof permission.Effect !== 'string') {
            throw new Error(
                input.functionName +
                    ' config.permissions objects Effect must be a string'
            )
        }

        if (!permission.Resource) {
            throw new Error(
                input.functionName +
                    ' config.permissions objects must have a Resource property'
            )
        }

        if (
            typeof permission.Resource !== 'string' &&
            !Array.isArray(permission.Resource)
        ) {
            throw new Error(
                input.functionName +
                    ' config.permissions objects Resource must be a string or an array'
            )
        }
    })

    return permissions
}

function validateTimeout(input) {
    function isInt(n) {
        return n % 1 === 0
    }

    if (!input.config.timeout) return 6
    const timeout = input.config.timeout

    if (typeof timeout !== 'number') {
        throw new Error(input.functionName + ' config.timeout must be a number')
    }

    if (timeout < 0) {
        throw new Error(
            input.functionName + ' config.timeout cannot be a negative number'
        )
    }

    if (timeout > 900) {
        throw new Error(
            input.functionName +
                ' config.timeout cannot be bigger than 900 (15 minutes)'
        )
    }

    if (!isInt(timeout)) {
        throw new Error(
            input.functionName + ' config.timeout must not be a float'
        )
    }
    return timeout
}

function validateUrlConfig(input) {
    if (!input.config.url) return 'None'
    return true
}

export function validateFunctionConfig(config, functionName) {
    const defualtConfig = {
        url: 'None',
        eventRule: 'None',
        env: {},
        permissions: [],
        alarm: 'None',
        timeout: 6,
        schedule: 'None',
        layers: [],
        furl: false
    }

    if (!config) return defualtConfig

    return {
        url: validateUrlConfig({ config, functionName }),
        eventRule: validateEventRuleConfig({ config, functionName }),
        env: validateEnv({ config, functionName }),
        permissions: validatePermissions({ config, functionName }),
        alarm: validateAlarmConfig({ config, functionName }),
        timeout: validateTimeout({ config, functionName }),
        schedule: config.schedule || 'None'
    }
}
