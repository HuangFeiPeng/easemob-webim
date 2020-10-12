<template>
  <transition name="showList">
    <div class="chat-list">
      <h3 class="chat-list_title">
        聊天室列表
      </h3>
      <div class="chat-list_parent">
        <vue-scroll :ops="ops">
          <div
            class="chat-list_content"
            v-for="(item, index) in chatRoom"
            :key="index"
            @click="goStart(index)"
          >
            <span class="iconfont icon-qunzuduoren"></span>
            <div class="chat-list_main">
              <p class="chatroom_name">{{ item.name }}</p>
              <span class="chatroom_owner">聊天室管理员:{{ item.owner }}</span>
            </div>
          </div>
        </vue-scroll>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from "vuex"
import Ops from "@/utils/scrollConfig"
export default {
  data() {
    return {
      ops: Ops
    }
  },
  created() {
    this.$store.dispatch("getChatroomsList")
  },
  computed: {
    ...mapGetters({ chatRoom: "onGetChatRoomsList" })
  },
  methods: {
    goStart(idx) {
      const chatID = this.chatRoom[idx].id
      const chatName = this.chatRoom[idx].name
      // console.log(this.chatRoom[idx]);
      this.$store.dispatch("getUserName", { chatID, chatName })

    }
  }
}
</script>
