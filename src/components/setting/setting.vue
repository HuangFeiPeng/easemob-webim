<template>
  <div class="setting">
    <div class="logOut-Btn" @click="isShow = true">退出登陆</div>
    <Modal :modalTitle="modalTitle" class="setting-box" v-if="isShow">
      <div slot="modal-content">
        <div class="concel" @click="isShow = false">x</div>
        <p>是否要进行退出？</p>
      </div>
      <div slot="modal-footer" class="btn-box">
        <button @click="logOut" class="yes_btn">确认</button>
        <button @click="isShow = false" class="not_btn">取消</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import "./setting.scss"
import Modal from "@/components/modal-box/modal-box"
import Storage from "@/utils/storage"
console.log(Storage)
export default {
  data() {
    return {
      modalTitle: "设置",
      isShow: false
    }
  },
  methods: {
    async logOut() {
      await this.$conn.close()
      this.isShow = false
      await Storage.clearstorage("userInfo")
      let initStore = Storage.getstorage("initeStore")
      let nowStore = this.$store.state
      await Object.assign(nowStore, initStore)
      console.log(">>>>>nowStore", nowStore)
    }
  },
  components: {
    Modal
  }
}
</script>
