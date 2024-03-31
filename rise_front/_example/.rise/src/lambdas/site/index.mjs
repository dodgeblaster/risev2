import fs from 'fs'
export const handler = async (event) => {
    const routes = {
        GET: {
        '/': html('./index.html'),
        '/': html('index.html'),'/about': html('about.html'),},
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
            body: `Error: ${error.message}`
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
        body: JSON.stringify({ message: `Received data: ${data}` })
    }
}

async function getStatic(data, path) {
    const filePath = path.replace('/static', '')
    const fileExtension = path.split('.').pop()
    const contentType = getContentType(fileExtension)

    try {
        const fileData = await fs.promises.readFile(
            `${process.env.LAMBDA_TASK_ROOT}${filePath}`
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
            body: `File not found: ${filePath}`
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
