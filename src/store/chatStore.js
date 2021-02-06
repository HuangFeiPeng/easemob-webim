import WebIM from "@/utils/WebIM.js"
//该function为功能为将会话列表的ID截取出来。
function getUserId(str) {
  // console.log('name', str)
  if (typeof str !== 'string') return '';
  return (str.match(/ceshi_(\S*)@|ceshi_(\S*)/)[1] || str.match(/ceshi_(\S*)@|ceshi_(\S*)/)[2])
  // return (str.match(/ceshi_(\S*)@|chatdemoui(\S*)/)[1] || str.match(/chatdemoui_(\S*)@|chatdemoui_(\S*)/)[2])
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
    //加载列表
    loadList: function (state, payload) {
      const {
        data,
        type
      } = payload
      state.aboutList[type] = data
    },
    //加载会话列表
    loadConversation: (state, payload) => {
      // console.log(payload);
      if (payload.isChannel) { //如果是通过会话列表接口拉取的数据进入
        let {
          channel_id,
          meta,
          unread_num
        } = payload;
        let {
          bodies,
          ext,
          from,
          to
        } = JSON.parse(meta.payload) //payload的数据转为对象并解构
        let getId = channel_id && getUserId(channel_id); //通过截取拿到id
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
            let groupsList = state.aboutList.groupsList;
            groupsList && groupsList.forEach((item) => {
              //查询当前群组列表里面的id，如果getId存在于则为群组，否则则是聊天室（聊天室的话type,groupName都设为了""字符串
              if (item.groupid === getId) {
                return typeInfo = {
                  type: "groupChat",
                  groupName: item.groupname
                }
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
        //这一步操作是为了只处理单人以及群组类型的会话上屏显示
        if (chatType(channel_id).type) {
          state.conversationList.push({
            key: getId,
            converBody
          })
        }

      } else {
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
          "TEXT": "txt"
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
          chatType: {
            groupName: "",
            type: chatType
          }

        }
        state.conversationList.push({
          key: converKey,
          converBody
        })
        console.log(payload);
      }
      // console.log(getId);

    },
    //更新会话列表
    updataConversation: (state,payload)=>{
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
    console.log(payload);
    let toBeUpdate = {};
    let changeMsgTyepe = {
      "TEXT": "txt"
    }
    let newLastMsg = {
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
      state.conversationList.forEach(item=>{
        console.log('>>>>>>更新会话列表',item);
        if (item.key === converKey && item.converBody.chatType.type === chatType) {
          return toBeUpdate = item;
        }
      })
      // console.log('>>>>>>>toBeUpdate',toBeUpdate);
       toBeUpdate.converBody.lastMsg = newLastMsg;
      // console.log(toBeUpdate);

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
      const data = payload;
      console.log('>>>>>黑名单加载', payload);
      data && data.forEach(item => {
        // console.log(element);
        if (item != '') {
          state.blackFriendList.push(item || []);
        }
      });

    }
  },
  actions: {
    //获取会话列表数据
    getConversationList: context => {
      WebIM.conn.getSessionList().then((res) => {
        // console.log('>>>>>>拿到会话列表', res.data.channel_infos);
        let allChannel_infos = res.data.channel_infos;
        allChannel_infos && allChannel_infos.forEach(item => {
          item.isChannel = true; //标明是通过会话列表拿到的消息
          item && context.commit('loadConversation', item)
        })

        // res.data && context.commit('loadConversation',res.data.channel_infos);
      })
    },
    //置顶选中的会话列表
    setTopConversationList: (context, step) => {
      //获取当前的state中存放的会话列表
      let nowConverList = context.state.conversationList;
      //拿到splice返回的数组目标
      let delConver = nowConverList.splice(step.conver_index, 1)
      //将删除的目标ID提交给mutations
      context.commit("topConversation", {
        delConver
      })
    },
    //调用获取黑名单列表
    getUserBlackList: context => {
      WebIM.conn.getBlacklist().then((res) => {
        // console.log('>>>>>>获取黑名单成功',res);
        context.commit('loadBlackList', res.data)
      })
      // console.log(res);
    },
    //调用拉取好友列表SDK
    getFriendsList: context => {
      let blackList = context.state.blackFriendList;

      // console.log(blackList);
      // console.log('>>>>>拿到黑名单列表',context.state.blackFriendList);
      WebIM.conn.getRoster({
        success: roster => {
          let arr = []
          roster.filter(item => {
            if (blackList && !blackList.includes(item.name)) {
              // console.log(item);
              return arr.push(item)
            }
            // console.log(item.name);
          })
          // console.log(arr);
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