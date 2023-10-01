<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { io, type Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'

import { MsgType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'

const list = ref<Message[]>([])
const store = useUserStore()
const route = useRoute()

let socket: Socket
onUnmounted(() => {
  socket.close()
})
onMounted(async () => {
  // 建立链接，创建 socket.io 实例
  // 客服端在打开聊天窗口时，传token，作为登录认证，传orderid作为参数（作为房间信息，区分不同的聊天室roomid）
  // io第一个参数为服务器地址, 第二个参数为相关配置
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    // query : ?后的参数
    query: {
      orderId: route.query.orderId
    }
  })

  socket.on('connect', () => {
    // 监听连接成功
    console.log('')
  })

  socket.on('error', () => {
    // 监听连接错误
    console.log('error')
  })

  socket.on('disconnect', () => {
    // 监听连接断开
    console.log('disconnect')
  })

  // 1.接收ws服务器给浏览器(患者端)发送默认数据
  // 聊天历史记录
  // 说明: 这里只需解构data然后写data的类型注解
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // 准备转换常规消息列表
    const arr: Message[] = []
    data.forEach((item) => {
      // 1. 处理消息时间
      arr.push({
        msgType: MsgType.Notify, // 跟后台约定, 决定使用哪个消息卡片渲染消息
        msg: { content: item.createTime }, // 就是显示消息时间用的
        createTime: item.createTime,
        id: item.createTime
      })
      // 2. 其它消息
      arr.push(...item.items)
    })
    // 追加到聊天消息列表
    list.value.push(...arr)
  })
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <!-- 1. 问诊状态-->
    <room-status />
    <!-- 2. 问诊聊天列表消息 -->
    <room-message :list="list" />
    <!-- 3. 底部操作栏：发消息 -->
    <room-action />
  </div>
</template>
<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
