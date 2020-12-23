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
//处理添加消息到nowList（消息分发）
function addNowMsg(chatMsgs, chatType, data) {
    //他人环信ID
    let overId = ''
    let nowMsg = []
    //处理是否为发送方，如果是取to，不是则取from
    data.right ? overId = data.to : overId = data.from;
    //取当前的选中的目标ID
    let nowId = window.Vue.$store.state.chatStore.userInfo.userId
    //拼接key
    let nowKey = `${conn.user}-${overId}`
    //循环穿过来的消息对象
    for (const key in chatMsgs) {
        if (Object.hasOwnProperty.call(chatMsgs, key)) {
            const element = chatMsgs[key];
            console.log(element);
            if (chatType === 'singleChat') {
                //如果是单聊则进入=》判断消息来源是不是当前选中ID或发送目标是不是当前选中ID=》判断该消息的分类key是不是当前key值下的消息=》条件满足赋值
                if (data.from == nowId || data.to == nowId) {
                    if (key === nowKey) {
                        nowMsg = element
                    }
                } else {
                    return false
                }
            } else if(chatType === 'groupChat' || chatType === 'chatRoom') {
                //如果是聊天室或群组则进入=》判断消息来源是不是当前选中ID或发送目标是不是当前选中ID=》判断该消息的分类key是不是当前key值下的消息=》条件满足赋值
                //由于群组聊天室to字段永远是聊天室或者是群组ID，所以重新拼接key
                var toKey = `${conn.user}-${data.to}`
                console.log('成功触发过来的消息');
                if (data.to == nowId) {
                    console.log('>>>>>没错是当前选中的群或者聊天室');
                    if (key === toKey) {
                        nowMsg = element
                        console.log('>>>>>>也是当前的key');
                    }
                }
            }
        }
    }
    console.log('>>>>>>即将抛出的', nowMsg);
    return nowMsg
}
const msgContent = {
    state: {
        //所有在线收发消息的存储
        msgList: {
            singleChat: {},
            groupChat: {},
            chatRoom: {}
        },
        //存放当前联系人的消息
        nowMsgList: []
    },
    mutations: {
        //向消息List当中添加一条new消息
        addNewMessage: (state, payload) => {
            const {
                data,
                chatType
            } = payload;
            console.log('>>>>>添加一条新消息', data);

            switch (chatType) {
                case 'singleChat':
                    state.msgList[chatType] = msgGroup(state.msgList[chatType], chatType, data);
                    state.nowMsgList = addNowMsg(state.msgList[chatType], chatType, data.msgContent)
                    // console.log('>>>>>>>',state.msgList[chatType]);
                    break;
                case 'groupChat':
                    state.msgList[chatType] = msgGroup(state.msgList[chatType], chatType, data);
                    state.nowMsgList = addNowMsg(state.msgList[chatType], chatType, data.msgContent)
                    break;
                case 'chatRoom':
                    state.msgList[chatType] = msgGroup(state.msgList[chatType], chatType, data);
                    state.nowMsgList = addNowMsg(state.msgList[chatType], chatType, data.msgContent)
                    break;
                default:
                    break;
            }
        },
        //将获取到的当前联系人的消息往来添加进nowMsgList
        addNowMessage: (state, payload) => {
            state.nowMsgList = payload
        }
    },
    actions: {
        //获取当前联系人的聊天消息
        getNowMsg: (context, step) => {
            console.log('>>>>>触发获取当前联系人的历史消息', step);
            const {
                myID,
                overID,
                type
            } = step
            if (myID && overID !== '') {
                var key = `${myID}-${overID}`
                console.log(key);
                var msgBody = context.state.msgList[type][key]
                context.commit('addNowMessage', msgBody)

            }

        },
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
            console.log('>>>发送图片接收', step);
            const {
                imgId,
                to,
                type,
                contentsType,
                Dom,
                // fileInfo
            } = step;
            var imgeName = Dom.value.split('\\')[2] // “\”是转义 所以要截取单斜杠 为\\

            var msgUrl;
            var id = conn.getUniqueId(); // 生成本地消息id
            var msg = new WebIM.message('img', id); // 创建图片消息
            var file = WebIM.utils.getFileUrl(Dom); // 将图片转化为二进制文件
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
                        console.log('onFileUploadError', e);
                    },
                    onFileUploadComplete: function (res) { // 消息上传成功
                        console.log('onFileUploadComplete', res);
                        var imgUrl = `${res.uri}/${res.entities[0].uuid}` //拼接图片URL
                        return msgUrl = imgUrl;

                    },
                    success: function (id, serverMsgId) { // 消息发送成功
                        console.log('Success', serverMsgId);
                        const msgContent = {
                            contentsType: contentsType,
                            chatType: type,
                            msgData: {
                                fileLength: 'msg.file_length',
                                fileType: 'msg.filetype',
                                fileName: imgeName,
                                secret: 'msg.secret',
                                imgUrl: msgUrl,
                                width: 'msg.width',
                                height: 'msg.height',

                            },
                            ext: msg.ext,
                            from: conn.user,
                            to: to,
                            time: new Date().getTime(),
                            right: false
                        }
                        context.commit('addNewMessage', {
                            data: {
                                msgContent,
                                serverMsgId
                            },
                            chatType: type
                        })

                        // console.log('>>>>>>',msgData);
                    },
                    fail: function (e) {
                        console.log("Fail", e); //如禁言、拉黑后发送消息会失败
                    },
                    flashUpload: WebIM.flashUpload
                };
                msg.set(option);
                conn.send(msg.body);
            }
        },
        //发送文件消息
        sendFilesMsg: (context, step) => {
            // console.log('>>>>文件消息', context, step);
            const {
                to,
                type,
                contentsType,
                Dom,
                fileInfo
            } = step;
            // var fileName = Dom.value.split('\\')[2] // “\”是转义 所以要截取单斜杠 为\\
            var fileName = fileInfo.name // “\”是转义 所以要截取单斜杠 为\\
            console.log('>>>>>拿到文件的信息', fileInfo);
            var msgUrl;
            var id = conn.getUniqueId(); // 生成本地消息id
            var msg = new WebIM.message('file', id); // 创建文件消息
            // var input = document.getElementById(fileId); // 选择文件的input
            var file = WebIM.utils.getFileUrl(Dom); // 将文件转化为二进制文件
            var allowType = {
                'jpg': true,
                'gif': true,
                'png': true,
                'bmp': true,
                'zip': true,
                'txt': true,
                'doc': true,
                'pdf': true,
                'mp4': true,
                'json': true,
                'mov': true,
                'pptx': true,
                'js': true
            };
            if (file.filetype.toLowerCase() in allowType) {
                var option = {
                    file: file,
                    to: to, // 接收消息对象
                    chatType: type, // 设置聊天类型
                    onFileUploadError: function () { // 消息上传失败
                        console.log('onFileUploadError');
                    },
                    onFileUploadComplete: function (res) { // 消息上传成功
                        console.log('>>>>>文件上传成功', res);
                        var fileUrl = `${res.uri}/${res.entities[0].uuid}` //拼接URL
                        return msgUrl = fileUrl;
                    },
                    success: function (id, serverMsgId) { // 消息发送成功
                        console.log('Success');
                        const msgContent = {
                            contentsType: contentsType,
                            chatType: type,
                            msgData: {
                                fileLength: fileInfo.size,
                                fileType: 'msg.filetype',
                                fileName: fileName,
                                secret: 'msg.secret',
                                fileUrl: msgUrl,
                                width: 'msg.width',
                                height: 'msg.height'

                            },
                            ext: msg.ext,
                            from: conn.user,
                            to: to,
                            time: new Date().getTime(),
                            right: false
                        }
                        context.commit('addNewMessage', {
                            data: {
                                msgContent,
                                serverMsgId
                            },
                            chatType: type
                        })
                        Dom.value = null
                    },
                    fail: function (e) {
                        console.log("Fail"); //如禁言、拉黑后发送消息会失败
                    },
                    flashUpload: WebIM.flashUpload,
                    ext: {
                        file_length: file.data.size
                    }
                };
                msg.set(option);
                conn.send(msg.body);
            }
        }
    },
    getters: {
        onGetMsgList: (state) => {
            return state.nowMsgList

        }

    }
}

export default msgContent