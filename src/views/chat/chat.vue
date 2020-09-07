<template>
  <div class="chat-body">
    <Tabbar />
  </div>
</template>
<script>
import "./chat.scss";
import Tabbar from '@/components/tabbar/tabbar';
import Storage from '../../utils/storage';
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  created() {
      this.userInfo = Storage.getstorage('userInfo');
      this.$conn.open({
        apiUrl: this.$WebIM.config.apiURL,
        user: this.userInfo.username,
        accessToken: this.userInfo.token,
        appKey: this.$WebIM.config.appkey
      })
  },
  components:{
    Tabbar
  }
}
</script>

