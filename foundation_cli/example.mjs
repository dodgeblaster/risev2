import {
    startLoadingMessage,
    endLoadingMessage,
    clear,
    hideCursor,
    showCursor,
    printSuccessMessage,
    printErrorMessage
} from './index.mjs'
import process from 'node:process'

function command(fn) {
    return async () => {
        hideCursor()
        clear()
        try {
            await fn()
            showCursor()
        } catch (e) {
            printErrorMessage(e.message)
            showCursor()
        }
    }
}

let program = {}

function addCommand(config) {
    program[config.command] = command(config.action)
}

function run() {
    const args = process.argv.slice(2)
    if (program[args[0]]) {
        program[args[0]]()
    } else {
        console.log('Command not found')
    }
}

/**
 * RUN
 */

const waiit = () =>
    new Promise((r) => {
        setTimeout(() => {
            r()
        }, 1000)
    })
addCommand({
    command: 'deploy',
    action: async () => {
        startLoadingMessage('hey')
        await waiit()
        endLoadingMessage()
        clear()
        printSuccessMessage('It worked!')
    }
})

run()
