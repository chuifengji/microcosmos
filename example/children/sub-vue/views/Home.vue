<template>
  <div class="vue-home">
    <HelloWorld msg="this is home page by vue app" />
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

<style scoped>
.vue-home {
  text-align: center;
}
</style>