
export function request(url: string, options?: RequestInit): Promise<string> {
    if (!window.fetch) {
        throw Error("It looks like that your browser doesn't support fetch. Polyfill is needed before you use it.")
    }
    return fetch(url, { mode: 'cors', ...options }).then((res) => res.text())
}
