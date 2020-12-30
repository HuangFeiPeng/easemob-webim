<template>
  <div class="chat_header">
    <h3>
      <span v-if="nowIdInfo.userName">{{ nowIdInfo.userName }}</span>
      <span v-else>{{ nowIdInfo.userId }}</span>
    </h3>
    <div class="list">
        <span class="iconfont icon-liebiao"></span>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  props: {
    name
  },
  computed: {
    ...mapState({
      nowIdInfo: state => state.chatStore.userInfo
    })
  },
  data() {
    return {
      // groupId: this.$store.state.chatStore.userInfo.userId,
    }
  }
}
</script>
<style lang="scss" scoped>
.chat_header {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  // background: cadetblue;
  h3 {
    display: inline-block;
    width: 300px;
    margin-left: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 25px;
  }
  .list{
    display: inline-block;
    width: 100px;
    // height: 100%;
  }
 
}
</style>
