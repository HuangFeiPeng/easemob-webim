<template>
  <div class="drawer_box">
    <!-- 好友详情板块 -->
    <h3 ref="title" v-if="detail_type === 'singleChat'">好友设置</h3>
    <div class="singleChat_drawer" v-if="detail_type === 'singleChat'">
      <div
        class="deleteFriend_btn"
        @click="
          isShow = true
          modalType = 0
        "
      >
        删除好友
      </div>
      <div
        class="addBlackFriend_btn"
        @click="
          isShow = true
          modalType = 1
        "
      >
        加入黑名单
      </div>
    </div>
    <!-- 群组详情板块 -->
    <GroupDetail v-else-if="detail_type === 'groupChat'"></GroupDetail>
    <!-- 删除 拉黑 模态框 -->
    <Modal :modalTitle="modalTitle" v-if="isShow" class="friendModal">
      <div slot="modal-content" class="freiendText">
        <!-- <div class="concel" @click="isShow = false">x</div> -->
        <p class="text" v-if="modalType === 0">
          是否要删除好友 {{ friendId }} ？
          <br />
          三思啊 😭
        </p>
        <p class="text" v-else-if="modalType === 1">
          确定要将 {{ friendId }} 送进小黑屋？
          <br />
          再考虑考虑？
        </p>
      </div>
      <div slot="modal-footer" class="btn-box" v-if="modalType === 0">
        <button @click="isShow = false" class="not_btn">取消</button>
        <button @click="removeFriends" class="yes_btn">删除</button>
      </div>
      <div slot="modal-footer" class="btn-box" v-if="modalType === 1">
        <button @click="isShow = false" class="not_btn">取消</button>
        <button @click="addBlackList" class="yes_btn">加入</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import "./drawer.scss"
import GroupDetail from "./group_detail/group_detail"
import Modal from "@/components/modal-box/modal-box"
import { mapState, mapActions, mapMutations } from "vuex"
export default {
  data() {
    return {
      modalTitle: "好友操作",
      isShow: false,
      modalType: 0 //0删除好友 、1加入黑名单
    }
  },
  computed: mapState({
    detail_type: state => state.chatStore.userInfo.type,
    friendId: state => state.chatStore.userInfo.userId
  }),
  watch: {
    friendId(){
      //监听ID变化详情框关闭。
      this.$parent.drawerShow = false
    }
  },
  methods: {
    ...mapActions(["getFriendsList", "getUserBlackList"]),
    //删除好友操作
    removeFriends() {
      this.$conn.deleteContact(this.friendId)
      this.getFriendsList()
      this.$store.commit("initUserInfo")
      this.isShow = false
      this.$refs['title'].innerHTML="该好友已删除。"
    },
    //拉黑操作
    addBlackList() {
      this.$conn.addToBlackList({
        name: [this.friendId]
      })
      this.getUserBlackList()
      this.getFriendsList()
      this.$store.commit("initUserInfo")
      this.isShow = false
      this.$refs['title'].innerHTML="该好友已进入小黑屋。"
    }
  },
  components: {
    GroupDetail, //群组详情数据组件
    Modal
  }
}
</script>
