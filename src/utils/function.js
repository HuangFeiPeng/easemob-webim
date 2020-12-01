let someFun = {
    //处理将接受到的消息存入。
    otherMsg(message) {
        let Type = {
            chat: 'singleChat',
            groupchat: 'groupChat',
            chatroom: 'chatRoom'
        }
        let serverMsgId = message.id;
        let chatType = Type[message.type];
        console.log('>>>>传入的消息', message);
        const msgContent = {
            contentsType: message.contentsType,
            chatType: chatType,
            msgData: message.data,
            ext: message.ext,
            from: message.from,
            to: message.to,
            time: message.time,
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
    },
    filterHTMLTag(msg) {
        msg.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
        msg = msg.replace(/[|]*\n/, '') //去除行尾空格
        msg = msg.replace(/&npsp;/ig, ''); //去掉npsp
        return msg;
    }
}

export default someFun;