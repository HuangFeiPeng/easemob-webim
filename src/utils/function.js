import storage from "./storage";
let someFun = {
    //处理将接受到的消息存入。
    otherMsg(msg) {
        let Type = {
            chat: 'singleChat',
            groupchat: 'groupChat',
            chatroom: 'chatRoom'
        }
        let serverMsgId = msg.id;
        let chatType = Type[msg.type];
        switch (msg.contentsType) {
            case 'TEXT': {
                const msgContent = {
                    contentsType: msg.contentsType,
                    chatType: chatType,
                    msgData: msg.data,
                    ext: msg.ext,
                    from: msg.from,
                    to: msg.to,
                    time: msg.time,
                    right: false
                }
                console.log('>>>>接收的othermessage', msgContent);
                window.Vue.$store.commit('addNewMessage', {
                    data: {

                        msgContent,
                        serverMsgId
                    },
                    chatType
                })
                break;
            }
            case 'IMAGE': {
                const msgContent = {
                    contentsType: msg.contentsType,
                    chatType: chatType,
                    msgData: {
                        fileLength: msg.file_length,
                        fileType: msg.filetype,
                        fileName: msg.filename,
                        secret: msg.secret,
                        imgUrl: msg.url,
                        width: msg.width,
                        height: msg.height,

                    },
                    ext: msg.ext,
                    from: msg.from,
                    to: msg.to,
                    time: msg.time,
                    right: false
                }
                window.Vue.$store.commit('addNewMessage', {
                    data: {

                        msgContent,
                        serverMsgId
                    },
                    chatType
                })
                break;
            }
            case 'FILE': {
                const msgContent = {
                    contentsType: msg.contentsType,
                    chatType: chatType,
                    msgData: {
                        fileLength: msg.file_length,
                        fileType: msg.filetype,
                        fileName: msg.filename,
                        secret: msg.secret,
                        fileUrl: msg.url,
                        width: msg.width,
                        height: msg.height,

                    },
                    ext: msg.ext,
                    from: msg.from,
                    to: msg.to,
                    time: msg.time,
                    right: false
                }
                window.Vue.$store.commit('addNewMessage', {
                    data: {

                        msgContent,
                        serverMsgId
                    },
                    chatType
                })
                break
            }
            default:
                break;
        }

        console.log('>>>>传入的消息', msg);

    },
    //TO DO 暂时没用到过滤
    filterHTMLTag(msg) {
        msg.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
        msg = msg.replace(/[|]*\n/, '') //去除行尾空格
        msg = msg.replace(/&npsp;/ig, ''); //去掉npsp
        return msg;
    },
    //文件Size转换
    readablizeBytes(value) {
        let s = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
        let e = Math.floor(Math.log(value) / Math.log(1024));
        return (value / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    },
}

export default someFun;