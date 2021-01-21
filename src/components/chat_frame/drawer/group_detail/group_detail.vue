<template>
  <div class="groupChat_drawer" v-if="data">
    <!-- 群组信息 -->
    <div class="group_Info">
      <vue-scroll :ops="ops" ref="vs">
        <h3>群组信息</h3>
        <div class="group_title">
          <p class="groupName" v-if="data.name && data.affiliations_count">
            {{ data.name }}{{ `(${data.affiliations_count})` }}
          </p>
          <!-- 修改群组信息 -->
          <span class="groupChangeInfo_btn" v-if="roleNum.num == 0">
            <img src="@/assets/image/修改.png" title="修改群组信息" />
          </span>
          <br />
          <!-- <span class="groupId">{{ data.id }}</span> -->
        </div>
        <div class="group_main">
          <div class="group_description">
            <!-- <p>群组描述：{{ data.description }}</p> -->
            <span :title="data.description"
              >群详情：{{ data.description }}</span
            >
          </div>
          <!-- 群公告 -->
          <div class="group_announcement">
            <vue-scroll :ops="ops" ref="vs">
              <span v-if="announcement">
                {{ announcement }}
              </span>
              <span v-else>暂无群公告...</span>
            </vue-scroll>
          </div>
        </div>
      </vue-scroll>
    </div>

    <!-- 成员信息 -->
    <div class="groupMem_Info">
      <vue-scroll :ops="ops" ref="vs">
        <div class="box_main">
          <!-- 群成员列表循环 -->
          <ul class="groupMem_list">
            <li
              class="list_data"
              v-for="(item, index) in data.affiliations"
              :key="index"
            >
              <div v-if="item.owner" class="groupMem_list_owner">
                <span class="iconfont icon-yonghu"></span>
                <span>{{ item.owner }}</span>
              </div>
              <div v-if="item.member" class="groupMem_list_member">
                <span class="iconfont icon-yonghu"></span>
                <span>{{ item.member }}</span>
              </div>
              <!-- 群成员管理按钮（禁言、移出、升降管理员） -->
              <div
                class="groupMem_setBtn"
                v-if="roleNum.num == 0 && item.member"
              >
                <div :class="[ adminList.includes(item.member)?'notAdmin':'isAdmin']"></div>
                <div :class="[ allMuteList.includes(item.member)?'notMuteMem':'isMuteMem']"></div>
                <div class="delMem">
                  <span class="iconfont icon-exittuichu"></span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
import "./group_detail.scss"
import { mapState } from "vuex"
import Ops from "@/utils/scrollConfig"
export default {
  data() {
    return {
      ops: Ops,
      data: [],
      nowLoginId: this.$conn.user,
      announcement: "",
      groupOwner: "", //该群群主
      adminList: [], //管理员列表
      allMuteList: [],
      allBlackList: [],
      roleNum: {
        num: null
      }, //role 0 群主 1管理员 2普通成员
      //permissions 权限管理，role 0 群主 1管理员 2普通成员
      permissions: {
        0: {
          modifyGroup: true, //修改群组信息
          removeSingleGroupMember: true, //移出成员
          dissolveGroup: true, //解散群组
          Admin_Btn: true, //管理员功能
          updateGroupAnnouncement: true, //上传群组公告,
          isagreeJoinGroup: true, //是否同意用户入群
          mute_btn: true, //禁言功能,
          blackList_btn: true //黑名单功能
        },
        1: {
          modifyGroup: true, //修改群组信息
          removeSingleGroupMember: true, //移出成员
          dissolveGroup: false, //解散群组
          Admin_Btn: false, //管理员功能
          updateGroupAnnouncement: true, //上传群组公告,
          isagreeJoinGroup: true, //是否同意用户入群
          mute_btn: true, //禁言功能,
          blackList_btn: true //黑名单功能
        },
        2: {
          modifyGroup: false, //修改群组信息
          removeSingleGroupMember: false, //移出成员
          dissolveGroup: false, //解散群组
          Admin_Btn: false, //管理员功能
          updateGroupAnnouncement: false, //上传群组公告,
          isagreeJoinGroup: false, //是否同意用户入群
          mute_btn: false, //禁言功能,
          blackList_btn: false //黑名单功能
        }
      }
    }
  },
  async created() {
    await this.getGroupInfo()
    await this.getGroupAdmin()
    await this.setRole()
  },
  computed: {
    ...mapState({
      groupId: state => state.chatStore.userInfo.userId
    })
  },
  watch: {
    groupId() {
      this.getGroupInfo()
      this.getGroupAdmin()
      this.setRole()
    }
  },
  methods: {
    setRole(param) {
      //处理当前角色权限
      let nowLoginId = this.$conn.user
      if (this.groupOwner == nowLoginId) {
        this.$set(this.roleNum, "num", 0)
      } else if (this.adminList.includes(nowLoginId)) {
        this.$set(this.roleNum, "num", 1)
      } else if (
        this.groupOwner !== nowLoginId &&
        this.adminList.indexOf("nowLoginId") == -1
      ) {
        this.$set(this.roleNum, "num", 2)
      }
    },
    async getGroupInfo() {
      let options = {
        groupId: this.groupId // 群组id
      }
      //拉取群组详情
      await this.$conn.getGroupInfo(options).then(res => {
        this.data = res.data[0]
        this.groupOwner = res.data[0].owner
      })

      //拉取群公告
      let parmes = {
        groupId: this.groupId // 群组id
      }
      await this.$conn.fetchGroupAnnouncement(parmes).then(res => {
        this.announcement = res.data.announcement
      })
    },
    async getGroupAdmin() {
      //拉取群管理员
      let setting = {
        groupId: this.groupId // 群组id
      }
      await this.$conn.getGroupAdmin(setting).then(res => {
        this.adminList = res.data
        // if (this.adminList.indexOf(this.nowLoginId) != -1) {
        //   this.role = 1;
        // }
      })
    },
    getGroupMuteList() {
      let options = {
        groupId: this.groupId // 群组ID
      }
      this.$conn.getMuted(options).then(res => {
        this.allMuteList = res.data
      })
    },
    getGroupBlackList() {
      // 获取群组黑名单
      let option = {
        groupId: this.groupId
      }
      this.$conn.getGroupBlacklistNew(option).then(res => {
        this.allBlackList = res.data
      })
    }
  }
}
</script>
