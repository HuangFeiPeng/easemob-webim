<template>
  <div class="conversation-box">
    <div class="conversation_header">
      <h3 class="title">
        会话列表
      </h3>
    </div>
    <div class="conversation_content">
      <vue-scroll :ops="ops">
        <div class="conversation_search">
          <input id="search_keyword" type="text" />
        </div>
      </vue-scroll>
    </div>
  </div>
</template>
<script>
import "./conversation.scss"
import Ops from "@/utils/scrollConfig"
// import { mapActions } from 'vuex';
export default {
  data() {
    return {
      ops: Ops //滚动配置,
    }
  },
  beforeCreate() {}
}
</script>
