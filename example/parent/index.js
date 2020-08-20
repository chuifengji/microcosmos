import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { start, register, initCosmosStore } from '../../dist/microcosmos';

initCosmosStore({ name: 'chuifengji' })

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

