<template>
  <div class="chat_header">
    <h3>
      <span v-if="nowIdInfo.userName">{{ nowIdInfo.userName }}</span>
      <span v-else>{{ nowIdInfo.userId }}</span>
    </h3>
    <div class="list_btn" @click="showDrawer">
      <span class="iconfont icon-liebiao"></span>
    </div>
    <!-- <Drawer v-if="isDrawer"></Drawer> -->
  </div>
</template>
<script>
import { mapState } from "vuex"
// import Drawer from '@/components/chat_frame/drawer/drawer';
export default {
  props: ["drawerHide"],
  computed: {
    ...mapState({
      nowIdInfo: state => state.chatStore.userInfo
    })
  },
  data() {
    return {
      isDrawer: true
      // groupId: this.$store.state.chatStore.userInfo.userId,
    }
  },
  methods: {
    showDrawer: function() {
      if (this.nowIdInfo.userId || this.nowIdInfo.userName) {
        return this.drawerHide
          ? this.$emit("update:drawerHide", false)
          : this.$emit("update:drawerHide", true)
      }

    }
    // this.drawerHide ?this.$emit("update:drawerHide", false):this.$emit("update:drawerHide", true)
  },
  components: {
    // Drawer
  }
}
</script>
<style lang="scss" scoped>
.chat_header {
  position: relative;
  width: 100%;
  height: 50px;
  h3 {
    display: inline-block;
    // width: 300px;
    margin-left: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 25px;
  }
  .list_btn {
    position: absolute;
    right: 0;
    top: 0;
    display: inline-block;
    width: 100px;
    height: 100%;
    text-align: center;
    line-height: 50px;
    span {
      font-size: 25px;
    }
  }
}
</style>
