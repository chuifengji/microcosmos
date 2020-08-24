import { parseHtml } from "./htmlLoader"

export async function prefetch() {
    const appPieces = getPieces(window.appList, 3)
    await appPieces.reduce(async (p, pieces) => {
        await p
        return Promise.all(
            pieces.map(async app => (await parseHtml)(app.entry, app.name))
        )
    }, Promise.resolve())
}

function getPieces(arr, count) {
    if (count < 1) throw 'count must greatter than 0'
  
    const result = Array(Math.ceil(arr.length / count)).fill([]).map(v => v.slice())
    for (let i = 0, j = 0; i < arr.length; i++) {
        if (result[j].length === count) j += 1
        result[j].push(arr[i])
    }

    return result
}

// TODO: 已经加载的App不要prefetch
// TODO: 函数节流，主要是针对应用切换那里，应该有函数节流，避免出现莫名奇妙的情况。