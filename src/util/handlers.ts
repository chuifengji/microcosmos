import { _app } from "./types";

//compose: 函数组合
export function compose(f: Function, g: Function) {
    return function (x: any) {
        return f(g(x))
    }
}
//判断对象属于哪种内置类型
export function checkType(value: any) {
    return Object.prototype.toString.call(value);
};


export function isObject(value: any) {
    return checkType(value) === "[object Object]";
};

export function isArray(value: any) {
    return checkType(value) === '[object Array]'
}

export function isrefType(value: any): boolean {
    return (typeof value === 'object' && value !== null) ? true : false
}

export function getCleanCopy(obj: Object) {
    return Object.create(Object.getPrototypeOf(obj));
}
//patchEventListener 改变全局事件状态
export function patchEventListener(event: any, ListerName: string) {
    return function (this: any) {
        const e = new Event(ListerName);
        event.apply(this, arguments)
        window.dispatchEvent(e);
    };
}

export function findApp(name: string): _app {
    let n = 0;
    for (let i = 0; i < window.appList.length; i++) {
        if (window.appList[i].name === name) {
            n = i
        }
    }
    return window.appList[n]
}
//isChangeApp: 判断当前路由变化是否是在改变app
export function isChangeApp(): boolean {
    let flag = false;
    if (window._last_cosmos_url === window.location.href) return false;
    window._last_cosmos_url = window.location.href;
    window.appList.forEach(app => {
        if (app.matchRouter === window.history.state) {
            flag = true;
        }
    })
    return flag
}
//firstApp：根据初次进入的路由加载app.
export function firstApp() {
    const router = window.location.href;
    for (let i = 0; i < window.appList.length; i++) {
        if (window.appList[i].matchRouter && router.indexOf(window.appList[i].matchRouter as string) > 0) {
            return window.appList[i]
        }
    }
    return false;
}


