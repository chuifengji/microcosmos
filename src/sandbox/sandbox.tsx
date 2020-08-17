import { createProxy } from "./proxy";
import { memorize, findApp } from "../util/handlers"
import { checkLifecycle } from "../util/errorHandler"
import { _app } from "../util/types"
export function runScript(
    script: string,
    appName: string,
    proxyEnvir: any,//TODO:需要类型增强
) {
    const execscript: string =
        `with(proxyEnvir.INTERNAL_STATE_KEY){
             ${script} 
          }`
    const performer = new Function('proxyEnvir', execscript);
    try {
        performer.call(proxyEnvir, proxyEnvir);
        return proxyEnvir[appName];
    } catch (err) {
        console.error(`error occurred while executing the code in the sandbox:` + err);
    }
}

export function sandbox(script: string, appName: string) {
    let createSandbox = memorize(createProxy, 2),
        app: _app = findApp(window.appList, appName),
        proxyEnvir = createSandbox(window as any, null, appName),
        lifeCycles = runScript(script, appName, proxyEnvir);
    app.sandBox = proxyEnvir;
    try {
        checkLifecycle(lifeCycles, appName)
    } catch (err) {
        console.error(err)
    }
    app.bootstrap = lifeCycles.bootstrap;
    app.mount = lifeCycles.mount;
    app.unmount = lifeCycles.unmount;
}
