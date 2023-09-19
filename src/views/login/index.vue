<script setup lang="ts">
const clickRight = () => {
  console.log('点击了')
}
</script>

<template>
  <!-- 使用了 unplugin-vue-components 默认 src/components 下组件会自动导入注册 -->
  <cp-nav-bar title="登录" rightText="注册" @click-right="clickRight"></cp-nav-bar>
</template>

<style lang="scss" scoped></style>
