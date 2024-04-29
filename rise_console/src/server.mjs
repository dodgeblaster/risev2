import http from 'http'
import fs from 'fs'
import url from 'url'
//import WebSocket from 'ws'

function getFileContent(path) {
    return fs.readFileSync(path, {
        encoding: 'utf-8'
    })
}

export default function create() {
    let staticPath = 'public/'
    let routes = []
    return {
        front: (path) => {
            staticPath = path
        },
        api: (path, fn) => {
            routes.push({
                path,
                method: 'POST',
                fn
            })
        },
        start: (port = 3000) => {
            const server = http.createServer(async (req, res) => {
                const parsedUrl = url.parse(req.url, true)
                if (req.method === 'GET') {
                    const pathRaw = parsedUrl.pathname
                    if (pathRaw === '/') {
                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                            //  'Access-Control-Allow-Origin': 'http://localhost:3000'
                        })
                        const content = getFileContent(
                            staticPath + 'index.html'
                        )
                        res.end(content)
                        return
                    }
                    const path = staticPath + pathRaw
                    const type = pathRaw.split('.')[1]
                    const content = getFileContent(path)
                    let contentType = 'text/plain'
                    if (type === 'html') {
                        contentType = 'text/html'
                    }

                    if (type === 'css') {
                        contentType = 'text/css'
                    }

                    if (type === 'js') {
                        contentType = 'application/javascript'
                    }

                    if (type === 'png') {
                        contentType = 'image/png'
                    }
                    if (type === 'jpeg') {
                        contentType = 'image/jpeg'
                    }
                    if (type === 'jpg') {
                        contentType = 'image/jpeg'
                    }

                    res.writeHead(200, {
                        'Content-Type': contentType
                        //  'Access-Control-Allow-Origin': 'http://localhost:3000'
                    })
                    res.end(content)
                    return
                }

                console.log(parsedUrl.pathname)
                for (const route of routes) {
                    if (
                        req.method === route.method &&
                        req.method === 'POST' &&
                        parsedUrl.pathname === '/api' + route.path
                    ) {
                        try {
                            let body = ''

                            req.on('data', (chunk) => {
                                body += chunk.toString()
                            })

                            req.on('end', async () => {
                                const jsonData = JSON.parse(body)

                                const x = await route.fn(jsonData)

                                res.writeHead(200, {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin':
                                        'http://localhost:3000'
                                })
                                res.end(JSON.stringify(x))
                                //
                            })
                        } catch (error) {
                            console.error('Error parsing JSON:', error)

                            // Send a JSON error response
                            const errorResponse = {
                                status: 'error',
                                message: error.message
                            }
                            res.writeHead(400, {
                                'Content-Type': 'application/json'
                            })
                            res.end(JSON.stringify(errorResponse))
                        }
                    }
                }
            })

            // const wss = new WebSocket.Server({ server })
            // wss.on('connection', (ws) => {
            //     console.log('WebSocket connection established')

            //     ws.on('message', (message) => {
            //         console.log('Received message:', message)
            //         ws.send(`Server received: ${message}`)
            //     })

            //     ws.send('Hello from server!')
            // })

            server.listen(port, () => {
                console.log(`Server is running at http://localhost:${port}/`)
            })
        }
    }
}
