<template>
  <div class="chat_header">
      <h3>{{ name }}</h3>
      
      </div>
</template>
<script>
export default {
  props: {
    name,
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
 .chat_header{
     width: 100%;
     height: 50px;
     padding: 0 20px;
    // background: cadetblue;
    h3{
        // text-align: left;
        margin-left: 50px;
        line-height: 50px;
        font-weight: 700;
        font-size: 25px;
    }
 }
</style>