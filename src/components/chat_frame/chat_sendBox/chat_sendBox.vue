<template>
  <div class="chat_sendBox">
    <!-- 功能栏 -->
    <ul class="fun_Btn">
      <li v-for="(item, index) in btnList" :key="index" @click="fun_index = index">
        <span :class="item.class"></span>
      </li>
      <Emoji v-if="fun_index === 0" @getemoji="getemoji" />
    </ul>
    <div class="send-content">
      <vue-scroll :ops="ops">
        <textarea
          class="send-textbox"
          ref="inputBoxVal"
          v-model="inputBox"
          :placeholder="placeHolder"
          @keydown="listenKeyCode($event)"
        ></textarea>
      </vue-scroll>
      <div class="send-Btn" @click="sendMessage" v-if="inputBox != ''">
        <span class="iconfont icon-fasong"></span>
      </div>
    </div>
  </div>
</template>
<script>
import "./chat_sendBox.scss"
import Ops from "@/utils/scrollConfig"
import { mapActions, mapState } from "vuex"
import Emoji from '@/components/chat_frame/emoji';
export default {
  props: ["btnList"],
  data() {
    return {
      ops: Ops,
      isShow: true,
      inputBox: "",
      placeHolder: "Enter发送,Shift换行,请输入...",
      fun_index: ""
    }
  },
  computed: mapState({
    msgType: state => state.chatStore.userInfo.type,
    toID: state => state.chatStore.userInfo.userId
  }),
  methods: {
    ...mapActions(["sendTextMsg", "sendCustomMsg"]),
    //
    listenKeyCode(event) {
      switch (event.keyCode) {
        case 13:
          this.sendMessage()
          event.preventDefault() //阻止浏览器默认换行
          break
        case 16:
          this.inputBox = this.inputBox + "\n" //换行
          break
        default:
          break
      }
    },
    //发送消息
    async sendMessage() {
      //发送文本消息
      this.inputBox = this.$refs["inputBoxVal"].value
      if (this.toID === "" || this.inputBox === "") {
        this.$refs["inputBoxVal"].value = ""
        return
      }
      await this.sendTextMsg({
        msg: this.inputBox,
        to: this.toID,
        type: this.msgType,
        contentsType: "Text"
      })
      setTimeout(() => {
        this.$emit("int")
      }, 300)
      this.$refs["inputBoxVal"].value = ""
      this.inputBox = ""
    },
    //接收表情
    getemoji(data){
      this.inputBox = this.inputBox+data
      console.log(">>>>>>",data);
    }
  },
  components:{
    Emoji
  }
}
</script>
