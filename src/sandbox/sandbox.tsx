export const sanbox = (
    script: string,
    appName: string,
    proxyEnvir: any,//TODO:需要类型增强
) => {
    const execscript: string =
        `with(proxyEnvir.INTERNAL_STATE_KEY){${script} 
         return proxyEnvir['${appName}']}`
    const performer = new Function('proxyEnvir', execscript);
    try {
        performer.call(proxyEnvir, proxyEnvir)
    } catch (err) {
        console.error(`error occurred while executing the code in the sandbox`);
        throw err
    }
}