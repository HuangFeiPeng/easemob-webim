<template>
  <div id="chat-msg">
    <ChatHeader :drawerHide.sync="drawerShow"></ChatHeader>
    <div class="chat_msg_body" @click.stop="allHideBox">
      <vue-scroll :ops="ops" ref="vs">
        <!-- 每一个聊天气泡 -->
        <div
          v-for="(item, index) in nowMsgList"
          :key="index"
          :class="item.right ? 'chat_msg_box_right' : 'chat_msg_box_left'"
        >
          <div class="msg_from">{{ item.from }}</div>
          <div class="msg_content">
            <!-- 文本消息显示 -->
            <p v-if="item.contentsType === 'TEXT'">
              {{ item.msgData }}
            </p>
            <!-- 图片消息显示 -->
            <div class="img_Box" v-else-if="item.contentsType === 'IMAGE'">
              <img :src="item.msgData.imgUrl" alt="图片加载失败..." />
            </div>
            <!-- 文件消息显示 -->
            <div
              class="file_Box"
              v-else-if="item.contentsType === 'FILE'"
              @dblclick="downLoadFile(item, this)"
              :title="'双击下载'"
            >
              <div class="file_Box_hd">
                <div class="file_icon">
                  <span class="iconfont icon-wenjian"></span>
                </div>
                <div class="file_name">
                  {{ "文件:" + item.msgData.fileName }}
                </div>
                <a
                  :href="item.msgData.fileUrl"
                  :download="item.msgData.fileName"
                  ref="dowload"
                ></a>
              </div>

              <div class="file_size">
                {{ changeSize(item.msgData.fileLength) }}
              </div>
            </div>
            <!-- 音频消息显示 -->
            <div
              class="audio_Box"
              @click="playAudio(item.msgData.blob)"
              v-else-if="item.contentsType === 'VOICE'"
              :style="{ width: item.msgData.length * 10 + 30 + 'px' }"
            >
              <span class="icon_img">
                <img src="../../../assets/image/语音.png" alt="" />
              </span>
              <audio :src="item.msgData.blob" ref="voiceAudio"></audio>
              <!-- <input type="range"> -->
            </div>
            <span class="msg_length" v-if="item.contentsType === 'VOICE'">{{
              item.msgData.length
            }}</span>
          </div>
          <div class="msg_time">{{ changeTime(item.time) }}</div>
        </div>
      </vue-scroll>
    </div>
    <Drawer v-if="drawerShow" :drawerHide.sync="drawerShow" />
    <ChatSendBox
      v-show="userInfo.userId"
      :btnList="btn_List"
      @intMsg="intMsg"
      :emojiHide.sync="emojiShow"
      :audioHide.sync="audioShow"
    ></ChatSendBox>
    <!-- sync修饰符为语法糖：当一个子组件改变了一个 prop 的值时，这个变化也会同步到父组件中所绑定。 -->
  </div>
</template>
<script>
import "./chat_content.scss"
import Ops from "@/utils/scrollConfig"
import BenzAMRRecorder from "benz-amr-recorder/BenzAMRRecorder"
import changeTime from "@/utils/getTime"
import changeSize from "@/utils/function"
import ChatHeader from "@/components/chat_frame/chat_header/chat_header"
import Drawer from "@/components/chat_frame/drawer/drawer"
import ChatSendBox from "@/components/chat_frame/chat_sendBox/chat_sendBox"
import { mapState, mapGetters, mapActions } from "vuex"
export default {
  data() {
    return {
      ops: Ops,
      nowList: [],
      userInfo: {},
      drawerShow: false,
      emojiShow: false,
      audioShow: false,
      btn_List: [
        { class: "iconfont icon-biaoqing", title: "发送表情" },
        { class: "iconfont icon-tuku", title: "发送图片" },
        { class: "iconfont icon-wenjian", title: "发送文件" },
        { class: "iconfont icon-yuyin", title: "发送语音" },
        // { class: "iconfont icon-lishi", title: "拉取历史" } //拉取历史消息功能暂时先不写了，没别的累了先不写了😢
      ]
    }
  },
  created() {
    this.changeTime = changeTime
    this.changeSize = changeSize.readablizeBytes
    ;(this.msgList = this.$store.state.msgContent.msgList),
      (this.userInfo = this.$store.state.chatStore.userInfo)
  },
  computed: {
    ...mapGetters({
      nowMsgList: "onGetMsgList"
    }),
    userId() {
      return this.userInfo.userId
    }
  },
  watch: {
    //监听具体的userId，如果userID改变拉取对应的历史消息。
    userId(newVal, oldVal) {
      this.intMsg()
    },
    //监听当nowList更新时就触发滚动条置底
    nowMsgList(newVal, oldVal) {
      // console.log('>>>>>消息更新',newVal, oldVal);
      this.moveScrollBar()
    }
  },
  methods: {
    ...mapActions(["getNowMsg"]),
    //处理消息将消息从msgList中拉取并更新
    intMsg() {
      this.getNowMsg({
        myID: this.$conn.user,
        overID: this.userInfo.userId,
        type: this.userInfo.type
      })
    },
    //调整消息内容部分的滚动条位置。
    moveScrollBar() {
      this.$refs["vs"].scrollTo(
        {
          y: 5000000
        },
        1000,
        "easeInQuad"
      )
    },
    //双击下载附件
    downLoadFile(data, a) {
      this.$refs["dowload"][0].click()
      console.log("点击下载成功", data)
  
    },
    //点击body隐藏表情框以及录音框
    allHideBox: function() {
      this.emojiShow = false
      this.audioShow = false
      this.drawerShow = false
    },
    playAudio: function(src) {
      let armRec = new BenzAMRRecorder()
      armRec.initWithUrl(src).then(function() {
        armRec.play()
      })
      // console.log(">>>>>>>", armRec)
    }
  },
  components: {
    ChatHeader,
    ChatSendBox,
    Drawer
  }
}
</script>
