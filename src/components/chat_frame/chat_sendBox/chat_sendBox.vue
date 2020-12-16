<template>
  <div class="chat_sendBox">
    <!-- 功能栏 -->
    <ul class="fun_Btn">
      <li
        v-for="(item, index) in btnList"
        :key="index"
        @click.stop="funClick(index)"
      >
        <span :class="item.class" :title="item.title"></span>
      </li>
      <Emoji v-if="this.emojiHide" @getemoji="getemoji" />
        <input type="file" id="upImage" class="upFile" @change="sendImgMessage" ref="upImg"> <!-- onChange事件监听图片url上传调用发送图片消息方法 -->
        <input type="file" id="upFiles" class="upFile" @change="sendFileMessage" ref="upFile">
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
      <div class="send-Btn" @click="sendTextMessage" v-if="inputBox != ''">
        <span class="iconfont icon-fasong"></span>
      </div>
    </div>
  </div>
</template>
<script>
import "./chat_sendBox.scss"
import Ops from "@/utils/scrollConfig"
import { mapActions, mapState } from "vuex"
import Emoji from "@/components/chat_frame/emoji"
export default {
  props: ["btnList", "emojiHide"],
  data() {
    return {
      ops: Ops,
      isShow: false,
      inputBox: "",
      placeHolder: "Enter发送,Shift换行,请输入..."
    }
  },
  computed: mapState({
    msgType: state => state.chatStore.userInfo.type,
    toID: state => state.chatStore.userInfo.userId
  }),
  methods: {
    ...mapActions(["getNowMsg","sendTextMsg", "sendCustomMsg","sendImageMsg","sendFilesMsg"]),
    //监听keyCode
    listenKeyCode(event) {
      switch (event.keyCode) {
        case 13:
          this.sendTextMessage()
          event.preventDefault() //阻止浏览器默认换行
          break
        case 16:
          this.inputBox = this.inputBox + "\n" //换行
          break
        default:
          break
      }
    },
    //发送文本消息
    async sendTextMessage() {
      this.inputBox = this.$refs["inputBoxVal"].value
      if (this.toID === "" || this.inputBox === "") {
        this.$refs["inputBoxVal"].value = ""
        return false
      }
      await this.sendTextMsg({
        msg: this.inputBox,
        to: this.toID,
        type: this.msgType,
        contentsType: "TEXT"
      })
      // setTimeout(() => {
      //   this.$emit("intMsg")
      // }, 300)
      // this.getNowMsg({myID:this.$conn.user,overID:this.toID,type:this.msgType})
      this.$refs["inputBoxVal"].value = ""
      this.inputBox = ""
    },
    //发送图片消息
    async sendImgMessage(e,template) {
      console.log('sendImgMessage', e)
      if (!this.toID)  return false
      var el = this.$refs['upImg']
      await this.sendImageMsg({
        imgId:"upImage",
        to: this.toID,
        type: this.msgType,
        contentsType: "IMAGE",
        Dom:el,
      })
      //提交完之后初始化value,以便再次上传同一张图片时候依然能监听到change变化。
      this.$refs['upImg'].value = null;
       
    },
    //发送文件消息
    async sendFileMessage(e){
      console.log('sendFileMessage', e)
      var el = this.$refs['upFile']
      // console.log(a);
      if (!this.toID) return false
       await this.sendFilesMsg({
        fileId:"upFiles",
        to: this.toID,
        type: this.msgType,
        contentsType: "FILE",
        Dom:el,
        fileInfo:e.target.files[0]
      })
      //提交完之后初始化value,以便再次上传同一张图片时候依然能监听到change变化。
      // this.$refs['upFile'].value = null;
    },
    //接收表情
    getemoji(data) {
      this.inputBox = this.inputBox + data
      console.log(">>>>>>", data)
    },
    //点击处理功能栏
    funClick(idx) {
      // console.log(idx)
      if (idx === 0) {
        //更新父组件的数据，让父组件为true
        return this.emojiHide ? this.$emit('update:emojiHide', false) : this.$emit('update:emojiHide', true);
        // if(this.emojiHide){
        //   this.$emit('update:emojiHide', false)
        // }else{
        //   this.$emit('update:emojiHide', true)
        // }
        
      } else if (idx === 1) {
        //上传图片
        this.$refs['upImg'].click()
      } else if (idx ===2 ) {
        //上传文件
        this.$refs['upFile'].click()
      } else if( idx === 3){
        console.log('发送语音消息~');
      } else{
        console.log('>>>>拉取历史消息');
      }
    }
  },
  components: {
    Emoji
  }
}
</script>
