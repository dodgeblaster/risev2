import {
    addCommand,
    runProgram,
    startLoadingMessage,
    endLoadingMessage,
    clear,
    hideCursor,
    showCursor
} from '../foundation_cli/index.mjs'
import { deployInfra } from '../deploy_infra/index.mjs'
import * as filesystem from '../foundation_fs/index.mjs'

addCommand({
    command: 'deploy',
    action: async () => {
        console.time('✅ Deployed Successfully \x1b[2mDeploy Time')
        hideCursor()

        const config = await filesystem.getJsFile({
            path: '/rise.mjs',
            projectRoot: process.cwd()
        })

        const template = await filesystem.getTextContent({
            path: '/template.yml',
            projectRoot: process.cwd()
        })

        startLoadingMessage('Deploying Infra')
        const result = await deployInfra({
            name: config.default.name,
            stage: '', // flags.stage,
            region: flags.region,
            template: template,
            outputs: []
        })

        if (result.status === 'error') {
            showCursor()
            throw new Error(result.message)
        }

        endLoadingMessage()

        clear()
        console.timeEnd('✅ Deployed Successfully \x1b[2mDeploy Time')
        showCursor()
    }
})
