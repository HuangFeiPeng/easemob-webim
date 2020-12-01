<template>
  <div id="chat-msg">
    <ChatHeader></ChatHeader>
    <div class="chat_msg_body">
      <vue-scroll :ops="ops" ref="vs">
        <!-- 每一个聊天气泡 -->
        <div
          v-for="(item, index) in nowList"
          :key="index"
          :class="item.right ? 'chat_msg_box_right' : 'chat_msg_box_left'"
        >
          <div class="msg_from">{{ item.from }}</div>
          <div class="msg_content">
            <p>
              {{ item.msgData }}
            </p>
            <div class="msg_time">{{ changeTime(item.time) }}</div>
          </div>
        </div>
      </vue-scroll>
      <ChatSendBox :btnList="btn_List" @int="int"></ChatSendBox>
    </div>
  </div>
</template>
<script>
import "./chat_content.scss"
import Ops from "@/utils/scrollConfig"
import changeTime from "@/utils/getTime"
import ChatHeader from "@/components/chat_frame/chat_header/chat_header"
import ChatSendBox from "@/components/chat_frame/chat_sendBox/chat_sendBox"
import { mapState } from "vuex"
export default {
  data() {
    return {
      ops: Ops,
      nowList: [],
      userInfo: {},
      show: false,
      btn_List: [
        { class: "iconfont icon-biaoqing" },
        { class: "iconfont icon-tuku" },
        { class: "iconfont icon-wenjian" },
        { class: "iconfont icon-yuyin" },
        { class: "iconfont icon-lishi" }
      ]
    }
  },
  created() {
    this.changeTime = changeTime
    ;(this.msgList = this.$store.state.msgContent.msgList),
      (this.userInfo = this.$store.state.chatStore.userInfo)
  },
  computed: {
    userId() {
      return this.userInfo.userId
    }
  },
  watch: {
    //监听具体的userId，如果userID改变拉取对应的历史消息。
    userId(newVal, oldVal) {
      this.int()
    },
    //监听当nowList更新时就触发滚动条置底
    nowList(newVal, oldVal) {
      this.moveScrollBar()
    }
  },
  methods: {
    //处理消息将消息从msgList中拉取并更新
    int() {
      var arr = []
      if (this.$conn.user && this.userInfo.userId) {
        var key = `${this.$conn.user}-${this.userInfo.userId}`
        var type = this.userInfo.type
        arr = this.msgList[type][key] || []
        this.moveScrollBar()
      }
      return (this.nowList = arr)
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
    }
  },
  mounted() {},
  components: {
    ChatHeader,
    ChatSendBox
  }
}
</script>
