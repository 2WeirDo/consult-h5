<script setup lang="ts">
import { getConsultOrderPre, createConsultOrder } from '@/api/consult'
import { getPatientDetail } from '@/api/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { onMounted, ref } from 'vue'
import { showFailToast, showToast, showConfirmDialog } from 'vant'
import { useRouter } from 'vue-router'
import { onBeforeRouteLeave } from 'vue-router'

const router = useRouter()
const store = useConsultStore()
// 1. 查询预订单信息
const payInfo = ref({} as ConsultOrderPreData)
const loadData = async () => {
  try {
    const res = await getConsultOrderPre({
      type: store.consult.type, // 问诊的类型
      illnessType: store.consult.illnessType // 问诊的级别(三甲或普通)
    })
    // console.log(res)
    payInfo.value = res
    // 设置默认优惠券
    // store.setCunpon(payInfo.value.couponId)
  } catch (error) {
    // 访问了支付页面, 但是缺少问诊数据, 跳回首页
    showFailToast('缺少必要问诊信息, 请重新选择')
    router.push('/home')
  }
}
// 2. 查询患者信息
const patient = ref<Patient>()
const loadPatient = async () => {
  if (!store.consult.patientId) return
  const res = await getPatientDetail(store.consult.patientId)
  // console.log(res)
  patient.value = res
}

onMounted(() => {
  loadData()
  loadPatient()
})

// 点击立即支付打开弹层
const agree = ref(false)
const show = ref(false)

// 存储订单id
const orderId = ref('')
const submit = async () => {
  if (!agree.value) return showToast('请勾选我已同意支付协议')
  // 打开
  show.value = true
  try {
    const res = await createConsultOrder(store.consult)
    orderId.value = res.id
    // 订单创建成功后，清除store中数据
    store.clear()
  } catch (error) {
    console.log(error)
  }
}

// 4.支付窗口打开后, 订单创建成功, 这时候不允许跳转到其它页面
onBeforeRouteLeave(() => {
  if (orderId.value) {
    showFailToast('当前不能跳转路由')
    return false // 存在订单id, 页面就不能执行跳转
  }
})

// 控制是否关闭支付窗口
const onClose = async () => {
  try {
    // showConfirmDialog返回的是一个promise因此可以这样写
    await showConfirmDialog({
      title: '关闭支付',
      message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
      cancelButtonText: '仍要关闭',
      confirmButtonText: '继续支付',
      confirmButtonColor: 'var(--cp-primary)'
    })
    // 点击继续支付走到这里
    return false // 官方规定要返回一个值, 不过这个值没什么用
  } catch {
    // 点击仍要关闭关闭走到这里
    orderId.value = '' // 清空后才能跳转页面, 不然跳不过去
    router.push('/user/consult')
    return true // 返回值没啥用
  }
}
</script>

<template>
  <div class="consult-pay-page">
    <cp-nav-bar title="支付" />
    <!-- 1. 支付信息 -->
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo?.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo?.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo?.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <!-- 2. 患者信息  -->
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <!-- 3. 打开支付弹层并创建问诊订单 -->
    <!-- 下面:price这个类型的问题好像暂时解决不了 -->
    <!-- ❓ 解决办法
      1: 在最后添加非空断言!
      2. v-if,有值才渲染
      3. 初始时使用断言as 
   -->
    <van-submit-bar
      button-type="primary"
      :price="payInfo?.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="submit"
    />
    <!-- 支付弹层 -->
    <!-- 根据需求, 需要传入什么props的值 -->
    <cp-pay-sheet
      v-model:show="show"
      :orderId="orderId"
      :payment="payInfo?.actualPayment"
      :onClose="onClose"
    ></cp-pay-sheet>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
  .pay-info {
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
    align-items: center;
    .tit {
      width: 100%;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .img {
      margin-right: 10px;
      width: 38px;
      height: 38px;
      border-radius: 4px;
      overflow: hidden;
    }
    .desc {
      flex: 1;
      > span {
        display: block;
        color: var(--cp-tag);
        &:first-child {
          font-size: 16px;
          color: var(--cp-text2);
        }
      }
    }
  }
  .pay-price {
    ::v-deep() {
      .vam-cell__title {
        font-size: 16px;
      }
      .van-cell__value {
        font-size: 16px;
        color: var(--cp-price);
      }
    }
  }
  .pay-space {
    height: 12px;
    background-color: var(--cp-bg);
  }
  .pay-schema {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: var(--cp-primary);
    }
  }
  ::v-deep() {
    .van-submit-bar__button {
      font-weight: normal;
      width: 160px;
    }
  }
}
// 支付弹层样式
</style>
