import { loadHtml } from "../htmlLoader/htmlLoader"

export function routerChange() {
    window.appList.forEach(item => {
        if (item.matchRouter === location.hash) {
            loadHtml(item.entry, item.container)
        }
    })
}