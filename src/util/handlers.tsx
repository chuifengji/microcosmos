import { _app } from "./types";

//memorize: 函数缓存
export function memorize(fn: Function, index: number): any {
    const cache: any = {};
    return function (...args) {
        const _args = JSON.stringify(args[index])
        return cache[_args] || (cache[_args] = fn.apply(fn, args))
    }
}

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
