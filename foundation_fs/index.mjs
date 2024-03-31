import fsextra from 'fs-extra'
import fs from 'fs'
import archiver from 'archiver'
import path from 'path'

/**
 * Helpers
 */
function formatWithTrailingSlash(x) {
    return x + (x[x.length - 1] !== '/' ? '/' : '')
}

/**
 * Folders
 */
export function getDirectories(input) {
    // const dirPath = input.projectRoot + input.path
    // const files = fs.readdirSync(dirPath)
    // const directories = files.filter((file) => {
    //     const filePath = path.join(dirPath, file)
    //     return fs.statSync(filePath).isDirectory()
    // })

    // return directories

    return fsextra
        .readdirSync(input.projectRoot + input.path, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
}

export async function makeDir(input) {
    // const directoryPath = input.projectRoot + input.path
    // try {
    //     await fs.mkdirSync(directoryPath, { recursive: true })
    //     //  console.log(`Directory "${directoryPath}" created successfully.`)
    // } catch (e) {
    //     if (e.code === 'EEXIST') {
    //         console.log(`Directory "${directoryPath}" already exists.`)
    //         return
    //         //throw new Error(e.message)
    //     } else {
    //         console.error(`Error creating directory "${directoryPath}":`, e)
    //         throw new Error(e.message)
    //     }
    // }

    try {
        await fsextra.mkdir(input.projectRoot + input.path)
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.startsWith('EEXIST: file already exists')) {
                return
            }
            throw new Error(e.message)
        } else {
            throw new Error('Unknown Error')
        }
    }
}

export async function removeDir(input) {
    const thepath = input.projectRoot + input.path
    fsextra.removeSync(thepath)
    // async function removeDirectory(directoryPath) {
    //     try {
    //         const files = await fs.readdirSync(directoryPath)

    //         for (const file of files) {
    //             const filePath = path.join(directoryPath, file)
    //             const stats = await fs.statSync(filePath)

    //             if (stats.isDirectory()) {
    //                 await removeDirectory(filePath)
    //             } else {
    //                 await fs.unlinkSync(filePath)
    //             }
    //         }

    //         await fs.rmdirSync(directoryPath)
    //         //  console.log(`Directory "${directoryPath}" removed successfully.`)
    //     } catch (err) {
    //         console.error(`Error removing directory "${directoryPath}":`, err)
    //     }
    // }
    // await removeDirectory(thepath)
}

export function copyDir(input) {
    const source = input.projectRoot + input.source
    const target = input.projectRoot + input.target

    fsextra.copySync(source, target)

    // const copyFolder = async (src, dest) => {
    //     try {
    //         await fs.promises.mkdir(dest, { recursive: true })
    //         const files = await fs.promises.readdir(src)

    //         for (const file of files) {
    //             const srcPath = path.join(src, file)
    //             const destPath = path.join(dest, file)

    //             const stats = await fs.promises.lstat(srcPath)

    //             if (stats.isDirectory()) {
    //                 await copyFolder(srcPath, destPath)
    //             } else {
    //                 await fs.promises.copyFile(srcPath, destPath)
    //             }
    //         }
    //     } catch (err) {
    //         console.error(`Error copying folder: ${err}`)
    //     }
    // }

    // return copyFolder(source, target)
    // .then(() => console.log('Folder copied successfully'))
    // .catch(console.error)
}

export async function zipFolder(input) {
    const COMPRESSION_LEVEL = 9
    const source = input.projectRoot + input.source
    const target = input.projectRoot + formatWithTrailingSlash(input.target)
    const name = input.name

    if (!fs.existsSync(target)) {
        fs.mkdirSync(target)
    }

    const archive = archiver('zip', { zlib: { level: COMPRESSION_LEVEL } })
    const stream = fs.createWriteStream(target + name + '.zip')
    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', (err) => reject(err))
            .pipe(stream)

        stream.on('close', () => resolve())
        archive.finalize()
    })
}

/**
 * Files
 */
export async function getFile(input) {
    const path = input.projectRoot + input.path
    return await fsextra.readFile(path)
}

export function getJsFile(input) {
    const path = input.projectRoot + input.path
    return import(path)
}

export function writeFile(input) {
    const path = input.projectRoot + input.path
    fsextra.writeFileSync(path, input.content)
}

export function removeFile(input) {
    const path = input.projectRoot + input.path
    fsextra.removeSync(path)
}

export function copyFile(input) {
    const source = input.projectRoot + input.source
    const target = input.projectRoot + input.target
    fsextra.copyFileSync(source, target)
}

export async function getTextContent(input) {
    const path = input.projectRoot + input.path
    return fs.readFileSync(path, 'utf8')
}
