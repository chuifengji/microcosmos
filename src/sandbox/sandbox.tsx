import { createProxy } from "./proxy";
import { memorize } from "../util/handlers"

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
        console.error(`error occurred while executing the code in the sandbox`);
        throw err
    }
}

export function sandbox(script: string, appName: string) {
    let createSandbox = memorize(createProxy, 2),
        proxyEnvir = createSandbox(window as any, null, appName);
    let lifeCycles = runScript(script, appName, proxyEnvir);
    console.log(lifeCycles)
}

