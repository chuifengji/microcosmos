import { appConfigMatch, appConfigDefaultLoad } from "./util/types"
import { routerChange } from "./router/routerHandler"
import { loadHtml } from "./htmlLoader/htmlLoader"
window.appList = [];
export function register(apps: appConfigMatch) {
    apps.forEach(item => window.appList.push(item))
}
export function directLoad(apps: appConfigDefaultLoad) {
    apps.forEach(item => window.appList.push(item))
}

export function start(): void {
    if (!window.appList) { throw Error('are you sure you have successfully imported apps?') } else {
        console.log(window.location.href);
        window.onhashchange = routerChange;//开启路由侦测
        window.appList.forEach(item => { item.matchRouter ? loadHtml(item.entry, item.container) : false })//需要直接载入的app就直接load
    }
}