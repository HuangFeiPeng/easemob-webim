<template>
  <div class="chat_sendBox">
    <!-- 功能栏 -->
    <ul class="fun_Btn">
      <li>
        <span class="iconfont icon-biaoqing"></span>
      </li>
      <li>
        <span class="iconfont icon-tuku"></span>
      </li>
      <li>
        <span class="iconfont icon-wenjian"></span>
      </li>
      <li>
        <span class="iconfont icon-yuyin"></span>
      </li>
      <li>
        <span class="iconfont icon-lishi"></span>
      </li>
    </ul>
    <div class="send-content">
      <vue-scroll :ops="ops">
        <div contenteditable="true" spellcheck="true" class="send-textbox">
          11111
        </div>
      </vue-scroll>
    </div>

    <!-- 消息发送文本域 -->
  </div>
</template>
<script>
import "./chat_sendBox.scss"
import Ops from "@/utils/scrollConfig"
export default {
  data() {
    return {
      ops: Ops
    }
  }
}
</script>
