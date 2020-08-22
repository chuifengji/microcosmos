# microcosmos

一个写着玩的微前端框架~

呜唔，谢谢star欢迎pr

## how to use it



**引入**

```js
npm i microcosmos

import { start, register } from 'microcosmos';
```

**注册子应用**

```js

register([
    {
        name: 'sub-react',
        entry: "http://localhost:3001",
        container: "sub-react",
        matchRouter: "/sub-react"
    },
    {
        name: 'sub-vue',
        entry: "http://localhost:3002",
        container: "sub-vue",
        matchRouter: "/sub-vue"
    }
])
```

**开始**

```js
start()
```

**主应用路由方式**

```html
function App() {
  function goto(title, href) {
    window.history.pushState(href, title, href);
  }
  return (
    <div>
      <nav>
        <ol>
          <li onClick={(e) => goto('sub-vue', '/sub-vue')}><a>子应用一</a></li>
          <li onClick={(e) => goto('sub-react', '/sub-react')}><a >子应用二</a></li>
        </ol>
      </nav>
      <div id="sub-vue"></div>
      <div id="sub-react"></div>
    </div>
  )
}
```

**子应用必须导出钩子函数**

`bootstrap、mount、unmount`

```js
export async function bootstrap() {
    console.log('react bootstrap')
}

export async function mount() {
    console.log('react mount')
    ReactDOM.render(<App />, document.getElementById('app-react'))
}

export async function unmount() {
    console.log('react unmout')
    let root = document.getElementById('sub-react');
    root.innerHTML = ''
}
```

**全局状态通信/存储**

应用之间通信的场景其实较少，所以全局Store设计的也很简单。

在主应用中：

- initCosmosStore:初始化store
- subscribeStore:监听store变化
- changeStore：给store派发新值
- getStore：获取store当前快照

```js
let store = initCosmosStore({ name: 'chuifengji' })

store.subscribeStore((newValue, oldValue) => {
    console.log(newValue, oldValue);
})

store.changeStore({ name: 'wzx' })

store.getStore();

```

在子应用中：

```js
export async function mount(rootStore) {
    rootStore.subscribeStore((newValue, oldValue) => {
        console.log(newValue, oldValue);
    })
   rootStore.changeStore({ name: 'xjp' }).then(res => console.log(res))
    rootStore.getStore();
    instance = new Vue({
        // router,
        store,
        render: h => h(App)
    }).$mount('#app-vue')
}
```

具体使用可参考：[示例](https://github.com/chuifengji/microcosmos/tree/master/example)
