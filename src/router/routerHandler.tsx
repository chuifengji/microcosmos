import { loadHtml } from "../htmlLoader/htmlLoader"

export function routerChange() {
    window.appList.forEach(item => {
        if (item.matchRouter === window.history.state) {
            console.log('loadHtml ' + window.history.state)
            loadHtml(item.container, item.entry, item.name)
        }
    })
}