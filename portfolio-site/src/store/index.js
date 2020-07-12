import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    focus: false,
    displayText: []
  },
  mutations: {
    setFocus(state) {
      state.focus = true;
    },
    unsetFocus(state) {
      state.focus = false;
    },
    appendDisplayText(state, text) {
      state.displayText.push(text);
    }
  },
  actions: {},
  modules: {}
});
