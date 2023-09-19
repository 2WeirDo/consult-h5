<script setup lang="ts">
// 封装需求❓：支持 title rightText 属性，支持 click-right 事件，click-left函数内支持返回上一页或默认首页
const onClickLeft = () => {
  // 点击左侧执行
}
const onClickRight = () => {
  //
}
</script>

<template>
  <!-- 二次封装 -->
  <van-nav-bar
    left-arrow
    @click-left="onClickLeft"
    fixed
    title="注册"
    right-text="注册"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped> // 添加scoped避免样式污染(在调试中可看见生成复杂的data-v属性)
// ::v-deep() 深度作用选择符/样式穿透
// 思考❓什么时候需要加, 什么时候不需要?
// 1.元素身上有data-v属性, 直接拿类名控制
// 2.元素身上没有data-v属性, 需要使用样式穿透
// (也可以直接在类名前加 ::v-deep , 但::v-deep()可直接设置多个样式, 推荐后者)
::v-deep() {
  .van-nav-bar {
    &__arrow {
      // 这个类名就是van-nav-bar__arrow, 这个就需要使用到样式穿透
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
