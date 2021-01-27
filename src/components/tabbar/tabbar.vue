<template>
  <div class="tabbar-box">
    <div class="user_box">
      <span class="iconfont icon-yonghu"></span>
      <p class="user_ID" v-if="userID">{{ userID }}</p>
    </div>
    <div class="tabList-box">
      <!-- 跳转至会话列表 -->
      <keep-alive>
        <router-link to="/chat/conversation">
        <div class="tabList">
        <span class="iconfont icon-ziyuan"></span>
      </div>
      </router-link>
      </keep-alive>
      
      
      <!-- 跳转至好友列表 -->
      <keep-alive>
        <router-link to="/chat/friends">
          <div class="tabList">
            <span class="iconfont icon-yonghu"></span>
          </div>
        </router-link>
      </keep-alive>
      <!-- 跳转至群组列表 -->
      <keep-alive>
        <router-link to="/chat/group">
          <div class="tabList">
            <span class="iconfont icon-haoyou"> </span>
          </div>
        </router-link>
      </keep-alive>
      <!-- 跳转至聊天室列表 -->
      <keep-alive>
        <router-link to="/chat/chatroom">
          <div class="tabList">
            <span class="iconfont icon-qunzuduoren"></span>
          </div>
        </router-link>
      </keep-alive>
      <!-- 跳转至设置按钮 -->
      <router-link to="/chat/setting">
        <div class="tabList" id="setting-tab">
          <span class="iconfont icon-ziyuan156"></span></div
      ></router-link>
    </div>
  </div>
</template>
<script>
import "./tabber.scss"
import Storage from "@/utils/storage"
export default {
  data() {
    return {
      userID: ""
    }
  },
  methods: {},
  async created() {
    this.userID = await Storage.getstorage("userInfo").username
  }
}
</script>
