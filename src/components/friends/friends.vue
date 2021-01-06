<template>
  <transition name="showList">
    <div class="chat-list">
      <h3 class="chat-list_title">
        好友列表
      </h3>
      <div class="chat-list_parent">
        <vue-scroll :ops="ops">
          <div
            class="chat-list_content"
            v-for="(item, index) in friendList"
            :key="index"
            v-show="true"
            @click="goStart(index)"
          >
            <span class="iconfont icon-yonghu"></span>
            <p>{{ item.name }}</p>
          </div>
        </vue-scroll>
      </div>
    </div>
  </transition>
</template>
<script>
let that
import { mapGetters } from "vuex"
import Ops from "@/utils/scrollConfig"
export default {
  data() {
    return {
      ops: Ops, //滚动配置,
      msgType: 0
    }
  },
  beforeCreate() {
    that = this
  },
  async created() {
    await this.$store.dispatch("getFriendsList")
  },
  computed: {
    ...mapGetters({
      friendList: "onGetFriendsList",
      blackUser: "onGetBlackUserList"
    }),
    in() {
      return this.friendList.filter(item => {
        var historyMSG = this.blackUser
        if (historyMSG && !historyMSG.includes(item.name)) {
          return item
        }
      })
    }
  },
  methods: {
    goStart(idx) {
      const chatID = that.friendList[idx].name
      const type = 0
      that.$store.dispatch("getUserName", { chatID, type })
    }
  }
}
</script>
