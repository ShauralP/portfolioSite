import Vue from "vue";
import Vuex from "vuex";
import { Commands } from "../constants";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    focus: false,
    displayText: [],
    path: "./shaural"
  },
  mutations: {
    setFocus(state) {
      state.focus = true;
    },
    unsetFocus(state) {
      state.focus = false;
    },
    appendDisplayText(state, text) {
      if (text !== null && text !== "") {
        state.displayText.push(text);
      }
    },
    clearDisplayText(state) {
      state.displayText = [];
    },
    setPath(state, newPath) {
      state.path = newPath;
    }
  },
  actions: {
    commandHandler({ commit }, commandAndArgs) {
      if (commandAndArgs === null || commandAndArgs === "") {
        return;
      }
      let commandAndArgsSplit = commandAndArgs.split(" ");
      let command = commandAndArgsSplit[0];
      if (Commands.indexOf(command) === -1) {
        let resp = `Error: command ${command} does not exist`;
        commit("appendDisplayText", resp);
        return;
      }
      if (commandAndArgs === "clear" || commandAndArgs === "cls") {
        commit("clearDisplayText");
        return;
      }
    }
  },
  modules: {}
});
