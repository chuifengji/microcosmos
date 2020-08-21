import { createProxy } from "./proxy";
import { memorize, findApp } from "../util/handlers"
import { checkLifecycle } from "../util/errorHandler"
import { _app, _lifecycle } from "../util/types"
export function runScript(
    script: string,
    appName: string,
    proxyEnvir: any,//TODO:需要类型增强
): _lifecycle {
    console.log(proxyEnvir)
    const execscript =
        `try { 
         ${script} 
         return window['${appName}']
        } catch (err) {
            console.error('error occurred while executing the code in the sandbox:' + err);
        }`
    const performer = new Function('window', execscript);
    return performer.call(proxyEnvir, proxyEnvir);
}
export function sandbox(script: string, appName: string) {
    let createSandbox = memorize(createProxy, 2),
        app: _app = findApp(appName),
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