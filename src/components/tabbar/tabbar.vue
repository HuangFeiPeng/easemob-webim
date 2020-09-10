<template>
  <div class="tabbar-box">
    <div class="user_box">
      <span class="iconfont icon-yonghu"></span>
      <p class="user_ID" v-if="userID">{{ userID }}</p>
    </div>
    <div class="tabList-box">
      <div class="tabList">
        <span class="iconfont icon-ziyuan"></span>
      </div>
      <!-- 跳转至好友列表 -->
      <router-link to="/chat/friends">
        <div class="tabList">
          <span class="iconfont icon-yonghu"></span>
        </div>
      </router-link>
      <!-- 跳转至群组列表 -->
      <router-link to="/chat/group">
        <div class="tabList">
          <span class="iconfont icon-haoyou"> </span>
        </div>
      </router-link>
      <!-- 跳转至聊天室列表 -->
      <router-link to="/chat/chatroom">
        <div class="tabList">
          <span class="iconfont icon-qunzuduoren"></span>
        </div>
      </router-link>
      <router-link to="/chat/setting">
        <div class="tabList" id="setting-tab">
          <span class="iconfont icon-ziyuan156"></span></div
      ></router-link>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import "./tabber.scss";
import Storage from "@/utils/storage";
export default {
  data() {
    return {
      userID: "",
    };
  },
  methods: {},
  async created() {
    this.userID = await Storage.getstorage("userInfo").username;
  },
};
</script>