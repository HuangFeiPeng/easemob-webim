import WebIM from "@/utils/WebIM.js"
// import Storage from '../utils/storage'
// const loginInfo = Storage.getstorage("userInfo")
const conn = WebIM.conn
//该方法用来预处理过来的content组建key
function msgGroup(state, chatType, data) {
  var tb = state
  var content = data.msgContent
  var myID = conn.user
  var l,
    r = ""
  if (chatType === "singleChat") {
    if (myID == content.from) {
      l = content.from
      r = content.to
      content.right = true
    } else {
      l = content.to
      r = content.from
      content.right = false
    }
  } else if (chatType === "groupChat" || chatType === "chatRoom") {
    if (myID == content.from) {
      l = content.from
      r = content.to
      content.right = true
    } else {
      l = myID
      r = content.to
      content.right = false
    }
  }
  var key = `${l}-${r}`
  var msgColls = tb[key]
  if (!msgColls) {
    msgColls = []
    tb[key] = msgColls
  }
  msgColls.push(content)
  return tb
}
//处理添加消息到nowList（消息分发）
// TO DO 目前存在单聊消息如果正在聊天，受到群聊或者聊天室会清空当前的会话列表问题。
// function addNowMsg(chatMsgs, chatType, data) {
//     console.log('>>>>>>>>>>', chatMsgs, chatType, data);
//     //他人环信ID
//     let overId = ''
//     let nowMsg = []
//     //处理是否为发送方，如果是取to，不是则取from
//     data.right ? overId = data.to : overId = data.from;
//     //取当前的选中的目标ID
//     let nowId = window.Vue.$store.state.chatStore.userInfo.userId
//     //拼接key
//     let fromKey = `${conn.user}-${overId}`
//     let nowKey = `${conn.user}-${nowId}`
//     //循环穿过来的消息对象
//     for (const key in chatMsgs[chatType]) {
//         if (Object.hasOwnProperty.call(chatMsgs[chatType], key)) {
//             const element = chatMsgs[chatType][key];
//             console.log('>>>>>>ele', element);
//             if (chatType === 'singleChat') {
//                 //如果是单聊则进入=》判断消息来源是不是当前选中ID或发送目标是不是当前选中ID=》判断该消息的分类key是不是当前key值下的消息=》条件满足赋值
//                 if (data.from == nowId || data.to == nowId) {
//                     if (key === fromKey) {
//                         return nowMsg = element
//                     }
//                 } else {
//                     // console.log('>>>>>>>不是当前选人能给ID',chatMsgs[aa],);
//                     return nowMsg = chatMsgs[chatType][nowKey]
//                 }
//             } else if (chatType === 'groupChat' || chatType === 'chatRoom') {
//                 //如果是聊天室或群组则进入=》判断消息来源是不是当前选中ID或发送目标是不是当前选中ID=》判断该消息的分类key是不是当前key值下的消息=》条件满足赋值
//                 //由于群组聊天室to字段永远是聊天室或者是群组ID，所以重新拼接key
//                 var toKey = `${conn.user}-${data.to}`
//                 console.log('成功触发过来的消息');
//                 if (data.to == nowId) {
//                     console.log('>>>>>没错是当前选中的群或者聊天室');
//                     if (key === toKey) {
//                         return nowMsg = element
//                     }
//                 } else {
//                     console.log(1111);
//                 }
//             }
//         }
//     }
//     // console.log('>>>>>>即将抛出的', nowMsg);
//     // return nowMsg
// }
//处理添加消息到nowList（消息分发），上面注释的是以前的，现在看写的是什么鬼？
function addNowMsg(data) {
  //存放他人ID
  let otherId = ""
  //处理如果是自己发送的消息otherID就为data.to，否则的话就是data.from。
  data.right ? (otherId = data.to) : (otherId = data.from)
  //存放选中的当前人ID
  let pickNowHxId = window.Vue.$store.state.chatStore.userInfo
  //如果要提交的消息type为单聊类型，并且otherId为当前选中的ID那么就把该条消息retun，否则就retun为未读消息。
  if (data.chatType === "singleChat") {
    if (otherId == pickNowHxId.userId) {
      return `${conn.user}-${otherId}`
    }
  }
  if (data.chatType === "groupChat" || data.chatType === "chatRoom") {
    if (data.to == pickNowHxId.userId) {
      return `${conn.user}-${data.to}`
    }
  }
}

