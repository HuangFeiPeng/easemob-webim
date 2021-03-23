<template>
  <div
    @click="
      $parent.modalType !== 0
        ? ($parent.modalType = 2)
        : ($parent.modalType = -1),
        ($parent.modalTitle = '创建群组')
    "
  >
    <img src="@/assets/image/createGroup.png" alt="" />
    <span>创建群组</span>
    <!-- {{createData}} -->
  </div>
</template>
<script>
export default {
  props: {
    createData: {
      type: Object
    }
  },
  data() {
    return {}
  },
  methods: {
    next() {
      this.$parent.buttonType = -1
    },
    initCreateInfo(){
        this.$parent.create_group_info = {
            groupName: "",
            groupDes: "",
            members: [],
            public: false,
            approval: false,
            allowinvites: false,
            inviteNeedConfirm: false
          }
          this.$parent.modalType = -1
    },
    createNewGroup() {
      console.log(this.createData)
      let options = {
        data: {
          groupname: this.createData.groupName, // 群组名
          desc: this.createData.groupDes, // 群组描述
          members: this.createData.members, // 用户名组成的数组
          public: this.createData.public, // pub等于true时，创建为公开群
          approval: this.createData.public, // approval为true，加群需审批，为false时加群无需审批
          allowinvites: this.createData.allowinvites, // true：允许群成员邀请人加入此群，false：只有群主才可以往群里加人
          inviteNeedConfirm: this.createData.inviteNeedConfirm // 邀请加群，被邀请人是否需要确认。true 为需要被邀请者同意才会进群
        }
      }
      this.$conn
        .createGroupNew(options)
        .then(res => {
          console.log(res)
          this.$notify({
            title: `群组创建成功`,
            message: `${this.createData.groupName}创建成功！！`,
            type: "success"
          })
          this.initCreateInfo();
          
        })
        .catch(err => {
          console.log(err)
          this.$notify({
            title: `群组创建失败`,
            message: `${this.createData.groupName}创建失败，请稍后重试！`,
            type: "error"
          })
          this.initCreateInfo()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  flex-direction: row;
  // justify-content: space-around;
  align-items: center;
  img {
    margin: 0 10px 0 50px;
    width: 20px;
    height: 20px;
  }
}
</style>
