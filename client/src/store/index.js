import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    focus: false,
    displayText: [],
    path: "./shaural",
    commands: [],
    files: [],
    parentFiles: [], // TODO: handle this correctly
    modalOpen: false,
    modalImage: ""
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
        text = text.join("&nbsp;&nbsp;&nbsp;&nbsp;");
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
    changeDirectory(state, dir) {
      if (dir === undefined || dir === "" || dir === "current") {
        return;
      }
      if (dir === "parent") {
        let splitPath = state.path.split("/");
        if (splitPath.length > 2) {
          splitPath.pop();
        }
        state.path = splitPath.join("/");
        state.files = state.parentFiles;
        return;
      }
      state.path += "/" + dir.name;
      state.files = dir.data;
    },
    setCommdands(state, commands) {
      state.commands = commands;
    },
    setFiles(state, files) {
      state.files = files;
    },
    setParentFiles(state, files) {
      state.parentFiles = files;
    },
    open(state, file) {
      if (file.type === "link") {
        window.open(file.data.toString());
      }
      if (file.type === "image") {
        state.modalImage = `http://localhost:8081/${file.data}`;
        state.modalOpen = true;
      }
    },
    setModalImage(state, imageUrl) {
      state.modalImage = imageUrl;
      state.modalOpen = true;
    },
    closeModal(state) {
      state.modalOpen = false;
      state.modalImage = "";
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
    getFiles({ commit, state }) {
      axios
        .get(
          `http://localhost:8081/ls/${encodeURIComponent(state.path)}/simple`
        )
        .then(response => {
          commit("setFiles", response.data);
          commit("setParentFiles", response.data);
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
      // TODO: better handling for cd ..
      if (command === "cd") {
        if (args[0] === "..") {
          args[0] = "parent";
        } else if (args[0] === ".") {
          args[0] = "current";
        }
      }
      if (cmdObj.server) {
        let pathSuffix = cmdObj.route;
        if (cmdObj.pathRequired) {
          pathSuffix += "/" + encodeURIComponent(state.path);
        }
        if (cmdObj.args) {
          args.forEach(arg => {
            let path = `http://localhost:8081/${pathSuffix}/${arg}`;
            axios
              .get(path)
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
