import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.render(<App />, document.getElementById('sub-react'))

export async function setup() {
    console.log('react setup')
}

export async function mount({ host }) {
    console.log('react mount')
    // ReactDOM.render(<App />, document.getElementById('sub-react'))
}

export async function unmount({ host }) {
    console.log('react unmout')
    ReactDOM.unmountComponentAtNode(App)
}
