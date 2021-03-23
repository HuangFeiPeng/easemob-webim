<template>
  <div class="add_box">
    <addFriend class="mod" ref="add_Friend" :toID="toId"></addFriend>
    <addGroup class="mod" ref="join_Group" :toID="toId"></addGroup>
    <createGroup class="mod" ref="create_Group" :createData="create_group_info"></createGroup>
    <modal v-show="modalType !== -1" :modalTitle="modalTitle" class="modal_box">
      <!-- 添加好友部分 -->
      <div slot="modal-content" v-show="modalType === 0">
        <input
          type="text"
          class="toId"
          v-model="toId"
          placeholder="填入目标ID"
        />
      </div>
      <!-- 申请加群部分 -->
      <div slot="modal-content" v-show="modalType === 1">
        <input
          type="text"
          class="toId"
          v-model="toId"
          placeholder="填入目标ID"
        />
        <ul v-if="isForPublicGroupList">
          <li v-for="(item, idx) in publicGroups" :key="idx">
            {{ item.groupname + `(${item.groupid})` }}
          </li>
        </ul>
      </div>
      <!-- 创建群组 -->
      <div slot="modal-content" v-show="modalType === 2">
        <div class="startCreate" v-if="buttonType==0">
          <input type="text" id="group_name" placeholder="请输入群组名称" v-model="create_group_info.groupName" />
          <br />
          <textarea id="group_brief" placeholder="请编辑群组详情" v-model="create_group_info.groupDes"></textarea>
          <br />
          <div>
            <label for="isPublic">
              是否为公开群：<input type="checkbox" id="isPublic" @click="create_group_info.public = !create_group_info.public">
            </label>
            <br>
            <label for="isPass">
              是否需要审批：<input type="checkbox" id="isPass" @click="create_group_info.approval =!create_group_info.approval">
            </label>
            <br />
            <label for="isMemPass">
              是否允许群成员进行成员邀请：<input type="checkbox" id="isMemPass" @click="create_group_info.allowinvites = !create_group_info.allowinvites">
            </label>
            <br />
            <label for="isInvite">
              被邀请人是否需要确认<input type="checkbox" id="isInvite" @click="create_group_info.inviteNeedConfirm = !create_group_info.inviteNeedConfirm">
            </label>
              
            
          </div>
          
        </div>
        <div v-else>
          选择要添加的好友
          <!-- {{friendList}} -->
          <ul>
            <li v-for="(item,idx) in friendList" :key="idx">
              <label for="">{{item.name}}<input type="checkbox" @click="setMembersList(item.name)"></label>
            </li>
          </ul>
        </div>
      </div>
      <div slot="modal-footer" class="btn-box" v-show="modalType === 0">
        <button class="not_btn" @click="modalType = -1">取消</button>
        <button class="yes_btn" @click="$refs.add_Friend.addFriends()">
          申请
        </button>
      </div>
      <div slot="modal-footer" class="btn-box" v-show="modalType === 1">
        <button class="not_btn" @click="modalType = -1">取消</button>
        <button class="yes_btn" @click="$refs.join_Group.getGorupInfo()">
          申请
        </button>
      </div>
      <div slot="modal-footer" class="btn-box" v-show="modalType === 2">
        <button class="not_btn" @click="modalType = -1,buttonType = 0">取消</button>
        <button class="yes_btn" v-if="buttonType===0" @click="$refs.create_Group.next()">
          下一步
        </button>
        <button class="yes_btn"  v-else @click="$refs.create_Group.createNewGroup()">
          创建
        </button>
      </div>
    </modal>
  </div>
</template>
<script>
import addFriend from "./add_Friend"
import addGroup from "./add_Group"
import createGroup from "./create_Group"
import modal from "@/components/modal-box/modal-box"
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      modalType: -1, //0好友申请 1群组申请 2创建群组
      modalTitle: "",
      toId: "",
      isForPublicGroupList: null,
      publicGroups: [],
      buttonType:0,
      create_group_info:{
        groupName:"",
        groupDes:"",
        members:[],
        public:false,
        approval:false,
        allowinvites:false,
        inviteNeedConfirm: false
      }
    }
  },
  mounted(){
    this.$store.dispatch('getFriendsList');
  },
  watch: {
    publicGroups: "forPublicGroupList"
  },
  computed: {
    friendList(){
      return this.$store.state.chatStore.aboutList.friendsList
    }
  },
  methods: {
    forPublicGroupList() {
      this.isForPublicGroupList = true
    },
    setMembersList(mem){
      let list = this.friendList;
      let nowMemList = this.create_group_info.members;
      if (nowMemList.includes(mem)) {
        nowMemList.forEach((item,index) => {
          if(mem === item){
            return nowMemList.splice(index,1)
          }
        });
      }else{
        return nowMemList.push(mem)
      }
    }
  },
  components: {
    addFriend,
    addGroup,
    createGroup,
    modal
  }
}
</script>
<style lang="scss" scoped>
.mod {
  height: 50px;
  margin: 10px 0;
  &:hover {
    background: linear-gradient(90deg, #3293e9 30%, #104fad96);
    color: #fff;
  }
}
.modal_box {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  .toId {
    margin-top: 10px;
    width: 100%;
    height: 30px;
    font-size: 16px;
  }
  .startCreate {
    display: flex;
    flex-direction: column;
    #group_name {
      height: 30px;
      font-size: 16px;
      border: 1px solid #3293e9;

    }
    #group_brief {
      font-size: 16px;
      resize: none;
      border: 1px solid #3293e9;
    }
    // label {
    //   display: inline-block;
    //   width: 100px;
    //   height: 50px;
    //   border-radius: 5px;
    //   color: #fff;
    //   margin: 0 30px;
    //   line-height: 50px;
    //   background: #3293e9;
    // }
  }
  .yes_btn,
  .not_btn {
    width: 80px;
    height: 40px;
    border: none;
    border-radius: 3px;
    color: #fff;
    transition: all 0.3s;
    cursor: pointer;
  }

  .yes_btn {
    background-color: #3293e9;
    &:hover {
      transform: scale(1.1);
    }
  }

  .not_btn {
    background-color: red;
    margin-right: 20px;
    &:hover {
      transform: scale(1.1);
    }

    &:active {
      color: #333;
      background-color: rgba(255, 0, 0, 0.336);
    }
  }
}
</style>
