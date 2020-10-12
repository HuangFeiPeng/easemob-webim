import WebIM from '@/utils/WebIM.js'
console.log('>>>>store', WebIM);
const chatStore = {
    state: {
        aboutList: {
            friendsList: [],
            groupsList: [],
            chatroomsList: []
        },
        //userID包含个人ID 群组ID 以及聊天室ID userName包含的只有群组name 以及 聊天室name
        userInfo: {
            userId: "",
            userName: ""
        }
    },
    mutations: {
        loadList: function (state, playload) {
            const {
                data,
                type
            } = playload;
            state.aboutList[type] = data;
        },
        chatName: (state, playload) =>{
            const { chatID, chatName} = playload
            console.log(chatID);
            state.userInfo.userId = chatID
            state.userInfo.userName = chatName

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
                    console.log('store>>>>群组', roster);
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
        getUserName: (context, strep) =>{
            context.commit('chatName',strep)
        }
    },
    getters: {
        onGetFriendsList: (state) => {
            return state.aboutList.friendsList;
        },
        onGetGroupList: (state)=>{
            return state.aboutList.groupsList;
        },
        onGetChatRoomsList: (state)=>{
            return state.aboutList.chatroomsList;
        }
    }
}

export default chatStore