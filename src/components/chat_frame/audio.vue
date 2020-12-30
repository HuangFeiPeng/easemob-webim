<template>
  <div class="audio_box">
    <div class="audio_title">
      <b class="line"></b>
      <span v-show="parms.audio_type === 0">点击录音</span>
      <span v-show="parms.audio_type > 0">{{
        parms.audio_length | recTime
      }}</span>
      <b class="line"></b>
    </div>
    <div class="record_btnOut">
      <!-- 点击开始录音 -->
      <div
        class="record_start"
        @click="recordStart"
        v-if="parms.audio_type === 0"
      ></div>
      <!-- 点击结束录音 -->
      <div
        class="record_recording"
        @click="recordStop"
        v-if="parms.audio_type === 1"
      ></div>
      <!-- 完成录音采集准备发送或取消 -->
      <div class="record_stop" v-if="parms.audio_type === 2"></div>
    </div>
    <div class="audio_btns" v-if="parms.audio_type === 2">
      <span class="btns send_btn" @click.stop="sendAudioMsg">发送</span>
      <span class="btns cancel_btn" @click.stop="cancelSend">取消</span>
    </div>
  </div>
</template>
<script>
import BenzAMRRecorder from "benz-amr-recorder/BenzAMRRecorder"
export default {
  data() {
    return {
      parms: {
        audio_length: 0, //录音时长
        audio_timer: null, //录音定时器
        audio_type: 0, // 0未录音,1开始录音，2停止录音
        audio_src: null, //录音资源,
        audio_time: 0 //计算后的录音时长
      }
    }
  },
  filters: {
    //处理现实的录制时间
    recTime(val) {
      //分 向下舍入，val满六十秒取一为一分钟。
      let min = Math.floor(val / 60),
        sec = val % 60
      return min + "：" + (sec < 10 ? "0" + sec : sec)
    }
  },
  computed: {
    addAudio_time() {
      let len = this.parms.audio_length
      // let min = Math.floor(len / 60),
      let sec = len % 60
      // return min + "." + (sec < 10 ? "0" + sec : sec)
      return sec
    }
  },
  watch: {
    //监听到length变化之后将新的参数传入到audio_time中。
    addAudio_time(newVal, oldVal) {
      this.parms.audio_time = newVal
      // console.log('监听到length改变',newVal);
    }
  },
  methods: {
    //开始录音
    recordStart: function() {
      this.amrRec = new BenzAMRRecorder()
      this.amrRec
        .initWithRecord()
        .then(() => {
          this.amrRec.startRecord()
          this.parms.audio_timer = setInterval(() => {
            this.parms.audio_length++
          }, 1000)
          this.parms.audio_type = 1
        })
        .catch(e => {
          console.log("调用error抛出", e)
        })
      console.log(this.amrRec)
    },
    //点击结束录音
    recordStop: function() {
      clearInterval(this.parms.audio_timer)
      if (!this.amrRec.isRecording()) {
        return console.log("当前未在录音！")
      }
      this.amrRec
        .finishRecord()
        .then(() => {
          //如果录音时间过短，则放弃录音
          if (this.parms.audio_length <= 1) {
            this.parms.audio_type = 0
            this.parms.audio_length = 0
            //该方法为放弃录音
            this.amrRec.cancelRecord()
            console.log(">>>>>放弃了录音")
          } else {
            // console.log(">>>>结束录音", this.amrRec.getBlob())
            this.parms.audio_src = this.amrRec.getBlob()
            this.parms.audio_type = 2
          }
        })
        .catch(e => {
          console.log("录音结束error", e)
        })
    },
    //发送语音消息
    sendAudioMsg: function() {
      //将采集到的blob音视频资源传入父组件进行发送

      this.$emit(
        "sendAudioMessage",
        this.parms.audio_src,
        this.parms.audio_time
      )
    },
    //取消发送
    cancelSend: function() {
      this.parms.audio_type = 0
      this.parms.audio_src = null
      this.parms.audio_length = 0
      this.parms.audio_time = 0
    }
  }
}
</script>
<style lang="scss" scoped>
.audio_box {
  position: absolute;
  top: -250px;
  left: 25%;
  width: 300px;
  height: 200px;
  padding: 4px;
  background: rgba(250, 248, 248, 0.384);
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 0px 4px gray;
  .audio_title {
    margin-top: 10px;
    height: 30px;
    color: red;
    .line {
      display: inline-block;
      width: 80px;
      height: 1px;
      background: #000;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      width: 100px;
      //   margin: 0 10px 0 10px;
      font-weight: 100;
    }
  }
  .record_btnOut {
    margin: 30px 0 0 40%;
    display: flex;
    width: 60px;
    height: 60px;
    background: rgb(252, 251, 250);
    border-radius: 50%;
    box-shadow: 0px 0px 4px gray;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      // transform: scale(1.1);
      box-shadow: 2px 2px 8px gray;
    }
    /* 录音三个阶段的按钮样式 */
    .record_start {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: crimson;
      text-align: center;
  
    }
    .record_recording {
      width: 35px;
      height: 35px;
      border-radius: 5px;
      background: crimson;
      text-align: center;
    }
    .record_stop {
      width: 0;
      height: 0;
      border: 20px solid transparent;
      border-left-color: #d1d1d1;
      margin-left: 25px;
    }
  }
  .audio_btns {
    margin-top: 10px;
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .btns {
      display: inline-block;
      width: 80px;
      height: 30px;
      line-height: 30px;
      border-radius: 5px;
      cursor: pointer;
    }
    .send_btn {
      background: #00abe8;
      color: #faf9f9;
    }
    .cancel_btn {
      background: #d1d1d1;
      color: #f8fbfc;
    }
  }
}
</style>
