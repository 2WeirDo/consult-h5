<script setup lang="ts">
defineProps<{
  options: {
    label: string // 指定显示的文本
    value: string | number // 显示的值(和后台对应)
  }[]
  modelValue?: string | number // 选中的value值
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

// 实现点击切换
const toggleItem = (value: string | number) => {
  // 触发自定义事件把数据给父组件
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="cp-radio-btn">
    <a
      class="item"
      href="javascript:;"
      v-for="item in options"
      :key="item.value"
      :class="{ active: modelValue === item.value }"
      @click="toggleItem(item.value)"
    >
      {{ item.label }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 70px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid var(--cp-bg);
    background-color: var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;

    // 选项选中添加的类名
    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>
