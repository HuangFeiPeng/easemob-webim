<template>
  <div class="groupChat_drawer" v-if="data[0]">
    <h3>群组信息</h3>
    <div class="box_title">
      <h3>群名称</h3>
      <p>{{ data[0].name }}</p>
      <span>{{ data[0].id }}</span>
      <br />
      <span v-text="data[0].public ? '公开群' : '私有群'"></span>
    </div>
    <div class="box_main">
      <h3>群成员:{{ data[0].affiliations_count }}</h3>
      <ul>
        <li v-for="(item, index) in data[0].affiliations" :key="index">
          <div v-if="item.owner">群主{{ item.owner }}</div>
          <div v-if="item.member">群成员{{ item.member }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  data() {
    return {
      data: [],
      announcement: "",
      adminList: [],
      allMuteList:[],
      allBlackList:[]
    }
  },
  created() {
    this.getGroupInfo()
    this.getGroupAdmin()
    // this.getGroupMuteList()
    // this.getGroupBlackList()
  },
  computed: mapState({
    groupId: state => state.chatStore.userInfo.userId
  }),
  watch: {
    groupId() {
      this.getGroupInfo()
    }
  },
  methods: {
    async getGroupInfo() {
      let options = {
        groupId: this.groupId // 群组id
      }
      //拉取群组详情
      await this.$conn.getGroupInfo(options).then(res => {
        console.log(res)
        this.data = res.data
      })

      //拉取群公告
      let parmes = {
        groupId: this.groupId // 群组id
      }
      await this.$conn.fetchGroupAnnouncement(parmes).then(res => {
        console.log(res)
        this.announcement = res.data.announcement
      })
    },
    getGroupAdmin() {
      //拉取群管理员
      let setting = {
        groupId: this.groupId // 群组id
      }
      this.$conn.getGroupAdmin(setting).then(res => {
        // console.log(res.data)
        this.adminList = res.data
      })
    },
    getGroupMuteList() {
      let options = {
        groupId: this.groupId // 群组ID
      }
      this.$conn.getMuted(options).then(res => {
        console.log(">>>>禁言列表", res)
        this.allMuteList = res.data;
      })
    },
    getGroupBlackList() {
      // 获取群组黑名单
      let option = {
        groupId: this.groupId
      }
      this.$conn.getGroupBlacklistNew(option).then(res => {
        console.log('>>>>>获取黑名单',res)
        this.allBlackList = res.data;
      })
    }
  }
}
</script>
