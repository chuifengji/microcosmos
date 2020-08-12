
export const createProxy = () => {
    const target = Object.create(null) as Window;
    return new Proxy(target, {
        get(target, propKey: string) { },
        set(target, propKey: string, value: any): boolean {
            return true;
        }
    })
}
