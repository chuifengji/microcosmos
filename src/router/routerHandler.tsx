import { loadHtml } from "../htmlLoader/htmlLoader"

export function routerChange() {
    window.appList.forEach(item => {
        if (item.matchRouter === window.location.hash) {
            loadHtml(item.container, item.entry, item.name)
        }
    })
}