import WebIM from '@/utils/WebIM.js'
const chatStore = {
    state: {
        //列表分类
        aboutList: {
            friendsList: [],
            groupsList: [],
            chatroomsList: []
        },
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
        },
    },
    mutations: {
        //加载列表
        loadList: function (state, playload) {
            const {
                data,
                type
            } = playload;
            state.aboutList[type] = data;
        },
        chatName: (state, playload) => {
            const {
                chatID,
                chatName,
                type
            } = playload
            state.userInfo.userId = chatID
            state.userInfo.userName = chatName
            state.userInfo.type = state.msgType[type]
        }
    },
    actions: {
        //调用拉取好友列表SDK
        getFriendsList: (context) => {
            WebIM.conn.getRoster({
                success: (roster) => {
                    context.commit('loadList', {
                        type: 'friendsList',
                        data: roster
                    })
                },
            });
        },
        //调用拉取群组列表SDK
        getGroupsList: (context) => {
            WebIM.conn.getGroup({
                success: (roster) => {
                    let data = roster.data;
                    context.commit('loadList', {
                        type: 'groupsList',
                        data: data
                    })
                }
            })
        },
        //调用拉取聊天室SDK
        getChatroomsList: (context) => {
            WebIM.conn.getChatRooms({
                apiUrl: WebIM.config.restServer,
                pagenum: 1, // 页数
                pagesize: 20, // 每页个数
                success: function (list) {
                    let data = list.data;
                    context.commit('loadList', {
                        type: 'chatroomsList',
                        data: data
                    })
                },
                error: function () {
                    console.log("List chat room error");
                },
            })
        },
        //点击列表把对应的name ID存入
        getUserName: (context, strep) => {
            context.commit('chatName', strep)
        },
        //调用加入聊天室
        joinChatroom: (context,step)=>{
            console.log(step);
            let options = {
                roomId: step.chatID,   // 聊天室id
                // message: 'reason'   // 原因（可选参数）
            }
            WebIM.conn.joinChatRoom(options).then((res) => {
                console.log('>>>>加入成功',res)
            })
        }
    },
    getters: {
        onGetFriendsList: (state) => {
            return state.aboutList.friendsList;
        },
        onGetGroupList: (state) => {
            return state.aboutList.groupsList;
        },
        onGetChatRoomsList: (state) => {
            return state.aboutList.chatroomsList;
        }
    }
}

export default chatStore