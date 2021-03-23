<template>
  <div
    @click="
      $parent.modalType !== 1
        ? ($parent.modalType = 1)
        : ($parent.modalType = -1),
        ($parent.modalTitle = '申请入群'),
        getPublicGroups()
    "
  >
    <img src="@/assets/image/joinGroup.png" alt="" />
    <span>申请入群</span>
  </div>
</template>
<script>
export default {
  props: {
    toID: {
      type: String
    }
  },
  data() {
    return {}
  },

  methods: {
    getPublicGroups() {
      let limit = 20,
        cursor = null
      let options = {
        limit: limit, // 预期每页获取的记录数
        cursor: cursor // 游标
      }
      this.$conn.listGroups(options).then(res => {
        console.log(res)
        this.$parent.publicGroups = res.data
      })
    },
    joinGroups() {
      let options = {
        groupId: this.toID, // 群组ID
        description: "1111111"
      }
      this.$conn
        .joinGroup(options)
        .then(res => {
          console.log(res)
          res.data.result &&
            this.$notify({
              title: `申请成功🤠`,
              message: `群组${this.toID}申请成功,静候佳音！`,
              type: "success"
            })
          this.$parent.toId = ""
        })
        .catch(err => {
          let error = JSON.parse(err.data)
          console.log(error)
          if (error.error === "resource_not_found") {
            console.log(this)
            this.$notify.error({
              title: `申请加群失败🤪`,
              message: `${this.toID}不存在`
            })
          } else if (error.error_description.indexOf("already") > 0) {
            this.$notify.error({
              title: `申请加群失败🤪`,
              message: `你都在群里了`
            })
          }
          this.$parent.toId = ""
        })
    },
    getGorupInfo() {
      let options = {
        groupId: this.toID // 群组id
      }
      this.$conn
        .getGroupInfo(options)
        .then(res => {
          console.log(">>>>>>>群组详情", res.data[0].public)
          if (res.data[0].public) {
            this.joinGroups()
          } else {
            this.$notify.error({
              title: `申请加群失败🤪`,
              message: `该群为私有群禁止申请加入！`
            })
            this.$parent.toId = ""
            return
          }
        })
        .catch(err => {
          if (JSON.parse(err.data).error == "group_authorization") {
            this.$notify.error({
              title: `申请加群失败🤪`,
              message: `该群为私有群禁止申请加入！`
            })
            this.$parent.toId = ""
            return
          }
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
