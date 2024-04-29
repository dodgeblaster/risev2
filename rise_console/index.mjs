import s from './src/server.mjs'
import { getPipelineData } from './src/pipelines.mjs'

import { getLogs } from './src/logs.mjs'
const server = s()

server.front('front')

server.api('/pipeline', async (x) => {
    return await getPipelineData(x.name)
})

server.api('/logs', async (x) => {
    return await getLogs(x.name)
})

server.start()
