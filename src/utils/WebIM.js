import websdk from "easemob-websdk"
import config from "./WebIMConfig"
import someFun from "./function"
import getNowdate from './getTime';

var conn = {}
var WebIM = {}
WebIM = websdk
WebIM.config = config
conn = WebIM.conn = new WebIM.connection({
  appKey: WebIM.config.appkey,
  isHttpDNS: WebIM.config.isHttpDNS,
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: WebIM.config.https,
  url: WebIM.config.socketServer,
  apiUrl: WebIM.config.restServer,
  isAutoLogin: WebIM.config.isAutoLogin,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  delivery: WebIM.config.delivery,
  useOwnUploadFun: WebIM.config.useOwnUploadFun
})

conn.listen({
  onOpened: function() {
    window.Vue.$message({
      type: "success",
      message: "IM连接成功！",
      center: true
    })
    // console.log('>>>>>登陆', this.message);
    //登陆成功之后的跳转
    if (window.location.pathname == "/chat") {
      return
    } else {
      window.Vue.$router.push("/chat").catch(err => {
        err
      })
    }
    window.Vue.$store.dispatch('getGroupsList');
    //登陆成功获取会话列表
    window.Vue.$store.dispatch('getConversationList');
  }, //连接成功回调
  onClosed: function() {
    console.log(">>>>环信断开连接")
    console.log(window.Vue.$store.state)
    window.Vue.$message({
      type: "warning",
      message: "IM连接关闭！",
      center: true
    })
    window.Vue.$router.push("/login").catch(err => err)
  }, //连接关闭回调
  onContactInvited: function(msg) {
    console.log("收到好友邀请", msg)
  }, // 收到好友邀请
  onContactDeleted: function(msg) {
        window.Vue.$notify({
          title: `好友关系解除`,
          message:`与${msg.from}的好友关系解除`,
          type: "success"
        })
    
    console.log("收到被删除", msg)
  }, // 被删除时回调此方法
  onContactAdded: function(msg) {
    console.log("收到添加联系人", msg)
  }, // 增加了联系人时回调此方法
  onContactRefuse: function(msg) {
    console.log("收到好友请求被拒绝", msg)
  }, // 好友请求被拒绝
  onContactAgreed: function(msg) {
    console.log(">>>好友请求被同意", msg)
  }, // 好友请求被同意
  onTextMessage: function(msg) {
    someFun.otherMsg(msg)
    // someFun(msg)
  }, //收到文本消息
  onEmojiMessage: function() {}, //收到表情消息
  onPictureMessage: function(msg) {
    someFun.otherMsg(msg)
  }, //收到图片消息
  onCmdMessage: function() {}, //收到命令消息
  onAudioMessage: function(msg) {
    console.log(">>>>>收到音频消息", msg.url)
    if (msg.url) {
      var options = {
        url: msg.url,
        headers: {
          Accept: "audio/amr"
        }
      }
      options.onFileDownloadComplete = function(response) {
        //音频下载成功，需要将response转换成blob，使用objectURL作为audio标签的src即可播放。
        var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response)
        console.log("转译之后", objectURL)
        someFun.otherMsg(msg, objectURL)
      }

      options.onFileDownloadError = function() {
        //音频下载失败
        console.log("失败")
      }
      //通知服务器将音频转为mp3
      WebIM.utils.download.call(conn, options)
      console.log(options)
    }
  }, //收到音频消息
  onLocationMessage: function() {}, //收到位置消息
  onFileMessage: function(msg) {
    console.log(">>>>>收到文件消息", msg)
    someFun.otherMsg(msg)
  }, //收到文件消息
  onCustomMessage: function(msg) {
    console.log("收到自定义消息", msg)
    someFun.otherMsg(msg)
  }, //收到自定义消息
  onVideoMessage: function(message) {
    var node = document.getElementById("privateVideo")
    var option = {
      url: message.url,
      headers: {
        Accept: "audio/mp4"
      },
      onFileDownloadComplete: function(response) {
        var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response)
        node.src = objectURL
      },
      onFileDownloadError: function() {
        console.log("File down load error.")
      }
    }
    WebIM.utils.download.call(conn, option)
  }, //收到视频消息
  onPresence: function(msg) {
    console.log('>>>>>>触发onPresence',msg);
  }, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
  onRoster: function() {}, //处理好友申请
  onInviteMessage: function() {}, //处理群组邀请
  onOnline: function() {
    console.log("本机连接成功~")
  }, //本机网络连接成功
  onOffline: function() {
    console.log("本机网络掉线~")
  }, //本机网络掉线
  onError: function(message) {
    console.log(">>>>onError", message)
  }, //失败回调
  onBlacklistUpdate: function (list) { //黑名单变动
    
      // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
      console.log(list);
  },
  onRecallMessage: function(message) {
    console.log(">>>>收到消息撤回的回调", message)
  }, //收到撤回消息回调
  onReceivedMessage: function(message) {
    // console.log(">>>>消息送达服务器回执", message);
  }, //收到消息送达服务器回执
  // onDeliveredMessage: function (message) {}, //收到消息送达客户端回执
  onReadMessage: function(message) {
    // console.log(">>>>收到已读回执", message);
  }, //收到消息已读回执
  onCreateGroup: function() {}, //创建群组成功回执（需调用createGroupNew）
  onMutedMessage: function() {} //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
})

export default WebIM
