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
            <p :title="item.subscription">{{ item.name }}</p>
          </div>
        </vue-scroll>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from "vuex"
import Ops from "@/utils/scrollConfig"
console.log(">>>>", Ops)
export default {
  data() {
    return {
      ops: Ops //滚动配置
    }
  },
  created() {
    this.$store.dispatch('getFriendsList');
  },
  computed: {
    ...mapGetters({friendList:'onGetFriendsList'})
  },
  methods: {
    goStart(idx) {
      const chatID = this.friendList[idx].name;
      this.$store.dispatch('getUserName',{chatID})
    }
  }
}
</script>
