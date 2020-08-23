import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import "./index.css"

if (!window.RUNIN_MICROCOSMOS_SANDBOX) {
    ReactDOM.render(<App />, document.getElementById('app-react'))
}

export async function bootstrap() {
    console.log('react bootstrap')
}

export async function mount() {
    console.log('react mount')
    ReactDOM.render(<App />, document.getElementById('app-react'))
}

export async function unmount() {
    console.log('react unmout')
    // ReactDOM.unmountComponentAtNode(App)
    let root = document.getElementById('sub-react');
    root.innerHTML = ''
}
