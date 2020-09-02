<h1 align="center">Welcome to microcosmos 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/microcosmos" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/microcosmos.svg">
  </a>
  <a href="https://juejin.im/post/6864381092061773831" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/chuifengji/microcosmos/blob/master/license.txt" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> 一个写着玩的微前端框架

### 🏠 [GitHub Homepage](https://github.com/chuifengji/microcosmos)

---

## 👊 功能

- Html-loader
- Dynamaic-css
- Js-sandbox
- Lifecycle
- Parent-Child Communication
- Prefetch

## 📥 安装

```sh
git clone https://github.com/chuifengji/microcosmos.git
```

## 🛠 使用

**引入**

```js
npm i microcosmos

import { start, register,initCosmosStore } from 'microcosmos';
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

```js
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

- initCosmosStore:初始化 store
- subscribeStore:监听 store 变化
- changeStore：给 store 派发新值
- getStore：获取 store 当前快照

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

### 📌 [Demo 事例](https://github.com/chuifengji/microcosmos/tree/master/example)

---

## 👥 作者

👤 **Ethan.Lv**

* Website: https://www.ethanlv.cn
* Github: [@chuifengji](https://github.com/chuifengji)

## 🤝 贡献

任何贡献、issues、pr 以及功能提议都是受欢迎的！<br />快去 [issues 页面](https://github.com/chuifengji/microcosmos/issues) 看看！

## 🎉 支持

如果帮到各位爷了就给个 ⭐️ 罢！——正如作者所说：

> 呜唔，谢谢 star 欢迎 pr

## 📝 协议

版权所有 © 2020 [Ethan.Lv](https://github.com/chuifengji).<br />这个项目是 [MIT](https://github.com/chuifengji/microcosmos/blob/master/license.txt) 协议。
