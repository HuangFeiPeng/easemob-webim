<template>
  <div class="drawer_box">
    <h3>好友设置</h3>
    <div class="singleChat_drawer" v-if="detail_type === 'singleChat'">
      <div class="deleteFriend_btn" @click="removeFriends">
        删除好友
      </div>
      <div class="addBlackFriend_btn">
        加入黑名单
      </div>
    </div>
    <GroupDetail v-else-if="detail_type === 'groupChat'"></GroupDetail>
  </div>
</template>

<script>
import "./drawer.scss"
import GroupDetail from "./group_detail/group_detail"
import { mapState, mapActions,mapMutations } from "vuex"
export default {
  data() {
    return {
      text: "抽屉"
    }
  },
  computed: mapState({
    detail_type: state => state.chatStore.userInfo.type,
    friendId: state => state.chatStore.userInfo.userId
  }),
  methods: {
    ...mapActions(["getFriendsList"]),
    removeFriends() {
      this.$conn.deleteContact(this.friendId);
      this.getFriendsList();
      this.$store.commit('initUserInfo')
    }
  },
  components: {
    GroupDetail //群组详情数据组件
  }
}
</script>
