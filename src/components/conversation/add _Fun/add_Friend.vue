<template>
    <div @click="$parent.modalType !==0 ?$parent.modalType = 0 : $parent.modalType =-1,$parent.modalTitle='添加好友'">
        <img src="@/assets/image/userplus.png" alt="">
        <span>添加好友</span>
    </div>
</template>
<script>
<<<<<<< HEAD
import {mapState} from 'vuex';
=======
>>>>>>> origin/master
export default {
    props:{
        toID:{
            type:String
        }
    },
    data () {
        return {
            
        }
    },
    methods:{
        addFriends(){
            let message = `${this.$conn.user}申请添加好友`
            this.toID &&  this.$conn.addContact(this.toID, message);
            this.$notify({
                title: `申请发出`,
                message: `您向${this.toID}の好友申请已发出,静候佳音吧！`,
                type: "success"
              });
            this.$parent.toId=""
        }
    }
}
</script>

<style lang="scss" scoped>
div{
    display: flex;
    flex-direction: row;
    // justify-content: space-around;
    align-items: center;
    img{
        margin: 0 10px 0 50px;
        width: 20px;
        height: 20px;
    }
}
</style>