//处理新加消息更新会话列表
//此处设计思路为，如果该条消息在会话中有那么就更改lastMsg，如果没有的话那么就再新增一个会话列表到conversationList里。
function addConversationList(data) {
  //拿到当前的会话列表数组
  const nowConversationList = window.Vue.$store.state.chatStore.conversationList;
  let converKey = ""; //存放新消息id用作后期新会话的key
  let nowConverKey = [] //存放所有已有会话列表所有的key
  if (data.chatType === "singleChat") {
    data.right ? (converKey = data.to) : (converKey = data.from)
  } else {
    console.log('>>>>>>进入了群聊');
    converKey = data.to
  }
  //循环当前已有会话列表，并将其key push 进nowConverKey
  nowConversationList && nowConversationList.forEach((item, index) => {
    // item.key === converKey && console.log('>>>>>会话列表里有');
     nowConverKey.push(item.key)
  })
  //为了获取converKey 在数组中的下标
  let _index = nowConverKey && nowConverKey.findIndex((value)=> value == converKey);
  console.log(_index);
  //判断新消息的key是否存在于已有的会话list中
  if (nowConverKey.includes(converKey)) {
    console.log('>>>>更新lastMsg');
    data.converKey = converKey;
    window.Vue.$store.commit('updataConversation',data);
    if (_index !==-1 && _index !== 0) {
      console.log('>>>>>>执行更新lastMsg切置顶');
      window.Vue.$store.dispatch('setTopConversationList', { conver_index:_index})
    }
  } else {
    data.converKey = converKey;
    console.log('>>>>>添加一个新的会话列表',window.Vue);
    window.Vue.$store.commit('loadConversation', data)
    if (_index !==-1 && _index !== 0) {
      console.log('>>>>>>执行更新lastMsg切置顶');
      window.Vue.$store.dispatch('setTopConversationList', { conver_index:_index})
    }
  }
  // console.log('>>>>新消息的key是否存在于会话列表中',); 
  // console.log('>>>>>>>>>>>>nowConverdationList',converKey,nowConverKey);
}

