<template>
  <div class="conversation-box">
    <div class="conversation_header">
      <h3 class="title">
        会话列表
      </h3>
      <div class="conversation_search">
        <input id="search_keyword" type="text" placeholder="点击进行搜索...." />
      </div>
    </div>
    <div class="conversation_content">
      <vue-scroll :ops="ops">
        <ul
          class="conversation_list"
          v-for="(item, index) in converStation"
          :key="index"
        >
          <li class="conversation_list_data" @click="startChat(item, index)">
            <div class="profile">
              <span
                class="profile_single"
                v-if="item.converBody.type === 'singleChat'"
              ></span>
              <span class="profile_group" v-else></span>
            </div>
            <div class="conversation_main">
              <div class="main_title">
                <span class="username">{{ item.key }}</span>
                <!-- 如果是会话列表拉取的lastMsg使用该方式转时间戳 -->
                <span class="time" v-if="item.converBody.isChannel">{{
                  changeTime(item.converBody.lastMsg.timestamp)
                }}</span>
                <span
                  class="unReadNum"
                  v-if="item.converBody.unReadNum > 0"
                  v-text="
                    item.converBody.unReadNum >= 99
                      ? '99'
                      : item.converBody.unReadNum
                  "
                ></span>
              </div>
              <!-- 下面的逻辑是不同的msgData显示不同的样式 -->
              <p
                class="msgData"
                v-if="item.converBody.lastMsg.msgBody.data.type === 'txt'"
              >
                {{
                  item.converBody.lastMsg.from +
                    ": " +
                    item.converBody.lastMsg.msgBody.data.msg
                }}
              </p>
              <p
                class="msgData"
                v-if="item.converBody.lastMsg.msgBody.data.type === 'file'"
              >
                {{ item.converBody.lastMsg.from + ": [ 文件消息 ]" }}
              </p>
              <p
                class="msgData"
                v-if="item.converBody.lastMsg.msgBody.data.type === 'audio'"
              >
                {{ item.converBody.lastMsg.from + ": [ 语音消息 ]" }}
              </p>
              <p
                class="msgData"
                v-if="item.converBody.lastMsg.msgBody.data.type === 'video'"
              >
                {{ item.converBody.lastMsg.from + ": [ 视频消息 ]" }}
              </p>
              <p
                class="msgData"
                v-if="item.converBody.lastMsg.msgBody.data.type === 'img'"
              >
                {{ item.converBody.lastMsg.from + ": [ 图片消息 ]" }}
              </p>
              <!-- <p>{{ item.converBody.lastMsg.msgBody.data.type | fileterMsgType}}</p> -->
            </div>
          </li>
        </ul>
      </vue-scroll>
    </div>
  </div>
</template>
<script>
import "./conversation.scss"
import changeTime from "@/utils/getTime"
import { mapState, mapActions } from "vuex"
import Ops from "@/utils/scrollConfig"
// import { mapActions } from 'vuex';
export default {
  data() {
    return {
      ops: Ops, //滚动配置,
      converStation: []
    }
  },
  created() {
    this.changeTime = changeTime
    this.getconversationList()
  },
  computed: {
    ...mapState({
      conversationList: state => state.chatStore.conversationList
    })
  },
  watch: {
    conversationList() {
      console.log(">>>>>>", 111)
    }
  },
  methods: {
    ...mapActions(["getConversationList"]),
    getconversationList() {
      console.log("<<<<<<<<", this.conversationList)
      this.converStation = this.conversationList
    },
    startChat(data, idx) {
      //点击会话列表的时候如果有未读那么发送channel_ack
      //判断条件为unReadNum大于0的时候发channel_ack
      if (data.converBody.unReadNum > 0) {
        var msg = new this.$WebIM.message("channel", this.$conn.getUniqueId())
        let { id, type } = data.converBody
        if (type === "singleChat") {
          msg.set({
            to: id
          })
        } else {
          msg.set({
            to: id,
            chatType: "groupChat"
          })
        }
        this.$conn.send(msg.body)
        //把发送过channel_ack的unReadNum红点统计消除。
        this.$set(data.converBody,'unReadNum',0)
      }
    }
  }
}
</script>
