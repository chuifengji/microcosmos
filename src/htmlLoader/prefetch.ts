import { parseHtml } from "./htmlLoader"
export async function prefetch() {
    new Promise(reslove => {
        window.appList.forEach(async app => {
            if (app.matchRouter) {
                await (await parseHtml)(app.entry, app.name);
            }
        })
    })
}

//对 appList进行切片然后用promise.all链式调用

//函数节流，主要是针对应用切换那里，应该有函数节流，避免出现莫名奇妙的情况。