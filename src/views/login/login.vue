<template>
  <div id="login">
    <div class="login_bg">
      <h1 class="text">环信WebIM-Demo</h1>
      <div class="bg-image"></div>
      <!-- <marquee
          behavior=""
          direction=""
          title="感谢您选择环信"
          style="cursor: pointer;"
          >连接人与人,连接人与商业\(^o^)/~</marquee
        > -->
      <!-- 登陆框 -->
      <div class="login-box">
        <span class="login-title">欢迎使用IM体验Demo</span>
        <p class="changeTitle" v-text="isShow ? '现在登陆' : '现在注册'"></p>
        <b class="bottom-line"></b>
        <form>
          <label for="usesId">
            <div class="login—input">
              <input
                type="text"
                placeholder="请输入ID..."
                id="usesId"
                class="input"
                name="username"
                required
                v-model="username"
                @input="changeBtn"
              />
            </div>
          </label>
          <label for="psw">
            <div class="login—input">
              <input
                type="password"
                placeholder="请输入密码..."
                id="psw"
                class="input"
                name="passworld"
                required
                v-model="password"
                @input="changeBtn"
                @keydown.enter="login"
              />
            </div>
          </label>
          <div class="changBtn">
            <p v-if="isShow">
              <span>没有账号？</span>
              <span @click="changType">即刻注册</span>
            </p>
            <p v-else>
              <span>已有账号？</span>
              <span @click="changType">即刻登陆</span>
            </p>
          </div>
          <input
            type="button"
            value="登陆"
            class="login-btn"
            @click="login"
            :disabled="!isDisabled"
            v-if="isShow"
          />
          <input
            type="button"
            value="注册"
            class="login-btn"
            @click="register"
            :disabled="!isDisabled"
            v-else
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Storage from "../../utils/storage"
import "./login.scss"

export default {
  data() {
    return {
      username: "",
      password: "",
      isDisabled: false,
      isShow: true
    }
  },
  created() {
    console.log(this)
    // console.log(">>>>conn", conn);

    console.log(">>>>", this.$WebIM)
  },
  methods: {
    //改变按钮禁用状态
    changeBtn: function() {
      if (this.username != "" && this.password != "") {
        this.isDisabled = true
      } else if (this.password == "" || this.username == "") {
        this.isDisabled = false
      }
    },
    //chantType
    changType: function() {
      this.title = this.isShow = !this.isShow
    },
    //登陆
    login: function() {
      let that = this
      if (this.username != "" && this.password != "") {
        this.isDisabled = true
        this.$conn.open({
          apiUrl: this.$WebIM.config.apiURL,
          user: this.username.toLocaleLowerCase(),
          pwd: this.password.toLocaleLowerCase(),
          appKey: this.$WebIM.config.appkey,
          success: function(res) {
            that.$notify({
              title: `${this.user}登陆成功🤠`,
              message: "欢迎使用IM体验Demo！",
              type: "success"
            })
            var userInfo = {
              username: this.user,
              password: this.pwd,
              token: res.access_token
            }
            Storage.setstorage("userInfo", userInfo)
          },
          error: function(e) {
            console.log(">>>>登陆失败", e)
          }
        })
      }
    },
    //注册
    register: function() {
      let that = this
      this.$conn.registerUser({
        username: this.username.toLocaleLowerCase(),
        password: this.password.toLocaleLowerCase(),
        nickname: "nickname",
        appKey: this.$WebIM.config.appkey,
        apiUrl: this.$WebIM.config.apiURL,
        success: function(res) {
          that.$notify({
            title: `注册成功😃`,
            message: `您的注册ID为${that.username}，快去登陆吧！`,
            type: "success"
          })
          console.log("注册成功~", res)
        },
        error: function(e) {
          if (JSON.parse(e.data).error == "duplicate_unique_property_exists") {
            that.$notify.error({
              title: `注册失败🤪`,
              message: `用户名已存在，请更换注册ID`
            })
          } else if (JSON.parse(e.data).error == "illegal_argument") {
            if (JSON.parse(e.data).error_description === "USERNAME_TOO_LONG") {
              that.$notify.error({
                title: `注册失败🤪`,
                message: `注册ID超过64个字节，太长了，短点吧！`
              })
            }
            that.$notify.error({
              title: `注册失败🤪`,
              message: `注册ID不合法！`
            })
          } else if (JSON.parse(e.data).error == "unauthorized") {
            that.$notify.error({
              title: `注册失败🤪`,
              message: `前端注册未授权！请检查是否开启开放注册模式。`
            })
          } else if (JSON.parse(e.data).error == "resource_limited") {
            that.$notify.error({
              title: `注册失败🤪`,
              message: `该Appkey用户注册数量已达上限,请升级至企业版！`
            })
          }
          console.log(">>>>>注册error", JSON.parse(e.data).error)
        }
      })
    }
  }
}
</script>
