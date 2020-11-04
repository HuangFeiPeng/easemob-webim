<template>
  <transition name="showList">
    <div class="chat-list">
      <h3 class="chat-list_title">
        群组列表
      </h3>
      <div class="chat-list_parent">
        <vue-scroll :ops="ops">
          <div
            class="chat-list_content"
            v-for="(item, index) in groupList"
            :key="index"
            @click="goStart(index)"
          >
            <span class="iconfont icon-haoyou"> </span>
            <div class="chat-list_main">
              <p :title="`群组:${item.groupid}`">{{ item.groupname }}</p>
              <span class="group_id">{{ item.groupid }}</span>
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
      this.$store.dispatch("getGroupsList")
  },
  computed: {
    ...mapGetters({ groupList: "onGetGroupList" })
  },
  methods: {
    goStart(idx) {
      const chatID = this.groupList[idx].groupid
      const chatName = this.groupList[idx].groupname
      const type = 1
      this.$store.dispatch("getUserName", { chatID, chatName, type })
    }
  }
}
</script>
