import Vue from "vue"
import vuescroll from "vuescroll/dist/vuescroll-native" //滚动插件
import App from "./App.vue"
import router from "./router"
import store from "./store"
import WebIM from "./utils/WebIM"
import { Message, Notification,MessageBox } from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import Storage from "./utils/storage"

let _setIniteStore = store.state //为了获取到store的初始值以便后期用作退出初始化store；
Storage.setstorage("initeStore", _setIniteStore) //将初始状态存进去、
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(vuescroll)
// Vue.use(WebIM)
Vue.prototype.$WebIM = WebIM
Vue.prototype.$conn = WebIM.conn
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm,
window.Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
