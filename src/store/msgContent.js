// import WebIM from '@/utils/WebIM.js';
const msg = {
    contentsType: "",
    data: "卸载游戏"
}
const msgContent = {
    state: {
        msgList:{
            chatMsgList:[],
            groupMsgList:[],
            chatroomMsgList:[]
        }
    },
    mutations: {
        //向消息List当中添加一条new消息
        addNewMessage:(state,palyload)=>{
            console.log(palyload);
        }
    },
    actions: {
        //发送一条文本消息
        sendTextMsg:(context,step)=>{

        }
    },
    getters: {
        
    }
}

export default msgContent