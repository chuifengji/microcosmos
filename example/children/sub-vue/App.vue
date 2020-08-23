<template>
  <div id="app-vue">
    <div id="nav">
      <h1>我是子应用一，sub-vue</h1>
      <router-link to="/sub-vue">vue app:Home</router-link>
      <router-link to="/sub-vue/about">vue app:About</router-link>
    </div>
    <router-view />
  </div>
</template>
<style>
#container {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
}
</style>
