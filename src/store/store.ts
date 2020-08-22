export function initCosmosStore(initData) {
    return window.MICROCOSMOS_ROOT_STORE = (function () {
        let store = initData;
        let observers: Array<Function> = [];
        function getStore() {
            return store;
        }
        function changeStore(newValue) {
            return new Promise((resolve, reject) => {
                if (newValue !== store) {
                    let oldValue = store;
                    store = newValue;
                    resolve(store);
                    observers.forEach(fn => fn(newValue, oldValue));
                }
            })
        }
        function subscribeStore(fn) {
            observers.push(fn);
        }
        return { getStore, changeStore, subscribeStore }
    })()
}


