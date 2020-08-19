<template>
  <div class="home">
    <HelloWorld msg="Welcome to Home by sub-app-vue" />
  </div>
</template>

<script>
import HelloWorld from "../components/HelloWorld.vue";
export default {
  name: "home",
  components: {
    HelloWorld,
  },
};
</script>
