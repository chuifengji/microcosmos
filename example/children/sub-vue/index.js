import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import store from './store'

Vue.config.productionTip = false
let instance = null;
export async function bootstrap() {
    console.log('vue app bootstraped');
}
if (!window.RUNIN_MICROCOSMOS_SANDBOX) {
    instance = new Vue({
        // router,
        store,
        render: h => h(App)
    }).$mount('#app-vue')
}

export async function mount(rootStore) {
    instance = new Vue({
        // router,
        store,
        render: h => h(App)
    }).$mount('#app-vue')
}
export async function unmount() {
    instance = null;
    const root = document.getElementById('sub-vue')
    root.innerHTML = ''
}