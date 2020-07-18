<template>
  <div id="app">
    <Modal v-model="modalOpen" :image="modalImage" />
    <Terminal />
  </div>
</template>

<script>
import Terminal from "./components/Terminal.vue";
import store from "./store";
import { mapState } from "vuex";
import Modal from "./components/Modal.vue";

export default {
  name: "App",
  components: {
    Terminal,
    Modal
  },
  computed: mapState(["modalOpen", "modalImage"]),
  mounted: function() {
    store.dispatch("getCommands");
    store.dispatch("getFiles");
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: green;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: black;
  line-height: 150%;
}
</style>
