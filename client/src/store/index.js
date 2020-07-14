import Vue from "vue";
import Vuex from "vuex";
import { Commands } from "../constants"; // TODO: get this list from backend
import axios from "axios";

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
    commandHandler({ commit, state }, commandAndArgs) {
      if (commandAndArgs === null || commandAndArgs === "") {
        return;
      }
      let commandAndArgsSplit = commandAndArgs.split(" ");
      let command = commandAndArgsSplit[0];
      commandAndArgsSplit.splice(0, 1);
      let args = commandAndArgsSplit;
      if (Commands.indexOf(command) === -1) {
        let resp = `Error: command ${command} does not exist`;
        commit("appendDisplayText", resp);
        return;
      }
      if (commandAndArgs === "clear" || commandAndArgs === "cls") {
        commit("clearDisplayText");
        return;
      }
      let body = {
        command: command,
        path: state.path,
        args: args
      };
      axios
        .post("http://localhost:8081/command", { body })
        .then(response => {
          commit("appendDisplayText", response.data);
        })
        .catch(e => {
          commit("appendDisplayText", e);
        });
    }
  },
  modules: {}
});
