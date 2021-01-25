<template>
  <div class="groupChat_drawer" v-if="data">
    <!-- 群组信息 -->
    <div class="group_Info">
      <vue-scroll :ops="ops" ref="vs">
        <h3>群组信息</h3>
        <div class="group_title">
          <p
            class="groupName"
            v-show="data.name && data.affiliations_count"
            :contenteditable="!allowChangeGroupName"
            @input="setGroupName"
            ref="groupName"
          >
            {{ data.name }}
            <span v-show="allowChangeGroupName">{{
              `(${data.affiliations_count})`
            }}</span>
          </p>

          <!-- 修改群组信息 -->
          <span class="groupChangeInfo_btn" v-if="roleNum.num == 0">
            <img
              class="amend"
              @click="setGroupName"
              v-if="allowChangeGroupName"
              :src="amend.img"
              :title="amend.title"
            />
            <img
              class="save"
              v-else
              @click="saveGroupName"
              :src="save.img"
              :title="save.title"
            />
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
                <!-- 升降管理员 -->
                <div
                  :class="[
                    adminList.includes(item.member) ? 'notAdmin' : 'isAdmin'
                  ]"
                  @click="setAdmin(item.member)"
                  title="管理员操作"
                ></div>
                <!-- 禁言成员 -->
                <div
                  :class="[
                    allMuteList.includes(item.member)
                      ? 'notMuteMem'
                      : 'isMuteMem'
                  ]"
                  @click="setMuteMem(item.member)"
                  title="禁言操作"
                ></div>
                <!-- 移出成员 -->
                <div class="delMem">
                  <span
                    class="iconfont icon-exittuichu"
                    @click="
                      isModal = true
                      modalType = 3
                      nowPickMember = item.member
                    "

                  ></span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </vue-scroll>
    </div>

    <!-- 群组设置 -->
    <div class="set_Btn">
      <span
        class="iconfont icon-ziyuan156"
        @click.stop="isShowGroup_set = !isShowGroup_set"
      ></span>
    </div>
    <transition name="slide-fade">
      <div class="group_set" v-show="isShowGroup_set">
        <!-- 群主或者管理员方可做出邀请 -->
        <span
          @click="
            isModal = true
            modalType = 0
          "
          v-if="roleNum.num == 0 || roleNum.num == 1"
          >邀请成员</span
        >
        <!-- 管理员或者群成员方可退出 -->
        <span
          @click="
            isModal = true
            modalType = 2
          "
          v-if="roleNum.num == 2 || roleNum.num == 1"
          >退出群组</span
        >
        <!-- 只有群主方可解散群组 -->
        <span
          @click="
            isModal = true
            modalType = 1
          "
          v-if="roleNum.num == 0"
          >解散群组</span
        >
      </div>
    </transition>

    <!-- 弹出模态框 -->
    <Modal :modalTitle="modalTitle" v-if="isModal" class="groupMadal">
      <div slot="modal-content" class="GroupText">
        <div v-if="modalType == 0">
          <h3>好友名称：</h3>
          <input
            type="text"
            class="memId"
            v-model="memId"
            placeholder="邀请人ID..."
          />
        </div>
        <div v-if="modalType == 1">
          <h3 style="color:red">您确定要解散该群？三思啊！</h3>
        </div>
        <div v-if="modalType == 2">
          <h3>您确定要退出该群？</h3>
        </div>
        <div v-if="modalType == 3">
          <h3>您确定要移除该成员？</h3>
        </div>
      </div>
      <div slot="modal-footer" class="btn-box" v-if="modalType == 0">
        <button class="not_btn" @click="isModal = false">取消</button>
        <button class="yes_btn" @click="inviteMem">邀请</button>
      </div>
      <div slot="modal-footer" class="btn-box" v-if="modalType == 1">
        <button class="not_btn" @click="isModal = false">取消</button>
        <button class="yes_btn" @click="dissolveGroup">解散</button>
      </div>
      <div slot="modal-footer" class="btn-box" v-if="modalType == 2">
        <button class="not_btn" @click="isModal = false">取消</button>
        <button class="yes_btn" @click="quitGroup">确定</button>
      </div>
      <div slot="modal-footer" class="btn-box" v-if="modalType == 3">
        <button class="not_btn" @click="isModal = false">取消</button>
        <button class="yes_btn" @click="removeMember">确定</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import "./group_detail.scss"
