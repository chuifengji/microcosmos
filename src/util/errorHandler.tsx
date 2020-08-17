import { _lifecycle } from "./types";

export function checkLifecycle(lifecycles: _lifecycle, appName: string) {
    if (!lifecycles.bootstrap) {
        throw 'the bootstrap function is not exported correctly in app named ' + appName
    }
    if (!lifecycles.mount) {
        throw 'the mount function is not exported correctly in app named ' + appName
    }
    if (!lifecycles.unmount) {
        throw 'the unmount function is not exported correctly in app named ' + appName
    }
}