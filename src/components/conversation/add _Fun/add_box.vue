<template>
  <div class="add_box">
    <addFriend class="mod" ref="add_Friend" :toID="toId"></addFriend>
    <addGroup class="mod" ref="join_Group" :toID="toId"></addGroup>
    <createGroup class="mod"></createGroup>
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
          <li  v-for="(item,idx) in publicGroups" :key="idx">{{item.groupname+`(${item.groupid})`}}</li>
        </ul>
      </div>

      <div slot="modal-footer" class="btn-box" v-show="modalType === 0">
        <button class="not_btn" @click="modalType = -1">取消</button>
        <button class="yes_btn" @click="$refs.add_Friend.addFriends()">
          申请
        </button>
      </div>
      <div slot="modal-footer" class="btn-box" v-show="modalType === 1">
        <button class="not_btn" @click="modalType = -1">取消</button>
        <button class="yes_btn" @click="$refs.join_Group.joinGroups()">
          申请
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
export default {
  data() {
    return {
      modalType: -1, //0好友申请 1群组申请 2创建群组
      modalTitle: "",
      toId: "",
      isForPublicGroupList: null,
      publicGroups: []
    }
  },
  watch: {
    publicGroups: "forPublicGroupList"
  },
  methods: {
    forPublicGroupList (){
      this.isForPublicGroupList = true
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
  .toId {
    margin-top: 10px;
    width: 100%;
    height: 30px;
    font-size: 16px;
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
