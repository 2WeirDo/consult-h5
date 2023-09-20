<script setup lang="ts"></script>

<template>
  <div class="layout-page">
    <!-- 二级路由挂载点 : 显示子路由页面 -->
    <router-view></router-view>

    <!-- tabBar组件 -->
    <van-tabbar route>
      <van-tabbar-item to="/home">
        首页
        <template #icon="{ active }">
          <!-- 通过vant提供的作用域插槽动态绑定图标 -->
          <!-- 这是vant官方用法 => 通过作用域插槽拿到一个bool值active(这里解构出的, 原本应该拿prop.active): 值为true即为选中, false为未选中 -->
          <cp-icon :name="`home-index-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/article">
        健康百科
        <template #icon="{ active }">
          <cp-icon :name="`home-article-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/notify">
        消息中心
        <template #icon="{ active }">
          <cp-icon :name="`home-notice-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/user">
        我的
        <template #icon="{ active }">
          <cp-icon :name="`home-mine-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
.layout-page {
  // 样式穿透
  ::v-deep() {
    .van-tabbar-item {
      &__icon {
        font-size: 21px;
      }
      &__text {
        font-size: 11px;
      }
    }
  }
}
</style>
