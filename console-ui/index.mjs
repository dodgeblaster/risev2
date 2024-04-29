/* 

┌───┬───┬───┐
│ 0 │ 1 │ 2 │
├───┼───┼───┤
│ a ╎ b ╎ c │
└───┴───┴───┘



*/
import { getMetrics } from './aws.mjs'
import { plot, cyan, blue, magenta, red } from './graph.mjs'
import { makeGraph } from './gg.mjs'

async function main() {
    const res = await getMetrics()

    res.forEach((res, i) => {
        let name = 'Traffic'
        if (i === 1) name = 'Latency'
        if (i === 2) name = 'Errors'

        let color = magenta
        if (i === 1) color = blue
        if (i === 2) color = cyan

        console.log('')
        console.log(`${name}`)

        //makeGraph(res)
        const padding = '       '
        console.log(
            plot([res], {
                // height: 10,
                max: 10,
                min: 0,
                padding,
                height: 10,
                colors: [color],
                format: function (x, i) {
                    return (padding + parseInt(x)).slice(-padding.length)
                }
            })
        )
    })

    // return
    // var s0 = new Array(120)
    // for (var i = 0; i < s0.length; i++) {
    //     s0[i] = 15 * Math.sin(i * ((Math.PI * 4) / s0.length))
    // }

    // const dd = () => Array.from({ length: 100 }).map((x) => Math.random() * 10)

    // console.log('───── Traffic ────────────────────────────────────────────')
    // console.log(
    //     plot(dd(), {
    //         // height: 10,
    //         min: 10,
    //         max: 20,
    //         height: 8,
    //         colors: [magenta]
    //     })
    // )
    // console.log('')
    // console.log('───── Latancy ────────────────────────────────────────────')
    // console.log(
    //     plot([dd()], {
    //         height: 8,
    //         colors: [cyan]
    //     })
    // )
    // console.log('')
    // console.log('───── Errors ────────────────────────────────────────────')
    // console.log(
    //     plot([dd()], {
    //         height: 8,
    //         colors: [red]
    //     })
    // )
    const dotsA = {
        '1-1': '⠤',
        '1-1': '⠦',
        '1-1': '⠴',
        '1-1': '⠶',
        '1-1': '⠷',
        '1-1': '⠧',
        '1-1': '⠇',
        '1-1': '⠆',
        '1-1': '⠄'
    }

    const dots = {
        4: '⣿',
        3: '⣶',
        2: '⣤',
        1: '⣀',
        0: ' '
    }

    const def = ['1134200030', '4444442131', '4444444444']

    let ui = (r) =>
        r
            .split('')
            .map((c) => dots[c])
            .join('')

    // def.forEach((x) => console.log('\x1b[35m' + ui(x)))
}
main()
