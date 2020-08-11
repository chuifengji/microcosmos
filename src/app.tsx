import { appConfigMatch, appConfigDefaultLoad } from "./types"
import { routerChange } from "./util/routerHandler"
import { loadHtml } from "./htmlLoader/htmlLoader"
window.onhashchange = routerChange;
window.appList = [];
export function register(apps: appConfigMatch) {
    apps.forEach(item => window.appList.push(item))
}
export function directLoad(apps: appConfigDefaultLoad) {
    apps.forEach(item => window.appList.push(item))
}

export function start(): void {
    if (!window.appList) { throw Error('are you sure you have successfully imported apps?') }

}