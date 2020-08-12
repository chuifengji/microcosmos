//compose: 函数组合
export function compose(f: Function, g: Function) {
    return function (x: any) {
        return f(g(x))
    }
}