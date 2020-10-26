import WebIM from '@/utils/WebIM.js';
const conn = WebIM.conn
const msgContent = {
    state: {
        msgList: {
            chatMsgList: [],
            groupMsgList: [],
            chatroomMsgList: []
        },
    },
    mutations: {
        //修改当前的聊天类型
        chatMsgType: (state, payload) => {
            console.log(state, payload);
        },
        //向消息List当中添加一条new消息
        addNewMessage: (state, payload) => {
            console.log(state, payload);
        }
    },
    actions: {
        //发送一条文本消息
        sendTextMsg: (context, step) => {
            debugger
            console.log(context,step);
            //构建基本消息存储备份
            const myMsg = {
                contentsType: step.type,
                data: step.msg,
                ext: {},
                from: conn.user,
                // msgID: serverMsgId,
                to: step.to,
                // time: new Date(),
                // status: null,
                source: 'self'
              }
            let id = conn.getUniqueId(); // 生成本地消息id
            let msg = new WebIM.message('txt', id); // 创建文本消息
            msg.set({
                msg: step.msg, // 消息内容
                to: step.to, // 接收消息对象（用户id）
                chatType: step.type, // 设置为单聊
                ext: {}, //扩展消息
                success: function (id, serverMsgId) {
                    console.log('send private text Success',id, serverMsgId);
                    context.commit('addNewMessage',{
                        myMsg
                    })
                }, // 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
                fail: function (e) {
                    console.log("Send private text error",e);
                } // 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
            });
            if (step.type === "groupChat" || step.type === "chatRoom") {
                msg.setGroup("groupchat");
            }
            conn.send(msg.body);
        }
    },
    getters: {

    }
}

export default msgContent