<template>
  <div class="command-line">
    <label>./shaural></label>
    <input type="text" ref="cli" id="cli" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "CommandLine",
  methods: {
    setFocus: function() {
      this.$refs.cli.focus();
    }
  },
  computed: mapState(["focus"]),
  watch: {
    focus() {
      this.setFocus();
      store.commit("unsetFocus");
    }
  },
  mounted: function() {
    this.setFocus();
  }
};
</script>

<style scoped>
.command-line {
  width: 100%;
  display: flex;
}
label {
  float: left;
  display: block;
}
#cli {
  background-color: inherit;
  border: none;
  outline: none;
  color: green;
  caret-color: green;
}
</style>
