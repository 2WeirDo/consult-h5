<script setup lang="ts">
// 封装需求❓：支持 title rightText 属性，支持 click-right 事件，click-left函数内支持返回上一页或默认首页
import { useRouter } from 'vue-router'
// 1. 已有的功能：返回图标，返回效果，固定定位（组件内部实现）
const router = useRouter()
const onClickLeft = () => {
  // 扩展 back 属性，如果有就执行 back 对应的函数。
  // 自定义返回的逻辑
  if (props.back) {
    return props.back()
    // 执行这个函数并return阻止代码往下走
  }
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
// bug:
// “透传 attribute”指的是传递给一个组件，却没有被该组件声明为 props 或 emits 的 attribute 或者 v-on 事件监听器
// 当不接收父组件传递过来的变量时, 当这个子组件以单个元素为根作渲染时，透传的 attribute 会自动被添加到根元素上
// 而这个地方正好我们的根元素有title属性和rightText属性, 因此就覆盖掉 (如果我们的van-nav-bar外面包裹一个div就不会透传属性了)
// 但对实际开发没啥影响, 因为我们还是会按照要求传递
const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void // 接收一个back函数, 自定义返回的逻辑
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
