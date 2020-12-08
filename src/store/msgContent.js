import WebIM from '@/utils/WebIM.js';
// import Storage from '../utils/storage'
// const loginInfo = Storage.getstorage("userInfo")
const conn = WebIM.conn
//该方法用来预处理过来的content组建key
function msgGroup(state, chatType, data) {
    var tb = state;
    var content = data.msgContent;
    var myID = conn.user;
    var l, r = ''
    if (chatType === 'singleChat') {
        if (myID == content.from) {
            l = content.from;
            r = content.to;
            content.right = true;
        } else {
            l = content.to;
            r = content.from;
            content.right = false;
        }
    } else if (chatType === 'groupChat' || chatType === 'chatRoom') {
        if (myID == content.from) {
            l = content.from;
            r = content.to;
            content.right = true;
        } else {
            l = myID;
            r = content.to;
            content.right = false;
        }
    }
    var key = `${l}-${r}`;
    var msgColls = tb[key];
    if (!msgColls) {
        msgColls = [];
        tb[key] = msgColls;
    }
    msgColls.push(content);
    return tb
}
const msgContent = {
    state: {
        msgList: {
            singleChat: {},
            groupChat: {},
            chatRoom: {}
        },
    },
    mutations: {
        //修改当前的聊天类型
        chatMsgType: (state, payload) => {
            console.log(state, payload);
        },
        //向消息List当中添加一条new消息
        addNewMessage: (state, payload) => {
            const {
                data,
                chatType
            } = payload;
            switch (chatType) {
                case 'singleChat':
                    state.msgList[chatType] = msgGroup(state.msgList[chatType], chatType, data);
                    break;
                case 'groupChat':
                    state.msgList[chatType] = msgGroup(state.msgList[chatType], chatType, data);
                    break;
                case 'chatRoom':
                    state.msgList[chatType] = msgGroup(state.msgList[chatType], chatType, data);
                    break;
                default:
                    break;
            }

            console.log(state, payload);
        }
    },
    actions: {
        //发送一条文本消息
        sendTextMsg: (context, step) => {
            console.log(context, step);
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
            let id = conn.getUniqueId(); // 生成本地消息id
            let msg = new WebIM.message('txt', id); // 创建文本消息
            msg.set({
                msg: step.msg, // 消息内容
                to: step.to, // 接收消息对象（用户id）
                chatType: step.type,
                ext: {}, //扩展消息
                success: function (id, serverMsgId) {
                    console.log('send private text Success', id, serverMsgId);
                    context.commit('addNewMessage', {
                        data: {
                            msgContent,
                            serverMsgId
                        },
                        chatType: step.type
                    })
                }, // 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
                fail: function (e) {
                    console.log("Send private text error", e);
                } // 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
            });
            // if (step.type === 'groupChat') {
            // msg.body.msgConfig = {
            //     allowGroupAck: true
            // }
            // }

            conn.send(msg.body);
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
            var id = conn.getUniqueId(); // 生成本地消息id
            var msg = new WebIM.message('custom', id); // 创建自定义消息
            var customEvent = "confrInfo"; // 创建自定义事件
            var customExts = {
                "confrID": '1216464564564646',
                "password": '123456'
            }; // 消息内容，key/value 需要 string 类型
            msg.set({
                to: step.to, // 接收消息对象（用户id）
                customEvent,
                customExts,
                chatType: step.type,
                ext: {}, // 消息扩展
                success: function (id, serverMsgId) {
                    context.commit('addNewMessage', {
                        data: {
                            msgContent,
                            serverMsgId
                        },
                        chatType: step.type
                    })
                },
                fail: function (e) {
                    console.log('>>>自定义消息发送失败', e);
                }
            });
            conn.send(msg.body);
        },
        //发送图片消息
        sendImageMsg: (context, step) => {
            console.log('>>>发送图片接收',step);
            const {imgId,to,type,contentsType} = step;
            var msgUrl;
            var id = conn.getUniqueId(); // 生成本地消息id
            var msg = new WebIM.message('img', id); // 创建图片消息
            var input = document.getElementById(imgId); // 选择图片的input
            var file = WebIM.utils.getFileUrl(input); // 将图片转化为二进制文件
            var allowType = {
                'jpg': true,
                'jpeg': true,
                'gif': true,
                'png': true,
                'bmp': true
            };
            if (file.filetype.toLowerCase() in allowType) {
                var option = {
                    file: file,
                    // length: '3000', // 视频文件时，单位(ms)
                    ext: {
                        file_length: file.data.size // 文件大小
                    },
                    to: to, // 接收消息对象
                    chatType: type, // 聊天类型
                    onFileUploadError: function (e) { // 消息上传失败
                        console.log('onFileUploadError',e);
                    },
                    onFileUploadComplete: function (res) { // 消息上传成功
                        console.log('onFileUploadComplete',res);
                        var imgUrl = `${res.uri}/${res.entities[0].uuid}` //拼接图片URL
                        return msgUrl= imgUrl;
                        
                    },
                    success: function (id,serverMsgId) { // 消息发送成功
                        console.log('Success',serverMsgId);
                        // const msgContent = {
                        //     contentsType: contentsType,
                        //     chatType: type,
                        //     msgData: msgData,
                        //     ext: {},
                        //     from: conn.user,
                        //     to: to,
                        //     time: new Date().getTime(),
                        //     right: false
            
                        // }
                        const msgContent = {
                            contentsType: contentsType,
                            chatType: type,
                            msgData: {
                                fileLength: 'msg.file_length',
                                fileType: 'msg.filetype',
                                fileName: 'msg.filename',
                                secret: 'msg.secret',
                                imgUrl: msgUrl,
                                width:'msg.width',
                                height: 'msg.height',
        
                            },
                            ext: msg.ext,
                            from: conn.user,
                            to: to,
                            time: new Date().getTime(),
                            right: false
                        }
                        context.commit('addNewMessage',{
                            data: {
                                msgContent,
                                serverMsgId
                            },
                            chatType: type
                        })
                        // console.log('>>>>>>',msgData);
                    },
                    fail: function (e) {
                        console.log("Fail",e); //如禁言、拉黑后发送消息会失败
                    },
                    flashUpload: WebIM.flashUpload
                };
                msg.set(option);
                conn.send(msg.body);
            }
        }
    },
    getters: {
        getMsgList: (state) => {
            return state.msgList
        }
    }
}

export default msgContent