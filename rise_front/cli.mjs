import {
    addCommand,
    runProgram,
    startLoadingMessage,
    endLoadingMessage,
    clear,
    printSuccessMessage
} from '../foundation_cli/index.mjs'
import { getConfig } from './get_project_state/index.mjs'
import { deployBackend } from './deploy/index.mjs'

/**
 * Program
 */

addCommand({
    command: 'deploy',
    action: async () => {
        const config = await getConfig({
            region: 'us-east-1',
            stage: 'dev'
        })
        await deployBackend(config)
    }
})

runProgram()
