import Vue from "vue";
import Vuex from "vuex";
import chatStore from './chatStore';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {},
  actions: {},
  modules: {
    chatStore
  }
});
