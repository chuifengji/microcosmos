import React from 'react';

function App() {
  function goto(title, href) {
    console.log("title", title, "href", href)
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

export default App;