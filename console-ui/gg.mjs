const data = [
    5, 4, 6, 3, 3, 3, 8, 4, 3, 4, 3, 1, 1, 2, 1, 5, 56, 54, 217, 379, 380, 256,
    272, 236, 236, 86, 160, 243, 351, 772, 307, 232, 206, 633, 404, 706, 206,
    67, 308, 218, 150, 238, 252, 74, 220, 116, 106, 198, 115, 77, 161, 65, 80,
    194, 414, 79, 109, 111, 79, 152, 169, 409, 95, 120, 39, 165, 214, 29, 109,
    133, 47, 109
]

/* 

I have an array of numbers. I want to turn this array into a 2x2 matrix that 
represents a graph. the Y axis is the value, the x axis is time.

Each block in that matrix will represent a sprite. Each sprite displays
a 2x4 area of the graph. This means 2 points wide and 4 points high.

If I had an array like this: [3,7,8,6,1,2], I would want an output like so:
[
    ['0-3', '4-2', '0-0'],
    ['4-4', '4-4', '1-2]
]   

Can you make a node js function that takes an input and returns an output like this?
*/

const brailUp = {
    '0-0': ' ',
    '0-1': '⢀',
    '0-2': '⢠',
    '0-3': '⢰',
    '0-4': '⢸',
    '1-0': '⡀',
    '1-1': '⣀',
    '1-2': '⣠',
    '1-3': '⣰',
    '1-4': '⣸',
    '2-0': '⡄',
    '2-1': '⣄',
    '2-2': '⣤',
    '2-3': '⣴',
    '2-4': '⣼',
    '3-0': '⡆',
    '3-1': '⣆',
    '3-2': '⣦',
    '3-3': '⣶',
    '3-4': '⣾',
    '4-0': '⡇',
    '4-1': '⣇',
    '4-2': '⣧',
    '4-3': '⣷',
    '4-4': '⣿'
}

function groupNumbers(arr) {
    const result = []
    for (let i = 0; i < arr.length; i += 2) {
        result.push(arr.slice(i, i + 2))
    }
    return result
}

function createGraphMatrix(data) {
    const MAX_VALUE = Math.max(...data)

    data = data.map((x) => x / 8)

    const SPRITE_WIDTH = 2
    const SPRITE_HEIGHT = 4

    let max = 1
    const maxHeight = data
        .map((x) => parseInt(x / 4))
        .forEach((n) => {
            if (max < n) {
                max = n
            }
        })

    const matrix = Array.from({ length: max + 1 }).map((_) => {
        return Array.from({ length: data.length / 2 }).map((_) => null)
    })

    // console.log(matrix)
    //     [

    //     [null, null, null],
    //     [null, null, null]
    // ]

    let ress = []
    let groupings = groupNumbers(data)

    for (let i = 0; i < groupings.length; i++) {
        ress.push([])
        const value = groupings[i]

        const colPosition = i

        const v1 = value[0]
        const v2 = value[1]

        Array.from({ length: max + 1 }).forEach((_, i) => {
            const sectionStart = (i + 1) * 4
            const sectionEnd = sectionStart + 4

            let firstNumber = '0'
            if (v1 < sectionStart) firstNumber = '0'
            if (v1 === sectionStart + 1) firstNumber = '1'
            if (v1 === sectionStart + 2) firstNumber = '2'
            if (v1 === sectionStart + 3) firstNumber = '3'
            if (v1 === sectionStart + 4) firstNumber = '4'
            if (v1 > sectionEnd) firstNumber = '4'

            let secondNumber = '0'
            if (v2 < sectionStart) secondNumber = '0'
            if (v2 === sectionStart + 1) secondNumber = '1'
            if (v2 === sectionStart + 2) secondNumber = '2'
            if (v2 === sectionStart + 3) secondNumber = '3'
            if (v2 === sectionStart + 4) secondNumber = '4'
            if (v2 > sectionEnd) secondNumber = '4'

            // console.log(',,,,,' + sectionStart)

            matrix[i][colPosition] = brailUp[firstNumber + '-' + secondNumber]
        })
        // const spriteRow = Math.floor(i / SPRITE_WIDTH)

        // const spriteCol = i % SPRITE_HEIGHT
        // const spriteValue = `${value}-${MAX_VALUE - value}`

        // console.log(spriteRow)
        // console.log(spriteCol)
        // console.log('--')
        // if (matrix[spriteRow][spriteCol] === null) {
        //     matrix[spriteRow][spriteCol] = spriteValue
        // } else {
        //     const existingValue = matrix[spriteRow][spriteCol]
        //     const newValue = `${existingValue},${spriteValue}`
        //     matrix[spriteRow][spriteCol] = newValue
        // }
    }

    return matrix
}

export function makeGraph(data) {
    const result = createGraphMatrix(data)

    result.reverse().forEach((r) => {
        console.log('\x1b[35m' + r.join(''))
    })
}
