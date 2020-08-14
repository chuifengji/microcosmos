import { loadHtml } from "../htmlLoader/htmlLoader"

export function routerChange() {
    window.appList.forEach(item => {
        if (item.matchRouter === window.history.state) {
            console.log('loadHtml ' + window.history.state)
            loadHtml(item.container, item.entry, item.name)
        }
    })
}
//TODO:我重写了全局的window.history方法，并进行监听，会不会对用户开放造成影响？这种路由管理方式如何嵌入子应用路由？如何缓存子应用的路由状态？
