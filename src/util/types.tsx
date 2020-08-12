//匹配路由式加载
export type appConfigMatch = Array<{
    name: string,
    entry: string,
    container: string,
    matchRouter: string,//应当可设置为根路径“/”
}>

//直接加载，不匹配路由
export type appConfigDefaultLoad = Array<{
    name: string,
    entry: string,
    container: string,
}>
//全局声明
declare global {
    interface Window {
        appList: Array<{
            name: string,
            entry: string,
            container: string,
            matchRouter?: string,
            bootstrap?: Function,
            mount?: Function,
            unmount?: Function,
            update?: Function
        }>
    }
}