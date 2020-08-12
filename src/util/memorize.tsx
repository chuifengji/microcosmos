//memorize: 函数缓存
export function memorize(fn: Function) {
    const cache: any = {};
    return function ([...args]) {
        const _args = JSON.stringify(args)
        return cache[_args] || (cache[_args] = fn.apply(fn, args))
    }
}
