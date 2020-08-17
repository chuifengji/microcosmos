import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
let instance = null;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#sub-vue')

export async function bootstrap() {
    console.log('vue app bootstraped');
}

export async function mount(props) {
    console.log('props from main framework', props);

    // instance = new Vue({
    //     router,
    //     store,
    //     render: h => h(App)
    // }).$mount('#sub-vue')
}

export async function unmount() {
    instance.$destroy();
    instance = null;
}