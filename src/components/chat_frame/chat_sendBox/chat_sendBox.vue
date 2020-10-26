<template>
  <div class="chat_sendBox">
    <!-- 功能栏 -->
    <ul class="fun_Btn">
      <li>
        <span class="iconfont icon-biaoqing"></span>
      </li>
      <li>
        <span class="iconfont icon-tuku"></span>
      </li>
      <li>
        <span class="iconfont icon-wenjian"></span>
      </li>
      <li>
        <span class="iconfont icon-yuyin"></span>
      </li>
      <li>
        <span class="iconfont icon-lishi"></span>
      </li>
    </ul>
    <div class="send-content">
      <vue-scroll :ops="ops">
        <div
          contenteditable="true"
          spellcheck="true"
          id="send_msg"
          class="send-textbox"
        ></div>
      </vue-scroll>
      <div class="send-Btn" @click="sendMessage">
        <span class="iconfont icon-fasong"></span>发送
      </div>
    </div>

    <!-- 消息发送文本域 -->
  </div>
</template>
<script>
import "./chat_sendBox.scss"
import Ops from "@/utils/scrollConfig"
import { mapActions, mapState } from "vuex"
export default {
  data() {
    return {
      ops: Ops
    }
  },
  computed: mapState({
    msgType: state => state.chatStore.userInfo.type,
    toID: state => state.chatStore.userInfo.userId
  }),
  methods: {
    ...mapActions(["sendTextMsg"]),
    //发送消息
    async sendMessage() {
      let msgVal = document.getElementById("send_msg").innerHTML
      if (this.toID === "" || msgVal === "") {
        document.getElementById("send_msg").innerHTML = ""
        return
      }
      console.log(msgVal)
      console.log(this.msgType, this.toID)
      await this.sendTextMsg({
        msg: msgVal,
        to: this.toID,
        type: this.msgType
      })
      document.getElementById("send_msg").innerHTML = ""
    }
  }
}
</script>
