import { _app, _appState } from "../util/types"
import { findApp } from "../util/handlers";


export function lifecycle() {

}

export function boostrap(fn: Function, app: _app) {
    app.currentState = _appState.BeforeBootstrap;
    try {
        fn();
        app.currentState = _appState.AfterBootstrap;
    } catch (err) {
        console.log(err);
        app.currentState = _appState.BeforeBootstrap;
    }
}

export function mount(fn: Function, app: _app) {
    app.currentState = _appState.BeforeMount
    try {
        fn();
        app.currentState = _appState.AfterMount
    } catch (err) {
        console.log(err);
        app.currentState = _appState.BeforeMount
    }
}

export function unmount(fn: Function, app: _app) {
    app.currentState = _appState.BeforeUnmout;
    try {
        fn();
        app.currentState = _appState.AfterMount
    } catch (err) {
        console.log(err);
        app.currentState = _appState.BeforeUnmout;
    }
}