import { _lifecycle, _app } from "./types";

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

export function checkAppRegister(app: _app) {
    try {
        let props = ["name", "entry", "container", "matchRouter"]
        props.map(prop => {
            if (!app.hasOwnProperty(prop)) { throw Error('the app called ' + app.name + ' is missing the prop ' + prop) }
        })
        if (Object.keys(app).length > props.length) { throw Error('the app called ' + app.name + ' has redundant prop') }
    } catch (err) { console.error(err); return false; }
    return true;
}

export function checkAppDirect(app: _app) {
    try {
        let props = ["name", "entry", "container"]
        props.map(prop => {
            if (!app.hasOwnProperty(prop)) { throw 'the app called ' + app.name + ' is missing the prop ' + prop; }
        })
        if (Object.keys(app).length > props.length) { throw 'the app called ' + app.name + ' has redundant prop' }
    } catch (err) { console.error(err); return false; }
    return true;
}
