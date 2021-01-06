<template>
  <div class="chat-body">
    <Tabbar />
    <router-view></router-view>
    <ChatContent />
  </div>
</template>
<script>
import "./chat.scss"
//tab切换部分的组件
import Tabbar from "@/components/tabbar/tabbar"

//聊天框部分组件
import ChatContent from "@/components/chat_frame/chat_content/chat_content"
//本地存储方法
import Storage from "../../utils/storage"
export default {
  data() {
    return {
      userInfo: {},
      data: {}
    }
  },
 created() {
    //执行刷新聊天页面取token重新登陆。
    this.userInfo = Storage.getstorage("userInfo")
    this.$conn.open({
      apiUrl: this.$WebIM.config.apiURL,
      user: this.userInfo.username,
      accessToken: this.userInfo.token,
      appKey: this.$WebIM.config.appkey
    })
    setTimeout(()=>{this.$store.dispatch('getUserBlackList')},500)
  },

  components: {
    Tabbar,
    ChatContent
  }
}
</script>
