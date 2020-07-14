<template>
  <div class="command-line">
    <label>{{ path }}></label>
    <input
      type="text"
      ref="cli"
      id="cli"
      @keyup.enter="submitCommand"
      v-model="cliInput"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "CommandLine",
  data() {
    return {
      cliInput: ""
    };
  },
  methods: {
    setFocus: function() {
      this.$refs.cli.focus();
      store.commit("unsetFocus");
    },
    submitCommand: function() {
      store.dispatch("commandHandler", this.cliInput);
      this.cliInput = "";
    }
  },
  computed: mapState(["focus", "path"]),
  watch: {
    focus() {
      this.setFocus();
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
  width: 100%;
  word-wrap: break-word;
}
</style>
