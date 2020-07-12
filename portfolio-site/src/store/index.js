import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    focus: true
  },
  mutations: {
    focus() {
      this.focus = true;
    },
    unfocus() {
      this.focus = false;
    }
  },
  actions: {},
  modules: {}
});
