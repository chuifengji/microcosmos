//匹配路由式加载
export type _appConfigMatch = Array<{
    name: string,
    entry: string,
    container: string,
    matchRouter: string,//应当可设置为根路径“/”
}>

//直接加载，不匹配路由
export type _appConfigDefaultLoad = Array<{
    name: string,
    entry: string,
    container: string,
}>
export enum _appState {
    BeforeBootstrap = "beforeBootstrap",
    AfterBootstrap = "afterBootstrap",
    BeforeMount = "beforeMount",
    AfterMount = "aftermount",
    BeforeUnmout = "beforeUnmout",
    AfterUnmout = "afterUnmout",
}
export type _app = {
    name: string,
    entry: string,
    container: string,
    matchRouter?: string,
    bootstrap?: Function,
    mount?: Function,
    unmount?: Function,
    currentState?: _appState,
    sandBox?: any
}
export type _lifecycle = {
    bootstrap: Function,
    mount: Function,
    unmount: Function
}
//全局声明
declare global {
    interface Window {
        appList: Array<_app>,
        MICROCOSMOS_ROOT_STORE: any,
        _last_cosmos_url: string
    }
}