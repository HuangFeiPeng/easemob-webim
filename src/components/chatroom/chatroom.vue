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
            v-for="(item, index) in chatroom"
            :key="index"
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
import Ops from "@/utils/scrollConfig";
export default {
  data() {
    return {
      chatroom: [],
      ops: Ops,
    };
  },
  created() {
    let that = this;
    this.$conn.getChatRooms({
      apiUrl: this.$WebIM.config.restServer,
      pagenum: 1, // 页数
      pagesize: 20, // 每页个数
      success: function (list) {
        let data = list.data;
        for (let a = 0; a < data.length; a++) {
          that.chatroom.push(data[a]);
        }
      },
      error: function () {
        console.log("List chat room error");
      },
    });
  },
};
</script>
