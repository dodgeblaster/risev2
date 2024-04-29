import s from './src/server.mjs'
import { getPipelineData } from './src/pipelines.mjs'

function line(stage, time, status, type, action, log) {
    console.log(
        `${stage || ''}\t ${time || ''}\t ${status || ''}\t ${type || ''}\t ${
            action || ''
        }\t ${log || ''}`
    )
    return {
        stage,
        time,
        status,
        type,
        action,
        log
    }
}

async function main(name) {
    let data = []
    const res = await getPipelineData(name)

    const ex = res.executions[0]

    function makeAction(a) {
        let icon = '🔴'
        if (a.status === 'InProgress') {
            icon = '🔵'
        }
        if (a.status === 'Succeeded') {
            icon = '🟢'
        }

        data.push(line(null, null, icon, a.type, a.name, a.logGroup))
        //console.log(`     ${icon} ${a.name} : ${a.logGroup}`)
        //   return `<div class='mb-1 p-2 flex flex items-center shadow rounded-lg border border-zinc-100'>
        //         <div class='bg-${color}-400 rounded p-1 mr-4'>
        //         ${a.status === 'Succeeded' ? svgCheck : ''}
        //         ${a.status === 'InProgress' ? svgProgress : ''}
        //         ${a.status === 'Failed' ? svgFail : ''}
        //         ${a.status === 'Stopped' ? svgFail : ''}
        //         ${a.status === 'Stopping' ? svgFail : ''}
        //         ${a.status === 'Cancelled' ? svgFail : ''}
        //         </div>

        //         ${a.type === 'Build' ? svgTerminal : ''}
        //         ${a.type === 'Source' ? svgGithub : ''}
        //         ${a.type === 'Deploy' ? svgCfn : ''}
        //         ${a.type === 'Invoke' ? svgFunction : ''}
        //         <p class='ml-auto text-xs'>${a.name}</p>
        //         ${
        //             a.isBuildProject
        //                 ? `<button class='text-xs rounded-lg bg-zinc-100 py-1 px-4' style='margin-left: auto' data-logname="${a.logGroup}" onclick="getLogs('${a.logGroup}')">Logs</button>`
        //                 : ''
        //         }

        //     </div>`
    }

    function makeStage(s) {
        //console.log(`${s.name} : ${s.time}`)

        data.push(line(s.name, s.time.toString().split('GMT')[0]))

        console.log('')
        s.actions.forEach(makeAction)

        console.log('')
        console.log('')

        //  return `<div class='mb-2 rounded-lg p-4' style='width: 400px;'>
        //         <p class='font-bold mb-1'>${s.name}</p>
        //         <p class='text-xs text-zinc-400 mb-4'>${s.time}</p>
        //         ${s.actions.map(makeAction).join('')}
        //     </div>`
    }

    ex.stages.map((s) => {
        return makeStage(s)
    })

    //console.table(data)
    // console.log(res)
}

main('pogpool-pipeline')
