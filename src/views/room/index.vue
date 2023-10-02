<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { io, type Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import type { Image } from '@/types/consult'
import { MsgType, OrderType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderDetail } from '@/api/consult'

const list = ref<Message[]>([])
const store = useUserStore()
const route = useRoute()

let socket: Socket

const initSocket = () => {
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
        // 注意: 冒号后面是类型!!
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

  // 2.接收医生回复的消息
  socket.on('receiveChatMsg', async (msg) => {
    list.value.push(msg) // 这部操作之后框架会为我们更新DOM
    // 说明❓: list消息列表更新后, 直接滚动会失效
    // 原因❓: 改了数据之后的DOM更新是同步还是异步? => 是异步的
    // 解决: 等到异步更新结束 => 再执行同步代码(在这里就是滚动)
    // 所以我们要等到DOM更新完成再执行滚动
    await nextTick() // 列表有消息之后我们再进行滚动
    // 每次收到消息后, 滚动到最底部 => document.body.scrollHeight获取滚动高度
    window.scrollTo(0, document.body.scrollHeight) // 这是同步代码
    // 解释: ❓ 关于加载完图片没有滚动的问题: 由于图片和文字不一样, 文字你请求后就能进行渲染, 但图片还需要下载, nextTick它不会等待你下载完再进行滚动
  })

  // 3.监听医生订单状态变更，更新订单状态（必须）
  socket.on('statusChange', () => {
    // 要获取订单中的医生的信息, 所以要先获取医生信息才能进行状态的变更
    getOrderDetail()
    console.log('订单状态更新了：', consult.value)
  })
}

// 2.发送文字消息 => 使用socket.emit方法把聊天文字发送给ws服务器 => 下发聊天内容给医生
// 获取订单详情
const consult = ref<ConsultOrderItem>()
const getOrderDetail = async () => {
  // 获取订单详情
  // 要传入订单id获取详情信息
  // 可能不存在(为null) => as断言
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res
}

const sendText = (text: string) => {
  // 需要ws服务器做中转
  socket.emit('sendChatMsg', {
    from: store.user?.id, // 发送人
    to: consult.value?.docInfo?.id, // 收消息人(通过接口拿到) 接诊的医生
    msgType: MsgType.MsgText, // 消息类型: 文字消息
    msg: { content: text } // 消息内容
  })
}

// 3.发送图片消息
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

onMounted(() => {
  // 组件挂载建立连接
  initSocket()
  // 获取订单详情数据
  getOrderDetail()
})
onUnmounted(() => {
  // 组件销毁关闭连接
  socket.close()
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <!-- 1. 问诊状态-->
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <!-- 2. 问诊聊天列表消息 -->
    <room-message :list="list" />
    <!-- 3. 底部操作栏：发消息 -->
    <!-- 医生未接诊，不是咨询中状态禁用消息输入框 -->
    <room-action
      @send-text="sendText"
      @send-image="sendImage"
      :disabled="consult?.status !== OrderType.ConsultChat"
    />
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
