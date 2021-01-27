import WebIM from "@/utils/WebIM.js"

function getUserId(str) {
  // console.log('name', str)
  if (typeof str !== 'string') return '';
  return (str.match(/ceshi_(\S*)@|ceshi_(\S*)/)[1] || str.match(/ceshi_(\S*)@|ceshi_(\S*)/)[2])
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
        let {channel_id,meta,unread_num} = payload;
        let chatType = id =>{
          let idType =id.split("@")
          return idType[1] && idType[1]==="easemob.com" ? "singleChat" : "groupChat";
        }
        let {bodies,ext,from,to} = JSON.parse(meta.payload) //payload的数据转为对象并解构
        let getId = channel_id && getUserId(channel_id); //通过截取拿到id
        // console.log(getId);
        let converBody = {
          id:getId,
          unReadNum: unread_num,
          lastMsg:{
            from: getUserId(meta.from),
            id:meta.id,
            msgBody:{
              data:bodies[0],
              ext:ext,
              from: from,
              to:to,
              type: chatType(channel_id)
            },
            timestamp:meta.timestamp,
            to:getUserId(meta.to)
          }
        }
        state.conversationList.push(converBody)
        console.log('>>>>>>>>>处理完的会话列表',state.conversationList[0].id);
      }
      
      // console.log(getId);
      

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
        console.log('>>>>>>拿到会话列表', res.data.channel_infos);
        let allChannel_infos = res.data.channel_infos;
        allChannel_infos && allChannel_infos.forEach(item =>{
          item.isChannel = true; //标明是通过会话列表拿到的消息
          item && context.commit('loadConversation',item)
        })
        
        // res.data && context.commit('loadConversation',res.data.channel_infos);
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
    }
  }
}

export default chatStore