import { mapState, mapActions } from "vuex"
import Ops from "@/utils/scrollConfig"
import Modal from "@/components/modal-box/modal-box"
export default {
  data() {
    return {
      ops: Ops,
      modalTitle: "群组操作",
      isModal: false,
      memId: "",
      modalType: 0, //0邀请成员、1解散群组、2退出群组、3移出群组
      nowPickMember: "", //当前选中的群成员、
      data: [], //群组详情
      nowLoginId: this.$conn.user, //当前登录人ID
      announcement: "", //群公告
      groupOwner: "", //该群群主
      adminList: [], //管理员列表
      allMuteList: [], //群组禁言列表
      allBlackList: [], //TO DO 群黑名单列表，但未使用
      roleNum: {
        num: null
      }, //role 0 群主 1管理员 2普通成员
      //permissions 权限管理，role 0 群主 1管理员 2普通成员
      /* permissions功能待定 */
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
      },
      allowChangeGroupName: true, //控制是否容许修改群名称
      newGroupName: "", //新群名
      amend: { img: require("@/assets/image/修改.png"), title: "点击修改群名" },
      save: { img: require("@/assets/image/上传.png"), title: "点击保存修改" },
      isShowGroup_set: false //控制群设置的显隐
    }
  },
  async created() {
    await this.getGroupInfo()
    await this.getGroupAdmin()
    this.setRole(), this.getGroupMuteList()
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
    ...mapActions(["getUserName", "getGroupsList"]),
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
    setGroupName(e) {
      this.allowChangeGroupName = false
      this.$nextTick(() => {
        this.newGroupName = this.$refs["groupName"].innerText
        // let title = this.$refs["groupName"].innerText
        console.log(this.newGroupName)

        this.$refs["groupName"].style.border = "2px dashed #1052c2"
        this.$refs["groupName"].style.borderRadius = "5px"
      })
    },
    saveGroupName() {
      //保存群名的修改,后期再加修改群详情
      this.allowChangeGroupName = true
      this.$nextTick(() => {
        this.$refs["groupName"].style.border = "none"
        this.$refs["groupName"].style.borderRadius = "none"
        let option = {
          groupId: this.groupId,
          groupName: this.newGroupName, // 群组名称
          description: "Change group information test" // 群组简介
        }
        if (this.data.name !== this.newGroupName) {
          this.$conn.modifyGroup(option).then(res => {
            // TO DO 投机取巧直接调用了再拉一遍群列表，理想是直接搜索查找store里存的值然后修改。
            this.getGroupsList(),
              this.getUserName({
                chatID: this.groupId,
                chatName: this.newGroupName,
                type: 1
              })
          })
        }
      })
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
        console.log(">>>>>>禁言列表", res)
        let arr = []
        res.data && res.data.forEach(item => {
          arr.push(item.user)
          console.log(item.user);
        })
        this.allMuteList =arr;
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
    },
    inviteMem() {
      let option = {
        users: [this.memId],
        groupId: this.groupId
      }
      this.memId &&
        this.$conn
          .inviteToGroup(option)
          .then(res => {
            res.data[0].action == "invite" &&
              this.$notify({
                title: `邀请成功`,
                message: `您邀请的信件已发出,静候佳音吧！`,
                type: "success"
              })
          })
          .catch(e => {
            console.log(e.data)
            let errorType = JSON.parse(e.data)
            if (errorType.error == "forbidden_op") {
              let error = errorType.error_description.split(",")
              //操作目的是为了查询详情中是否存在’already‘这个单词，如果有就代表该成员已经存在。
              if (error[1].split(" ").includes("already")) {
                this.$notify.error({
                  title: `邀请失败`,
                  message: `${error[1].split(" ")[2]}已经存在于群组${
                    error[1].split(" ")[6]
                  }当中。`
                })
              }
            } else if (errorType.error == "resource_not_found") {
              let error = errorType.error_description.split(" ")
              if (error.includes("doesn't") && error.includes("exist!")) {
                this.$notify.error({
                  title: `邀请失败`,
                  message: `"${error[1]}"这人压根就不存在,你再好好看看！`
                })
              }
            }
          })
      this.memId = ""
    },
    quitGroup() {
      // 成员主动退出群
      let option = {
        groupId: this.groupId
      }
      this.$conn.quitGroup(option).then(res => {
        this.$notify({
          title: `退出成功`,
          message: `已退出"${this.data.name}"群~`,
          type: "success"
        })
        this.getGroupsList(),
          this.getUserName({
            chatID: "",
            chatName: "",
            type: 1
          })
      })
    },
    dissolveGroup() {
      // 解散一个群组
      let option = {
        groupId: this.groupId
      }
      this.$conn.dissolveGroup(option).then(res => {
        console.log(res)
        this.$notify({
          title: `解散成功`,
          message: `该群已解散`,
          type: "success"
        })
        this.getGroupsList(),
          this.getUserName({
            chatID: "",
            chatName: "",
            type: 1
          })
      })
    },
    removeMember() {
      // 移除群组成员
      let option = {
        groupId: this.groupId,
        username: this.nowPickMember // 群组成员名称
      }
      this.nowPickMember &&
        this.$conn.removeSingleGroupMember(option).then(res => {
          this.$notify({
            title: `移出成功`,
            message: `已将"${this.nowPickMember}"移出本群~`,
            type: "success"
          })
          this.nowPickMember = ""
          this.getGroupInfo()
          this.isModal = false
        })
    },
    setAdmin(mem) {
      let options = {
        groupId: this.groupId, // 群组id
        username: mem // 用户名
      }
      if (mem && !this.adminList.includes(mem)) {
        this.$conn.setAdmin(options).then(res => {
          console.log(">>>>>设置成功", res)
          this.getGroupAdmin()
        })
      } else {
        this.$conn.removeAdmin(options).then(res => {
          console.log(">>>>>>>>移出成功", res)
          this.getGroupAdmin()
        })
      }
    },
    setMuteMem(mem) {
      let options = {
        username: mem, // 成员用户名
        muteDuration: -1, // 禁言的时长，单位是毫秒
        groupId: this.groupId
      }
      if (mem && !this.allMuteList.includes(mem)) {
        this.$conn.mute(options).then(res => {
          console.log(">>>>>>禁言成功", res)
          this.getGroupMuteList()
        })
      } else {
        this.$conn.removeMute(options).then(res => {
          console.log(res)
          this.getGroupMuteList()
        })
      }
      console.log(mem)
    }
  },
  components: {
    Modal
  }
}
</script>
