import Vue from "vue"
import Vuex from "vuex"
import chatStore from "./chatStore"
import msgContent from "./msgContent"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {},
  actions: {},
  modules: {
    chatStore,
    msgContent
  }
})
