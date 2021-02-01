<template>
  <div id="app">
    <header>
      <div id="topLine"></div>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <audio src="../src/assets/MP3/lingsheng.mp3" id="lingsheng"  muted></audio>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss">
@import url("./assets/_reset.scss");
@import url("./assets/Icon/iconfont.css");
#app {

  #topLine {
    width: 100%;
    height: 10px;
    background: linear-gradient(90deg, #6510ad 30%, #104fad);
  }
}
</style>
