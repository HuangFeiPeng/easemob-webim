<template>
  <div class="conversation-box">
    <div class="conversation_header">
      <h3 class="title">
        会话列表
      </h3>
      <div class="add_Icon" @click.stop="isAddBox = !isAddBox">
        <img src="@/assets/image/加.png" alt="">
      </div>
      <AddBox class="add_Box" v-if="isAddBox"></AddBox>
      <div class="conversation_search">
        <input id="search_keyword" type="text" placeholder="点击进行搜索...." />
      </div>
      
      
    </div>
    <div class="conversation_content">
      <vue-scroll :ops="ops" ref="cv">
        <ul
          class="conversation_list"
          v-for="(item, index) in converStation"
          :key="index"
        >
          <li class="conversation_list_data" @click="startChat(item, index)">
            <div class="profile">
              <span
                class="profile_single"
                v-if="item.converBody.chatType.type === 'singleChat'"
              >
              </span>
              <span class="profile_group" v-else></span>
            </div>
            <div class="conversation_main">
              <div class="main_title">
                <span
                  class="username"
                  v-if="item.converBody.chatType.type === 'singleChat'"
                  >{{ item.key }}</span
                >
                <span class="groupname" v-else>{{
                  item.converBody.chatType.groupName
                }}</span>
                <!-- 如果是会话列表拉取的lastMsg使用该方式转时间戳 -->
                <!-- <span class="time" v-if="item.converBody.isChannel">{{ -->
                <span class="time">{{
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
import changeTime from "@/utils/getTime" //引入转换时间戳的方法
import { mapState, mapActions } from "vuex"
import Ops from "@/utils/scrollConfig"
import AddBox from './add _Fun/add_box';
// import { mapActions } from 'vuex';
export default {
  data() {
    return {
      ops: Ops, //滚动配置,
      converStation: [],
      isAddBox:false
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
      // console.log(">>>>>>", 111)
      this.moveScrollBar()
    }
  },
  methods: {
    ...mapActions([
      "getConversationList",
      "getUserName",
    ]),
    getconversationList() {
      //TO DO 在渲染之前去进行一次过滤
      this.converStation = this.conversationList
    },

    startChat(data, idx) {
      const { chatType, id } = data.converBody
      let Type = {
        singleChat: 0,
        groupChat: 1
      }
      //将当前点击的会话li，set入userInfo
      this.getUserName({
        chatID: id,
        chatName: chatType.groupName,
        type: Type[chatType.type]
      })
      //点击会话列表的时候如果有未读那么发送channel_ack
      //判断条件为unReadNum大于0的时候发channel_ack
      if (data.converBody.unReadNum > 0) {
        var msg = new this.$WebIM.message("channel", this.$conn.getUniqueId())
        if (chatType.type === "singleChat") {
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
        this.$set(data.converBody, "unReadNum", 0)
      }
    },
    //调整会话列表滚动条位置。
    moveScrollBar() {
      this.$refs["cv"].scrollTo(
        {
          y: -1000000000
        },
        1000,
        "easeInQuad"
      )
    }
  },
  components: {
    AddBox
  }
}
</script>
