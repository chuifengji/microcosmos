export function initCosmosStore(initData) {
    return window.MICROCOSMOS_ROOT_STORE = (function () {
        let store = initData;
        let observers: Array<Function> = [];
        function getStore() {
            return store;
        }
        function changeStore(newValue) {
            let oldValue = store;
            store = newValue;
            observers.forEach(fn => fn(newValue, oldValue));
        }
        function subscribeStore(fn) {
            observers.push(fn);
        }
        return { getStore, changeStore, subscribeStore }
    })()
}


