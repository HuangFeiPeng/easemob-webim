<template>
  <div id="chat-msg" >
    <ChatHeader></ChatHeader>
    <div class="chat_msg_body">
      <vue-scroll :ops="ops">
        <!-- 每一个聊天气泡 -->
        <div class="chat_msg_box">
          <span class="msg_from">黄豆黄</span>
          <div class="msg_content">
            <p>
              你好！
            </p>
          </div>
          <span class="msg_time">2020-12:08</span>
        </div>
      </vue-scroll>
      <ChatSendBox></ChatSendBox>
    </div>
    
  </div>
</template>
<script>
import "./chat_content.scss"
import Ops from "@/utils/scrollConfig"
import ChatHeader from "@/components/chat_frame/chat_header/chat_header"
import ChatSendBox from '@/components/chat_frame/chat_sendBox/chat_sendBox';
export default {
  data() {
    return {
      ops: Ops,
      show: false,
    }
  },
  components: {
    ChatHeader,
    ChatSendBox
  }
}
</script>
