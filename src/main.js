import Vue from "vue";
import vuescroll from 'vuescroll/dist/vuescroll-native'; //滚动插件
import App from "./App.vue";
import router from "./router";
import store from "./store";
import WebIM from "./utils/WebIM";

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.use(vuescroll);
// Vue.use(WebIM)
Vue.prototype.$WebIM = WebIM;
Vue.prototype.$conn = WebIM.conn;
window.Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");