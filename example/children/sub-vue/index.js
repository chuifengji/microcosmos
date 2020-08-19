import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
let instance = null;
export async function bootstrap() {
    console.log('vue app bootstraped');
}

export async function mount(props) {
    console.log('props from main framework', props);
    instance = new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app-vue')
}


export async function unmount() {
    // instance.$destroy();
    instance = null;
    const root = document.getElementById('sub-vue')
    root.innerHTML = ''
}