const msgContent = {
  state: {
    //所有在线收发消息的存储
    msgList: {
      singleChat: {},
      groupChat: {},
      chatRoom: {}
    },
    //存放当前联系人的消息
    nowMsgList: []
  },
  mutations: {
    //向消息List当中添加一条new消息
    addNewMessage: (state, payload) => {
      const {
        data,
        chatType
      } = payload
      switch (chatType) {
        case "singleChat":
          state.msgList[chatType] = msgGroup(
            state.msgList[chatType],
            chatType,
            data
          )
          addConversationList(data.msgContent)
          var result = addNowMsg(data.msgContent)
          // if (result.isRead != true) {
          //   console.log('>>>>拿到',state);
          //   let getNowMsgs = state.msgList[chatType][result];
          //   console.log('>>>>>>getNowMsgs',getNowMsgs);
          //   // state.nowMsgList.push(result)
          if (result) {
            var getNowMsgs = state.msgList[chatType][result];
            state.nowMsgList = getNowMsgs;
            console.log('>>>>>>getNowMsgs', getNowMsgs);
          }
          break
        case "groupChat":
          state.msgList[chatType] = msgGroup(
            state.msgList[chatType],
            chatType,
            data
          )
          addConversationList(data.msgContent)
          var resultGroup = addNowMsg(data.msgContent)
          if (resultGroup) {
            var getNowGroupMsgList = state.msgList[chatType][resultGroup];
            state.nowMsgList = getNowGroupMsgList
          }
          break
        case "chatRoom":
          state.msgList[chatType] = msgGroup(
            state.msgList[chatType],
            chatType,
            data
          )
          var resultChatRoom = addNowMsg(data.msgContent)
          var getNoWRoomMsgList = state.msgList[chatType][resultChatRoom];
          state.nowMsgList = getNoWRoomMsgList
          break
        default:
          break
      }
    },
    //将获取到的当前联系人的消息往来添加进nowMsgList
    addNowMessage: (state, payload) => {
      console.log('>>>>>触发添加nowMsgList', payload);
      state.nowMsgList = payload
      // state.nowMsgList.push(payload);
    }
  },
  actions: {
    //获取当前联系人的聊天消息
    getNowMsg: (context, step) => {
      const {
        myID,
        overID,
        type
      } = step
      if (myID && overID !== "") {
        var key = `${myID}-${overID}`
        console.log(key)
        var msgBody = context.state.msgList[type][key] || []
        if (msgBody.length != 0) {
          console.log('>>>>提交');
          context.commit("addNowMessage", msgBody)
        } else {
          context.commit('addNowMessage', [])
        }

      }
    },
    //发送一条文本消息
    sendTextMsg: (context, step) => {
      console.log(context, step)
      //构建基本消息存储备份
      const msgContent = {
        contentsType: step.contentsType,
        chatType: step.type,
        msgData: step.msg,
        ext: {},
        from: conn.user,
        to: step.to,
        time: new Date().getTime(),
        right: false
      }
      let id = conn.getUniqueId() // 生成本地消息id
      let msg = new WebIM.message("txt", id) // 创建文本消息
      msg.set({
        msg: step.msg, // 消息内容
        to: step.to, // 接收消息对象（用户id）
        chatType: step.type,
        ext: {
          nickname: "张三"
        }, //扩展消息
        success: function (id, serverMsgId) {
          console.log("send private text Success", id, serverMsgId)
          context.commit("addNewMessage", {
            data: {
              msgContent,
              serverMsgId
            },
            chatType: step.type
          })
        }, // 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
        fail: function (e) {
          console.log("Send private text error", e)
        } // 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
      })
      // if (step.type === 'groupChat') {
      // msg.body.msgConfig = {
      //     allowGroupAck: true
      // }
      // }

      conn.send(msg.body)
    },
    //发送一条自定义消息
    sendCustomMsg: (context, step) => {
      const msgContent = {
        contentsType: step.contentsType,
        chatType: step.type,
        ext: {},
        from: conn.user,
        to: step.to,
        time: new Date().getTime(),
        right: false
      }
      var id = conn.getUniqueId() // 生成本地消息id
      var msg = new WebIM.message("custom", id) // 创建自定义消息
      var customEvent = "confrInfo" // 创建自定义事件
      var customExts = {
        confrID: "1216464564564646",
        password: "123456"
      } // 消息内容，key/value 需要 string 类型
      msg.set({
        to: step.to, // 接收消息对象（用户id）
        customEvent,
        customExts,
        chatType: step.type,
        ext: {}, // 消息扩展
        success: function (id, serverMsgId) {
          context.commit("addNewMessage", {
            data: {
              msgContent,
              serverMsgId
            },
            chatType: step.type
          })
        },
        fail: function (e) {
          console.log(">>>自定义消息发送失败", e)
        }
      })
      conn.send(msg.body)
    },
    //发送图片消息
    sendImageMsg: (context, step) => {
      console.log(">>>发送图片接收", step)
      const {
        imgId,
        to,
        type,
        contentsType,
        Dom
        // fileInfo
      } = step
      var imgeName = Dom.value.split("\\")[2] // “\”是转义 所以要截取单斜杠 为\\

      var msgUrl
      var id = conn.getUniqueId() // 生成本地消息id
      var msg = new WebIM.message("img", id) // 创建图片消息
      var file = WebIM.utils.getFileUrl(Dom) // 将图片转化为二进制文件
      var allowType = {
        jpg: true,
        jpeg: true,
        gif: true,
        png: true,
        bmp: true
      }
      if (file.filetype.toLowerCase() in allowType) {
        var option = {
          file: file,
          // length: '3000', // 视频文件时，单位(ms)
          ext: {
            file_length: file.data.size // 文件大小
          },
          to: to, // 接收消息对象
          chatType: type, // 聊天类型
          onFileUploadError: function (e) {
            // 消息上传失败
            console.log("onFileUploadError", e)
          },
          onFileUploadComplete: function (res) {
            // 消息上传成功
            console.log("onFileUploadComplete", res)
            console.log(res);
            var imgUrl = `${res.uri}/${res.entities[0].uuid}` //拼接图片URL
            return (msgUrl = imgUrl)
          },
          success: function (id, serverMsgId) {
            // 消息发送成功
            console.log("Success", serverMsgId)
            const msgContent = {
              contentsType: contentsType,
              chatType: type,
              msgData: {
                fileLength: "msg.file_length",
                fileType: "msg.filetype",
                fileName: imgeName,
                secret: "msg.secret",
                imgUrl: msgUrl,
                width: "msg.width",
                height: "msg.height"
              },
              ext: msg.ext,
              from: conn.user,
              to: to,
              time: new Date().getTime(),
              right: false
            }
            context.commit("addNewMessage", {
              data: {
                msgContent,
                serverMsgId
              },
              chatType: type
            })

            // console.log('>>>>>>',msgData);
          },
          fail: function (e) {
            console.log("Fail", e) //如禁言、拉黑后发送消息会失败
          },
          flashUpload: WebIM.flashUpload
        }
        msg.set(option)
        conn.send(msg.body)
      }
    },
    //发送文件消息
    sendFilesMsg: (context, step) => {
      // console.log('>>>>文件消息', context, step);
      const {
        to,
        type,
        contentsType,
        Dom,
        fileInfo
      } = step
      // var fileName = Dom.value.split('\\')[2] // “\”是转义 所以要截取单斜杠 为\\
      var fileName = fileInfo.name // “\”是转义 所以要截取单斜杠 为\\
      console.log(">>>>>拿到文件的信息", fileInfo)
      var msgUrl
      var id = conn.getUniqueId() // 生成本地消息id
      var msg = new WebIM.message("file", id) // 创建文件消息
      // var input = document.getElementById(fileId); // 选择文件的input
      var file = WebIM.utils.getFileUrl(Dom) // 将文件转化为二进制文件
      var allowType = {
        jpg: true,
        gif: true,
        png: true,
        bmp: true,
        zip: true,
        txt: true,
        doc: true,
        pdf: true,
        mp4: true,
        json: true,
        mov: true,
        pptx: true,
        js: true
      }
      if (file.filetype.toLowerCase() in allowType) {
        var option = {
          file: file,
          to: to, // 接收消息对象
          chatType: type, // 设置聊天类型
          onFileUploadError: function () {
            // 消息上传失败
            console.log("onFileUploadError")
          },
          onFileUploadComplete: function (res) {
            // 消息上传成功
            console.log(">>>>>文件上传成功", res)
            var fileUrl = `${res.uri}/${res.entities[0].uuid}` //拼接URL
            return (msgUrl = fileUrl)
          },
          success: function (id, serverMsgId) {
            // 消息发送成功
            console.log("Success")
            const msgContent = {
              contentsType: contentsType,
              chatType: type,
              msgData: {
                fileLength: fileInfo.size,
                fileType: "msg.filetype",
                fileName: fileName,
                secret: "msg.secret",
                fileUrl: msgUrl,
                width: "msg.width",
                height: "msg.height"
              },
              ext: msg.ext,
              from: conn.user,
              to: to,
              time: new Date().getTime(),
              right: false
            }
            context.commit("addNewMessage", {
              data: {
                msgContent,
                serverMsgId
              },
              chatType: type
            })
            Dom.value = null
          },
          fail: function (e) {
            console.log("Fail") //如禁言、拉黑后发送消息会失败
          },
          flashUpload: WebIM.flashUpload,
          ext: {
            file_length: file.data.size
          }
        }
        msg.set(option)
        conn.send(msg.body)
      }
    },
    //发送音频消息
    sendAudioMsg: (context, step) => {
      const {
        to,
        type,
        contentsType,
        file
      } = step
      var msgUrl
      console.log(">>>>>>>接收到传入store的音频", step)
      let id = conn.getUniqueId() // 生成本地消息id
      let msg = new WebIM.message("audio", id) // 创建音频消息
      var option = {
        file: file,
        length: file.voiceTime, // 音频文件时长，单位(s)
        to: to, // 接收消息对象
        chatType: type, // 设置单聊
        onFileUploadError: function () {
          // 消息上传失败
          console.log("onFileUploadError")
        },
        onFileUploadComplete: function (res) {
          // 消息上传成功
          console.log("onFileUploadComplete", res)
          var fileUrl = `${res.uri}/${res.entities[0].uuid}` //拼接URL
          //将上传到环信服务器的文件地址转为MP3的blob保存到本地。
          // console.log('>>>>>get到地址',blobUrl);
          return (msgUrl = fileUrl)
        },
        success: function (id, serverMsgId) {
          // 消息发送成功
          console.log("Success")
          const msgContent = {
            contentsType: contentsType,
            chatType: type,
            msgData: {
              fileLength: file.data.size,
              fileType: file.data.type,
              secret: "msg.secret",
              fileUrl: msgUrl,
              blob: file.url,
              length: file.voiceTime
            },
            ext: msg.ext,
            from: conn.user,
            to: to,
            time: new Date().getTime(),
            right: false
          }
          context.commit("addNewMessage", {
            data: {
              msgContent,
              serverMsgId
            },
            chatType: type
          })
        },
        fail: function (e) {
          console.log("Fail", e) //如禁言、拉黑后发送消息会失败
        },
        flashUpload: WebIM.flashUpload,
        ext: {
          file_length: file.data.size
        }
      }
      msg.set(option)
      conn.send(msg.body)
    }
  },
  getters: {
    onGetMsgList: state => {
      return state.nowMsgList
    }
  }
}

export default msgContent