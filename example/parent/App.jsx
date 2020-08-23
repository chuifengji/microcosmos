import React from 'react';

function App() {
  function goto(title, href) {
    window.history.pushState(href, title, href);
  }
  return (
    <div >
      <div className='parent_header' >
        <button className='parent_button' onClick={(e) => goto('sub-vue', '/sub-vue')}><a>子应用-vue</a></button>
        <button className='parent_button' onClick={(e) => goto('sub-react', '/sub-react')}><a >子应用-react</a></button>
      </div>
      <div id="sub-vue"></div>
      <div id="sub-react"></div>
    </div>
  )
}

export default App;