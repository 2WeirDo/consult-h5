<script setup lang="ts">
// 封装需求❓：支持 title rightText 属性，支持 click-right 事件，click-left函数内支持返回上一页或默认首页
import { useRouter } from 'vue-router'
// 1. 已有的功能：返回图标，返回效果，固定定位（组件内部实现）
const router = useRouter()
const onClickLeft = () => {
  // 判断历史记录中是否有回退
  // 补充: 当我们使用router.replace跳转是不能返回页面的
  if (history.state?.back) {
    // 判断是否可以回退
    // 存在回跳地址就返回
    router.back()
  } else {
    // 否则跳回首页
    router.push('/')
  }
}
// 接收父传子变量
defineProps<{
  title?: string
  rightText?: string
}>()

// 子传父

const emit = defineEmits<{
  (e: 'click-right'): void
}>()
const onClickRight = () => {
  // 传递自定义事件click-right给父组件
  emit('click-right')
}
</script>

<template>
  <van-nav-bar
    left-arrow
    @click-left="onClickLeft"
    fixed
    :title="title"
    :right-text="rightText"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
// 添加scoped避免样式污染(在调试中可看见生成复杂的data-v属性)
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
