import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  function goto(title, href) {
    console.log("title", title, "href", href)
    window.history.pushState(href, title, href);
  }
  return (
    <div className="App">
      <nav>
        <ol>
          <li onClick={(e) => goto('sub-app1', '/sub-app1')}><a>子应用一</a></li>
          <li onClick={(e) => goto('sub-app2', '/sub-app2')}><a >子应用二</a></li>
        </ol>
      </nav>
      <div id="sub1"></div>
      <div id="sub2"></div>
    </div>
  )
}

export default App;
