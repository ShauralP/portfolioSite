<template>
  <div class="terminal">
    <Display />
    <CommandLine />
  </div>
</template>

<script>
import CommandLine from "./CommandLine";
import Display from "./Display";

export default {
  name: "Terminal",
  components: {
    CommandLine,
    Display
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
