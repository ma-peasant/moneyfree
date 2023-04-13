<script setup="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Greet from "./components/Greet.vue";

import {createSettingWindow } from "./utils/windowsUtils"

function openSetting() {
  console.log("打开设置窗口");
  createSettingWindow();
}
</script>

<template>
  <div>
    <div style="display: flex; flex-direction: row; justify-content: center;">
      <h1>Welcome to MoneyFree!</h1> 
      <el-icon style="height: 80px; margin-left: 40px;" :size = 25 @click = "openSetting()"><Tools /></el-icon>
      </div>
    <Greet />
  </div>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}

h1{
  text-align: center;
}
</style>
