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
import Ops from '@/utils/scrollConfig';
console.log('>>>>',Ops);
import "./friends.scss";
export default {
  data() {
    return {
      friendList: [],
      isShow: true,
      ops: Ops //滚动配置
    };
  },
  async created() {
    let that = this;
    await this.$conn.getRoster({
      success: function (roster) {
        console.log(roster);
        for (let i = 0; i < roster.length; i++) {
          that.friendList.push(roster[i]);
        }
      },
    });
  },
};
</script>
