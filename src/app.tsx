import { _appConfigMatch, _appConfigDefaultLoad } from "./util/types"
import { routerChange } from "./router/routerHandler"
import { patchEventListener, firstApp } from "./util/handlers"

window.appList = [];
window.history.pushState = patchEventListener(window.history.pushState, "cosmos_pushState");
window.history.replaceState = patchEventListener(window.history.replaceState, "cosmos_replaceState");

export function register(apps: _appConfigMatch) {
    apps.forEach(item => window.appList.push(item))
}
export function directLoad(apps: _appConfigDefaultLoad) {
    apps.forEach(item => window.appList.push(item))
}

export function start(): void {
    if (!window.appList) { throw Error('are you sure you have successfully imported apps?') } else {
        window.onhashchange = routerChange;//TODO:hash式是否要保留咧~
        window.addEventListener("cosmos_pushState", routerChange);
        window.addEventListener("cosmos_replaceState", routerChange);
        window.appList.forEach(app => { !app.matchRouter ? window.history.pushState(app.matchRouter as string, app.name, app.matchRouter as string) : false })
        const app = firstApp();
        app ? window.history.pushState(app.matchRouter as string, app.name, app.matchRouter as string) : false
    }
}


