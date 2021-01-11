import WebIM from "@/utils/WebIM.js"
const chatStore = {
    state: {
      //列表分类
      aboutList: {
        friendsList: [],
        groupsList: [],
        chatroomsList: []
      },
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
      loadList: function (state, playload) {
        const {
          data,
          type
        } = playload
        state.aboutList[type] = data
      },
      //设置选中ID的基本信息
      chatName: (state, playload) => {
        const {
          chatID,
          chatName,
          type
        } = playload
        state.userInfo.userId = chatID
        state.userInfo.userName = chatName
        state.userInfo.type = state.msgType[type]
      },
      //初始化userInfo
      initUserInfo: (state, playload) => {
        let nullUserInfo = {
          userId: "",
          userName: "",
          type: ""
        }
        state.userInfo = Object.assign({}, nullUserInfo)
      },
      //添加黑名单
      loadBlackList: (state, playload) => {
        const data = playload;
        console.log('>>>>>黑名单加载', playload);
        data.forEach(item => {
          // console.log(element);
          if (item != '') {
            state.blackFriendList.push(item||[]);
          }
        });
        
      }
    },
    actions: {
      //调用获取黑名单列表
      getUserBlackList: context => {
        WebIM.conn.getBlacklist().then((res)=>{
          console.log('>>>>>>获取黑名单成功',res);
          context.commit('loadBlackList',res.data)
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
          roster.filter(item=>{
            if (blackList && !blackList.includes(item.name)) {
              // console.log(item);
              return arr.push(item)
            }
            // console.log(item.name);
          })
          console.log(arr);
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
    onGetBlackUserList: state =>{
      return state.blackFriendList
    }
  }
}

export default chatStore