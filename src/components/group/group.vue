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
import Ops from "@/utils/scrollConfig";
export default {
  data() {
    return {
      groupList: [],
      ops: Ops,
    };
  },
  created() {
    let that = this;
    this.$conn.getGroup({
      success: function (res) {
        let data = res.data;
        for (let a = 0; a < data.length; a++) {
          that.groupList.push(data[a]);
        }
      },
    });
  },
};
</script>