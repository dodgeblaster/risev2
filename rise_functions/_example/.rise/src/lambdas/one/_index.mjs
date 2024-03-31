export const config = {
    url: true
}

export const handler = async (e) => {
    console.log(JSON.stringify(e, null, 2))
    return {
        statusCode: 200,
        body: 'hi there'
    }
}
