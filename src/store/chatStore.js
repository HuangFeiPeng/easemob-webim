import WebIM from '@/utils/WebIM.js'
console.log('>>>>store', WebIM);
const chatStore = {
    state: {
        aboutList: {
            friendsList: [],
            groupsList: [],
            chatroomsList: []
        }
    },
    mutations: {
        loadList: function (state, playload) {
            const {
                data,
                type
            } = playload;
            state.aboutList[type] = data;
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