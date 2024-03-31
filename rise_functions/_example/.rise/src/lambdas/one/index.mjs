
import { handler as code } from './_index.mjs'

export const handler = async (e, c) => {
    return await code(e, c)
}
