<script setup lang="ts">
import { getConsultOrderPayUrl } from '@/api/consult'
import { showLoadingToast, showToast } from 'vant'
import { ref } from 'vue'

// 接收props api
const { orderId } = defineProps<{
  show: boolean // 控制支付弹层
  orderId: string // 订单id
  payment?: number // 多少钱
  onClose?: () => Promise<boolean> //支付窗口关闭控制
}>()

const emit = defineEmits<{
  (e: 'update:show', data: boolean): void
}>()

// 支付方式
const paymentMethod = ref<0 | 1>()
const pay = async () => {
  // 注意支付方式0微信，不能做!判断
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  showLoadingToast('跳转支付')
  const res = await getConsultOrderPayUrl({
    // 这里的订单id由外边传入, 因为我们是封装的, 要根据每个订单id进行支付
    orderId: orderId,
    paymentMethod: paymentMethod.value,
    // 支付成功后会自动回调到payCallback这个地址
    payCallback: 'http://localhost:5173/room'
  })
  console.log(res)
  // 跳转到支付宝平台进行支付
  // 注意这里使用window.location.href实现页面跳转, 这是跳转到另外一个网站, router用不了, 因为它是我们自己的路由对象,要设置页面的
  window.location.href = res.payUrl
}
</script>

<template>
  <!-- 这里如果v-model:show是会有问题的 -->
  <!-- show是父传子过来的父组件的变量. v-model会直接修改它, 违背了单向数据流的原则 
    解决 : 通过子传父修改父组件的show变量
    $event拿到当前绑定变量变化后的最新值传入给父组件
    总之: 如果说变量不是本组件定义的, 那么就不能写v-model, 而要写完整写法
  -->
  <van-action-sheet
    :show="show"
    @update:show="emit('update:show', $event)"
    title="选择支付方式"
    :close-on-popstate="false"
    :before-close="onClose"
    :closeable="false"
  >
    <div class="pay-type">
      <p class="amount">￥{{ payment?.toFixed(2) }}</p>
      <van-cell-group>
        <van-cell title="微信支付" @click="paymentMethod = 0">
          <template #icon><cp-icon name="consult-wechat" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
        </van-cell>
        <van-cell title="支付宝支付" @click="paymentMethod = 1">
          <template #icon><cp-icon name="consult-alipay" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <!-- 最终支付进行跳转 -->
        <van-button type="primary" round block @click="pay">立即支付</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<style lang="scss" scoped>
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
