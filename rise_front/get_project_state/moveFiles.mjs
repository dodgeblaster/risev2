import fs from 'fs'
import path from 'path'

const handlerFile = (routes) => `import fs from 'fs'
export const handler = async (event) => {
    const routes = {
        GET: ${routes},
        POST: {
            '/submit': handlePostSubmit
        }
    }

    return await serve(event, routes)
}

async function serve(event, routes) {
    const requestData = event.body
    const method = event.requestContext.http.method
    const path = event.requestContext.http.path
    const handler = routes[method][path] || getStatic
    if (!handler) {
        return {
            statusCode: 404,
            body: 'Not found'
        }
    }

    try {
        const response = await handler(requestData, path)
        return response
    } catch (error) {
        return {
            statusCode: 500,
            body: \`Error: \${error.message}\`
        }
    }
}

function html(path) {
    return () => {
        const content = fs.readFileSync(path, { encoding: 'utf-8' })
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: content
        }
    }
}

async function handlePostSubmit(data) {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: \`Received data: \${data}\` })
    }
}

async function getStatic(data, path) {
    const filePath = path.replace('/static', '')
    const fileExtension = path.split('.').pop()
    const contentType = getContentType(fileExtension)

    try {
        const fileData = await fs.promises.readFile(
            \`\${process.env.LAMBDA_TASK_ROOT}\${filePath}\`
        )
        return {
            statusCode: 200,
            headers: { 'Content-Type': contentType },
            body: fileData.toString('base64'),
            isBase64Encoded: true
        }
    } catch (error) {
        return {
            statusCode: 404,
            body: \`File not found: \${filePath}\`
        }
    }
}

function getContentType(fileExtension) {
    const contentTypes = {
        css: 'text/css',
        js: 'application/javascript',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif'
    }

    return contentTypes[fileExtension] || 'application/octet-stream'
}
`

// Helper function to copy a file
function copyFile(src, dest) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(src)
        const writeStream = fs.createWriteStream(dest)

        readStream.on('error', reject)
        writeStream.on('error', reject)

        writeStream.on('close', resolve)

        readStream.pipe(writeStream)
    })
}

// Helper function to copy a directory
async function copyDirectory(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true })
    const entries = await fs.promises.readdir(src, { withFileTypes: true })

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath)
        } else {
            await copyFile(srcPath, destPath)
        }
    }
}

// Main function to copy the root project folder except the ".rise" folder
export async function copyProject() {
    const rootDir = process.cwd() // Get the current working directory (root project folder)
    const riseDir = path.join(rootDir, '.rise') // Path to the ".rise" folder
    const destDir = path.join(riseDir, 'src/lambdas/site') // Destination path: "./.rise/project"

    const entries = await fs.promises.readdir(rootDir, { withFileTypes: true })

    for (const entry of entries) {
        const srcPath = path.join(rootDir, entry.name)

        if (
            entry.isDirectory() &&
            entry.name !== '.rise' &&
            entry.name !== 'rise.mjs'
        ) {
            await copyDirectory(srcPath, path.join(destDir, entry.name))
        } else if (
            !entry.isDirectory() &&
            entry.name !== '.rise' &&
            entry.name !== 'rise.mjs'
        ) {
            await copyFile(srcPath, path.join(destDir, entry.name))
        }
    }

    const config = await import(rootDir + '/rise.mjs')

    let routes = `{
        '/': html('./index.html'),
        `

    Object.keys(config.default.routes).forEach((k) => {
        routes = routes + `'${k}': html('${config.default.routes[k]}'),`
    })

    routes = routes + '}'

    fs.writeFileSync(destDir + '/index.mjs', handlerFile(routes))

    console.log('Project copied successfully!')
}
