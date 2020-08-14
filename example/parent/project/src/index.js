import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { start, register } from './origin';

register([
  {
    name: 'sub-app1',
    entry: "http://localhost:7100",
    container: "sub1",
    matchRouter: "/sub-app1"
  },
  {
    name: 'sub-app2',
    entry: "http://localhost:7101",
    container: "sub2",
    matchRouter: "/sub-app2"
  }
])
start();

// register(
//   'sub-app1',
//   'http://localhost:7100',
//   (location) => location.pathname === '/'
// )
// start()
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
