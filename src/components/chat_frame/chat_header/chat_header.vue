<template>
  <div class="chat_header">
    <h3>
      <span v-if="$store.state.chatStore.userInfo.userName">{{
        $store.state.chatStore.userInfo.userName
      }}</span>
      <span v-else>{{ $store.state.chatStore.userInfo.userId }}</span>
    </h3>
    <!-- <h3>{{ groupId }}</h3> -->

    <!-- <h3>{{ $store.state.chatStore.userInfo.userName}}</h3> -->
  </div>
</template>
<script>
export default {
  props: {
    name
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
    // text-align: left;
    margin-left: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 25px;
  }
}
</style>
