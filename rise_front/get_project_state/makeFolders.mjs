import * as filesystem from '../../foundation_fs/index.mjs'
const HIDDEN_FOLDER = '.rise'

export async function makeFolders() {
    /**
     * Create focus folder
     */
    const projectFolder = filesystem.getDirectories({
        path: '/',
        projectRoot: process.cwd()
    })
    if (!projectFolder.includes(HIDDEN_FOLDER)) {
        await filesystem.makeDir({
            path: '/' + HIDDEN_FOLDER,
            projectRoot: process.cwd()
        })
    }

    /**
     * Create lambda folder
     */
    const focusFolder = filesystem.getDirectories({
        path: '/' + HIDDEN_FOLDER,
        projectRoot: process.cwd()
    })

    if (focusFolder.includes('lambdas')) {
        filesystem.removeDir({
            path: '/' + HIDDEN_FOLDER + '/lambdas',
            projectRoot: process.cwd()
        })
    }

    await filesystem.makeDir({
        path: '/' + HIDDEN_FOLDER + '/lambdas',
        projectRoot: process.cwd()
    })

    /**
     * Create src folder
     */
    if (focusFolder.includes('src')) {
        filesystem.removeDir({
            path: '/' + HIDDEN_FOLDER + '/src/lambdas/site',
            projectRoot: process.cwd()
        })

        filesystem.removeDir({
            path: '/' + HIDDEN_FOLDER + '/src/lambdas',
            projectRoot: process.cwd()
        })

        filesystem.removeDir({
            path: '/' + HIDDEN_FOLDER + '/src',
            projectRoot: process.cwd()
        })
    }

    await filesystem.makeDir({
        path: '/' + HIDDEN_FOLDER + '/src',
        projectRoot: process.cwd()
    })
    await filesystem.makeDir({
        path: '/' + HIDDEN_FOLDER + '/src/lambdas',
        projectRoot: process.cwd()
    })

    await filesystem.makeDir({
        path: '/' + HIDDEN_FOLDER + '/src/lambdas/site',
        projectRoot: process.cwd()
    })
}
