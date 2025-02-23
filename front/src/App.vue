<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// 不需要直接导入 Home，因为路由器会处理
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
