<script setup lang="ts">
import { ref } from 'vue'

// 1.发送文字消息
const text = ref('')
const emit = defineEmits<{
  (e: 'send-text', text: string): void
}>()

// 说明: 把输入的聊天文字子传父给父组件, 父组件中使用socket.emit方法把聊天文字发送给ws服务器 => 下发聊天内容给医生
const sendText = () => {
  emit('send-text', text.value)
  text.value = ''
}

// 2.发消息输入框是否可用
defineProps<{
  disabled: boolean
}>()
</script>

<template>
  <div class="room-action">
    <!-- 输入框: 发送文字消息 -->
    <!-- keyup.enter是回车事件 -->
    <van-field
      v-model="text"
      :disabled="disabled"
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      @keyup.enter="sendText"
      autocomplete="off"
    ></van-field>
    <!-- 图片上传: 发送图片消息 -->
    <van-uploader :preview-image="false" :disabled="disabled">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
