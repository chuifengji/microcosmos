import { appConfigMatch, appConfigDefaultLoad } from "./util/types"
import { routerChange } from "./router/routerHandler"
import { loadHtml } from "./htmlLoader/htmlLoader"
import { patchEventListener } from "./util/handlers"
window.appList = [];
window.history.pushState = patchEventListener(window.history.pushState, "cosmos_pushState");
window.history.replaceState = patchEventListener(window.history.replaceState, "cosmos_replaceState");
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
        window.addEventListener("cosmos_pushState", routerChange);
        window.addEventListener("cosmos_replaceState", routerChange);
        window.appList.forEach(item => { !item.matchRouter ? loadHtml(item.container, item.entry, item.name) : console.log('not direct load app') })//需要直接载入的app就直接load
    }
}


