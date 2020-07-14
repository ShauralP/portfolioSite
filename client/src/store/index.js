import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    focus: false,
    displayText: [],
    path: "./shaural",
    commands: []
  },
  mutations: {
    setFocus(state) {
      state.focus = true;
    },
    unsetFocus(state) {
      state.focus = false;
    },
    appendDisplayText(state, text) {
      if (text === null || text === "") {
        return;
      }
      if (text instanceof Array) {
        text = text.join(" ");
      }
      state.displayText.push(text);
    },
    appendDisplayTextCommand(state, text) {
      if (text === null || text === "") {
        return;
      }
      if (text instanceof Array) {
        text = text.join(" ");
      }
      state.displayText.push(state.path + "> " + text);
    },
    appendDisplayTextError(state, text) {
      if (text === null || text === "") {
        return;
      }
      if (text instanceof Array) {
        text = text.join(" ");
      }
      state.displayText.push("Error: " + text);
    },
    clearDisplayText(state) {
      state.displayText = [];
    },
    setPath(state, newPath) {
      state.path = newPath;
    },
    changeDirectory(state, newDir) {
      if (newDir === "..") {
        let splitPath = state.path.split("/");
        if (splitPath.length > 2) {
          splitPath.pop();
        }
        state.path = splitPath.join("/");
        return;
      }
      if (newDir === undefined || newDir === "") {
        return;
      }
      state.path += "/" + newDir;
    },
    setCommdands(state, commands) {
      state.commands = commands;
    }
  },
  actions: {
    getCommands({ commit }) {
      axios
        .get("http://localhost:8081/commands")
        .then(response => {
          commit("setCommdands", response.data);
        })
        .catch(e => {
          commit("appendDisplayTextError", e);
        });
    },
    commandHandler({ commit, state }, commandAndArgs) {
      if (commandAndArgs === null || commandAndArgs === "") {
        return;
      }
      commit("appendDisplayTextCommand", commandAndArgs);
      let commandAndArgsSplit = commandAndArgs.split(" ");
      let command = commandAndArgsSplit[0];
      commandAndArgsSplit.splice(0, 1);
      let args = commandAndArgsSplit;
      let cmdObj = state.commands.find(c => c.command === command);
      if (!cmdObj) {
        let resp = `Command ${command} does not exist`;
        commit("appendDisplayTextError", resp);
        return;
      }
      // TODO: better handlind for cd ..
      if (command === "cd") {
        if (args[0] === "..") {
          commit("changeDirectory", args[0]);
          return;
        } else if (args[0] === ".") {
          return;
        }
      }
      if (cmdObj.server) {
        let pathSuffix = cmdObj.route;
        if (cmdObj.pathRequired) {
          pathSuffix += "/" + encodeURIComponent(state.path);
        }
        if (cmdObj.args) {
          args.forEach(arg => {
            axios
              .get(`http://localhost:8081/${pathSuffix}/${arg}`)
              .then(response => {
                commit(cmdObj.callback, response.data);
              })
              .catch(e => {
                commit("appendDisplayTextError", e.response.statusText);
              });
          });
        } else {
          axios
            .get(`http://localhost:8081/${pathSuffix}`)
            .then(response => {
              commit(cmdObj.callback, response.data);
            })
            .catch(e => {
              commit("appendDisplayTextError", e.response.toString());
            });
        }
      } else {
        if (cmdObj.args) {
          commit(cmdObj.callback, args);
        } else {
          commit(cmdObj.callback);
        }
      }
    }
  },
  modules: {}
});
