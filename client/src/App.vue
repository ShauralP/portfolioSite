<template>
  <div id="app">
    <Terminal />
  </div>
</template>

<script>
import Terminal from "./components/Terminal.vue";
import store from "./store";

export default {
  name: "App",
  components: {
    Terminal
  },
  mounted: function() {
    store.dispatch("getCommands");
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: green;
  padding-top: 25px;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: black;
}
</style>
