import { _app, _appState } from "../util/types"
import { runScript } from "../sandbox/sandbox";
import { loadHtml } from "../htmlLoader/htmlLoader";

export function lifecycle() {
    window.appList.forEach(app => {
        if (app.currentState === _appState.AfterMount) {
            _unmount(app.unmount as Function, app);
        }
    })
    window.appList.forEach(app => {
        if (app.matchRouter === window.history.state) {
            loadHtml(app.container, app.entry, app.name);
            _boostrap(app.bootstrap as Function, app);
            _mount(app.mount as Function, app);
        }
    })
}

export function _boostrap(fn: Function, app: _app) {
    app.currentState = _appState.BeforeBootstrap;
    try {
        let script = '(' + fn.toString() + ')()'
        runScript(script, app.name, app.sandBox);
        app.currentState = _appState.AfterBootstrap;
    } catch (err) {
        console.log(err);
        app.currentState = _appState.BeforeBootstrap;
    }
}

export function _mount(fn: Function, app: _app) {
    app.currentState = _appState.BeforeMount
    try {
        let script = '(' + fn.toString() + ')()'
        runScript(script, app.name, app.sandBox);
        fn();
        app.currentState = _appState.AfterMount
    } catch (err) {
        console.log(err);
        app.currentState = _appState.BeforeMount
    }
}

export function _unmount(fn: Function, app: _app) {
    app.currentState = _appState.BeforeUnmout;
    try {
        let script = '(' + fn.toString() + ')()'
        runScript(script, app.name, app.sandBox);
        fn();
        app.currentState = _appState.AfterMount
    } catch (err) {
        console.log(err);
        app.currentState = _appState.BeforeUnmout;
    }
}
