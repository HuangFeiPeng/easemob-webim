import WebIM from "@/utils/WebIM.js"
import {
  CheckboxGroup
} from "element-ui"
//该函数的功能为，将会话列表的channel_id截取出环信。
function getUserId(str) {
  // console.log('name', str)
  if (typeof str !== "string") return ""
  return (
    str.match(/ceshi_(\S*)@|ceshi_(\S*)/)[1] ||
    str.match(/ceshi_(\S*)@|ceshi_(\S*)/)[2]
  )
  // return (str.match(/chatdemoui(\S*)@|chatdemoui(\S*)/)[1] || str.match(/chatdemoui_(\S*)@|chatdemoui_(\S*)/)[2])
}
const chatStore = {
  state: {
    //列表分类
    aboutList: {
      friendsList: [],
      groupsList: [],
      chatroomsList: []
    },
    //会话列表
    user_Channel_Status: null, //该字段为用来存储会话列表接口是否在首次登陆被调用
    conversationList: [],
    //黑名单列表
    blackFriendList: [],
    //userID包含个人ID 群组ID 以及聊天室ID userName包含的只有群组name 以及 聊天室name
    userInfo: {
      userId: "",
      userName: "",
      type: ""
    },
    msgType: {
      0: "singleChat",
      1: "groupChat",
      2: "chatRoom"
    }
  },
  mutations: {
    //加载好友群组聊天室列表
    loadList: function (state, payload) {
      const {
        data,
        type
      } = payload
      state.aboutList[type] = data
    },
    //加载会话列表
    loadConversation: (state, payload) => {
      console.log('>>>>>>触发push会话列表');
      if (payload.isChannel) {
        //如果是通过会话列表接口拉取的数据进入
        const {
          channel_id,
          meta,
          unread_num
        } = payload
        let {
          bodies,
          ext,
          from,
          to
        } = JSON.parse(meta.payload) //payload的数据转为对象并解构
        let getId = channel_id && getUserId(channel_id) //通过截取拿到id
        //将channel_id 截取判断其会话类型是单聊还是群聊 或为 聊天室
        let chatType = id => {
          let idType = id.split("@")
          let typeInfo = {
            type: "",
            groupName: ""
          }
          if (idType[1] === "easemob.com") {
            typeInfo.type = "singleChat"
          } else {
            let groupsList = state.aboutList.groupsList
            groupsList &&
              groupsList.forEach(item => {
                //查询当前群组列表里面的id，如果getId存在于则为群组，否则则是聊天室（聊天室的话type,groupName都设为了""字符串
                if (item.groupid === getId) {
                  return (typeInfo = {
                    type: "groupChat",
                    groupName: item.groupname
                  })
                }
              })
          }
          return typeInfo
        }
        //会话消息构建的body体
        let converBody = {
          id: getId,
          unReadNum: unread_num,
          lastMsg: {
            from: getUserId(meta.from),
            id: meta.id,
            msgBody: {
              data: bodies[0],
              ext: ext,
              from: from,
              to: to
            },
            timestamp: meta.timestamp,
            to: getUserId(meta.to)
          },
          chatType: chatType(channel_id),
          isChannel: true //是否是从会话列表拉取出来的
        }
        //这一步操作是为了只处理单人以及群组类型的会话上屏显示，因为如果为聊天室的话，chatType(channel_id).type的值为“”
        chatType(channel_id).type && state.conversationList.push({
          key: getId,
          converBody
        })
      } else if (state.user_Channel_Status == true) {   
        const {
          converKey,
          from,
          msgData,
          contentsType,
          ext,
          to,
          time,
          chatType
        } = payload
        //会话消息构建的body体
        let changeMsgTyepe = {
          TEXT: "txt",
          IMAGE: "img",
          FILE: "file",
          VOICE: "audio"
        }
        let changeGroupName = chatType => {
          console.log('>>>>>>>>>>>>>>>_____', chatType);
          let typeInfo = {
            type: "",
            groupName: ""
          }
          if (chatType === "singleChat") {
            typeInfo.type = "singleChat"
          } else {
            let groupsList = state.aboutList.groupsList
            groupsList &&
              groupsList.forEach(item => {
                if (converKey ===item.groupid) {
                  return (typeInfo = {
                    type: "groupChat",
                    groupName: item.groupname
                  })
                }
              })
          }
          return typeInfo
        }
        let converBody = {
          id: converKey,
          unReadNum: 0,
          lastMsg: {
            from: from,
            id: converKey,
            msgBody: {
              data: {
                msg: msgData,
                type: changeMsgTyepe[contentsType]
              },
              ext: ext,
              from: from,
              to: to
            },
            timestamp: time,
            to: to
          },
          chatType: changeGroupName(chatType)
        }

        state.conversationList.push({
          key: converKey,
          converBody
        })

      }
    },
    //更新会话列表（聊天页新增消息时，保证会话列表里的lastMsg可以同步更新。）
    updataConversation: (state, payload) => {
      const {
        converKey,
        from,
        msgData,
        contentsType,
        ext,
        to,
        time,
        chatType
      } = payload
      let toBeUpdate = {} //待更新的某条会话
      let changeMsgTyepe = {
        TEXT: "txt",
        IMAGE: "img",
        FILE: "file",
        VOICE: "audio"
      }
      let newLastMsg = { //设立newLastMsg的结构
        from: from,
        id: converKey,
        msgBody: {
          data: {
            msg: msgData,
            type: changeMsgTyepe[contentsType]
          },
          ext: ext,
          from: from,
          to: to
        },
        timestamp: time,
        to: to
      }
      state.conversationList &&
        state.conversationList.forEach(item => {
          if (
            item.key === converKey &&
            item.converBody.chatType.type === chatType
          ) {
            return (toBeUpdate = item)
          }
        })
      toBeUpdate.converBody.lastMsg = newLastMsg
    },
    //修改会话接口是否调用状态
    changeUserChannelStatus: (state, payload) => {
      console.log('>>>>>>会话列表接口状态发生修改');
      state.user_Channel_Status = true;
    },
    //置顶选中会话
    topConversation: (state, payload) => {
      const {
        delConver
      } = payload
      //将拿到的delConver添加至当前的会话数组的首位，以完成置顶操作
      state.conversationList.unshift(delConver[0])
    },
    //初始化会话列表
    inItConversation: (state, payload) => {
      state.conversationList = []
    },
    //设置选中ID的基本信息
    chatName: (state, payload) => {
      const {
        chatID,
        chatName,
        type
      } = payload

      state.userInfo.userId = chatID
      state.userInfo.userName = chatName
      state.userInfo.type = state.msgType[type]
    },
    //初始化userInfo
    initUserInfo: (state, payload) => {
      let nullUserInfo = {
        userId: "",
        userName: "",
        type: ""
      }
      state.userInfo = Object.assign({}, nullUserInfo)
    },
    //添加黑名单
    loadBlackList: (state, payload) => {
      const data = payload
      data &&
        data.forEach(item => {
          // console.log(element);
          if (item != "") {
            state.blackFriendList.push(item || [])
          }
        })
    }
  },
  actions: {
    //获取会话列表数据
    getConversationList: context => {
      WebIM.conn.getSessionList().then(res => {
        //会话列表接口拉取成功，执行修改会话列表是否拉取的状态为true
        context.commit("changeUserChannelStatus");
        let allChannel_infos = res.data.channel_infos;
        allChannel_infos &&
          allChannel_infos.forEach(item => {
            item.isChannel = true //表明是通过会话列表拿到的消息
            item && context.commit("loadConversation", item)
          })

      }).catch(err=>{
        console.log('>>>>会话列表接口调用失败',err);
        context.commit("changeUserChannelStatus");
      })
    },
    //置顶选中的会话列表
    setTopConversationList: (context, step) => {
      //获取当前的state中存放的会话列表
      let nowConverList = context.state.conversationList
      //拿到splice返回的数组目标
      let delConver = nowConverList.splice(step.conver_index, 1)
      //将删除的目标ID提交给mutations
      context.commit("topConversation", {
        delConver
      })
    },
    //调用获取黑名单列表
    getUserBlackList: context => {
      WebIM.conn.getBlacklist().then(res => {
        // console.log('>>>>>>获取黑名单成功',res);
        context.commit("loadBlackList", res.data)
      })
      // console.log(res);
    },
    //调用拉取好友列表SDK
    getFriendsList: context => {
      let blackList = context.state.blackFriendList; //获取黑名单列表
      WebIM.conn.getRoster({
        success: roster => {
          let arr = []
          roster.filter(item => {
            if (blackList && !blackList.includes(item.name)) {
              return arr.push(item)
            }
          })
          context.commit("loadList", {
            type: "friendsList",
            data: arr
          })
        }
      })
    },
    //调用拉取群组列表SDK
    getGroupsList: context => {
      WebIM.conn.getGroup({
        success: roster => {
          let data = roster.data
          context.commit("loadList", {
            type: "groupsList",
            data: data
          })
        }
      })
    },
    //调用拉取聊天室SDK
    getChatroomsList: context => {
      WebIM.conn.getChatRooms({
        apiUrl: WebIM.config.restServer,
        pagenum: 1, // 页数
        pagesize: 20, // 每页个数
        success: function (list) {
          let data = list.data
          context.commit("loadList", {
            type: "chatroomsList",
            data: data
          })
        },
        error: function () {
          console.log("List chat room error")
        }
      })
    },
    //点击列表把对应的name ID存入
    getUserName: (context, strep) => {
      context.commit("chatName", strep)
    },
    //调用加入聊天室
    joinChatroom: (context, step) => {
      console.log(step)
      let options = {
        roomId: step.chatID // 聊天室id
        // message: 'reason'   // 原因（可选参数）
      }
      WebIM.conn.joinChatRoom(options).then(res => {
        console.log(">>>>加入成功", res)
      })
    }
  },
  getters: {
    onGetFriendsList: state => {
      return state.aboutList.friendsList
    },
    onGetGroupList: state => {
      return state.aboutList.groupsList
    },
    onGetChatRoomsList: state => {
      return state.aboutList.chatroomsList
    },
    onGetBlackUserList: state => {
      return state.blackFriendList
    },
    onGetConversationList: state => {
      return state.conversationList
    }
  }
}

export default chatStore