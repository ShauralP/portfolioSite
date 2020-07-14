<template>
  <div class="terminal" @click="focus()">
    <Display />
    <CommandLine />
  </div>
</template>

<script>
import CommandLine from "./CommandLine";
import Display from "./Display";
import store from "../store";

export default {
  name: "Terminal",
  components: {
    CommandLine,
    Display
  },
  methods: {
    focus: function() {
      store.commit("setFocus");
    }
  }
};
</script>

<style scoped>
.terminal {
  margin: auto;
  width: 75%;
  height: 75%;
  border: 3px solid green;
  padding: 10px;
}
</style>
