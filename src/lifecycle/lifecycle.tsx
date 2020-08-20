import { _app, _appState } from "../util/types"
import { loadHtml } from "../htmlLoader/htmlLoader";

export function lifecycle() {
    window.appList.forEach(app => {
        if (app.currentState === _appState.AfterMount) {
            _unmount(app);
        }
    })
    window.appList.forEach(app => {
        if (app.matchRouter === window.history.state) {
            _boostrap(app).then(res => {
                _mount(res);
            })
        }
    })
}
export function _boostrap(app: _app): Promise<_app> {
    return new Promise((resolve, reject) => {
        app.currentState = _appState.BeforeBootstrap;
        try {
            loadHtml(app.container, app.entry, app.name).then(resApp => {
                resApp.sandBox[resApp.name].bootstrap(window.MICROCOSMOS_ROOT_STORE)
                resApp.currentState = _appState.AfterBootstrap;
                return resApp
            }).then((resApp) => {
                resolve(resApp);
            })
        } catch (err) {
            console.log(err);
            app.currentState = _appState.BeforeBootstrap;
        }

    })
}

export function _mount(app: _app) {
    app.currentState = _appState.BeforeMount
    try {
        app.sandBox[app.name].mount(window.MICROCOSMOS_ROOT_STORE)
        app.currentState = _appState.AfterMount
    } catch (err) {
        console.log(err);
        app.currentState = _appState.BeforeMount
    }
}

export function _unmount(app: _app) {
    app.currentState = _appState.BeforeUnmout;
    try {
        app.sandBox[app.name].unmount(window.MICROCOSMOS_ROOT_STORE)
        app.currentState = _appState.AfterMount
    } catch (err) {
        console.log(err);
        app.currentState = _appState.BeforeUnmout;
    }
}
