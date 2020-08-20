import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { start, register } from '../../dist/microcosmos';

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
start();

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// function compileCode(code) {
//     code = 'with (sandbox) {' + code + '}';
//     const fn = new Function('sandbox', code);
//     return (sandbox) => {
//       const proxy = new Proxy(sandbox, {
//         has(target, key) {
//           return true; // 欺骗，告知属性存在
//         }
//       });
//       return fn(proxy);
//     }
//   }