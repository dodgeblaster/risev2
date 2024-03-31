import * as filesystem from '../../foundation_fs/index.mjs'
import { validateFunctionConfig } from './functionconfig_validation.mjs'
import { applyKeywords } from './functionconfig_keywords.mjs'
import fs from 'fs'
import crypto from 'crypto'
import JSON5 from 'json5'

const code = () => `
import { handler as code } from './_index.mjs'

export const handler = async (e, c) => {
    return await code(e, c)
}
`

function getFunctionDirectories() {
    try {
        return filesystem.getDirectories({
            path: '/functions',
            projectRoot: process.cwd()
        })
    } catch (e) {
        if (e.message.includes('no such file or directory')) {
            return []
        }

        throw new Error(e)
    }
}

function extractConfigFromString(textContent) {
    const x1 = textContent.split('export const config = ')[1]
    let spot = 0
    let count = 0
    let charArray = x1.split('')
    for (let index = 0; index < charArray.length; index++) {
        const char = charArray[index]
        if (char === '{') count++
        if (char === '}') count--
        spot++
        if (count === 0) break
    }
    const configString = x1.split('').splice(0, spot).join('')
    return configString
}

async function getFunctionConfigFile(configPath) {
    try {
        let textContent = await filesystem.getTextContent({
            projectRoot: process.cwd(),
            path: configPath
        })

        const configStr = extractConfigFromString(textContent)
        const config = JSON5.parse(configStr)
        return config
    } catch (e) {
        throw new Error('Every function folder must have a config.mjs file ')
    }
}

export async function getFunctionConfig(appName, region, stage) {
    const keywords = {
        '@region': region,
        '@stage': stage
    }

    const dirPath = '/functions'
    let configObj = {}
    let dir = getFunctionDirectories()

    let configStr = ''
    for (const x of dir) {
        // const configPath = `${dirPath}/${x}/config.mjs`
        const configPath = `${dirPath}/${x}/index.mjs`
        const config = await getFunctionConfigFile(configPath)
        configStr = configStr + JSON.stringify(config)
        const validatedConfig = validateFunctionConfig(config, x)
        const keywordedConfig = await applyKeywords(validatedConfig, keywords)

        // Copy Dir
        filesystem.copyDir({
            source: `${dirPath}/${x}/`,
            target: `/.rise/src/lambdas/${x}`,
            projectRoot: process.cwd()
        })

        // rename index.js to _index.js
        filesystem.copyFile({
            source: `/.rise/src/lambdas/${x}/index.mjs`,
            target: `/.rise/src/lambdas/${x}/_index.mjs`,
            projectRoot: process.cwd()
        })

        // write index.js file
        filesystem.writeFile({
            path: `/.rise/src/lambdas/${x}/index.mjs`,
            content: code(appName + 'table'),
            projectRoot: process.cwd()
        })

        configObj[x] = keywordedConfig
    }

    let files = fs.readdirSync(process.cwd() + '/functions')

    let singleFileLambas = files
        .filter((x) => x.endsWith('.mjs'))
        .map((x) => x.split('.')[0])

    for (const x of singleFileLambas) {
        // const configPath = `${dirPath}/${x}/config.mjs`
        const configPath = `${dirPath}/${x}.mjs`
        const config = await getFunctionConfigFile(configPath)
        configStr = configStr + JSON.stringify(config)
        const validatedConfig = validateFunctionConfig(config, x)
        const keywordedConfig = await applyKeywords(validatedConfig, keywords)

        await filesystem.makeDir({
            path: `/.rise/src/lambdas/${x}`,
            projectRoot: process.cwd()
        })

        // rename index.js to _index.js
        filesystem.copyFile({
            source: `${dirPath}/${x}.mjs`,
            target: `/.rise/src/lambdas/${x}/_index.mjs`,
            projectRoot: process.cwd()
        })

        // write index.js file
        filesystem.writeFile({
            path: `/.rise/src/lambdas/${x}/index.mjs`,
            content: code(appName + 'table'),
            projectRoot: process.cwd()
        })

        configObj[x] = keywordedConfig
    }
    /**
     * Determine if we deploy infra or not
     */
    const hash = crypto
        .createHash('sha256')
        .update(configStr, 'utf8')
        .digest('hex')

    let deployInfra = true
    try {
        let file = await filesystem.getJsFile({
            projectRoot: process.cwd(),
            path: '/.rise/infra.mjs'
        })

        if (file.hash === hash) {
            deployInfra = false
        }
        filesystem.writeFile({
            path: `/.rise/infra.mjs`,
            content: `export const hash = '${hash}'`,
            projectRoot: process.cwd()
        })
    } catch (e) {
        // dont have one yet
        filesystem.writeFile({
            path: `/.rise/infra.mjs`,
            content: `export const hash = '${hash}'`,
            projectRoot: process.cwd()
        })
        deployInfra = true
    }

    return {
        functionConfigs: configObj,
        deployInfra
    }
}
