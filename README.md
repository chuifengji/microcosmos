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

```
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

具体使用可参考：[示例](https://github.com/chuifengji/microcosmos/tree/master/example)
