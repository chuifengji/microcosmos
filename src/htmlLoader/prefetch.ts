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