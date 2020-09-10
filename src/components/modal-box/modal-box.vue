<template>
  <div>
    <div class="modal">
      <div class="modal-header">
        <h4>{{ modalTitle }}</h4>
      </div>
      <div class="modal-content">
          <slot name="modal-content"></slot>
      </div>
      <div class="modal-footer">
        <slot name="modal-footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modalTitle: {
      type: String,
      default: "这是一个模态框",
    },
  },
  methods: {
    okHandle() {
      //通知父组件点了确定
      alert(1);
      this.$emit("on-ok");
    },
    cancelHandle() {
      alert("取消了");
      this.$emit("on-cancel");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  width: 500px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
  .modal-header {
    padding: 15px;
    border-bottom: 1px solid #e5e5e5;
  }
  .modal-content div {
    padding: 20px;
  }
  .modal-footer {
    padding: 15px;
    text-align: right;
    border-top: 1px solid #e5e5e54d;
  }
}
</style>