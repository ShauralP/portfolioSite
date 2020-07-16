<template>
  <div class="command-line">
    <label>{{ path }}></label>
    <input
      type="text"
      ref="cli"
      id="cli"
      @keyup.enter="submitCommand"
      @keydown.tab="autoComplete"
      @blur="setFocus"
      v-model="cliInput"
    />
    <input class="hidden" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "CommandLine",
  data() {
    return {
      cliInput: "",
      suggestion: []
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
    },
    autoComplete: function() {
      let lastWord = this.cliInput.split(" ").splice(-1)[0];
      let suggestedWord = this.suggestion.find(s =>
        s.toLowerCase().includes(lastWord.toLowerCase())
      );
      if (suggestedWord === undefined || suggestedWord === "") {
        return;
      }
      this.cliInput = this.cliInput.substring(
        0,
        this.cliInput.lastIndexOf(" ")
      );
      this.cliInput += " " + suggestedWord;
    }
  },
  computed: mapState(["focus", "path", "files"]),
  watch: {
    focus() {
      this.setFocus();
    },
    files(newFiles) {
      this.suggestion = newFiles;
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
.hidden {
  width: 0px;
  height: 0px;
  background: black;
  border: none;
  outline: none;
}
</style>
