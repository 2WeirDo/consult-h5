<script setup lang="ts">
import type { ConsultOrderItem } from '@/types/consult'
import { OrderType } from '@/enums'
import { computed, ref } from 'vue'
import { cancelOrder, deleteOrder } from '@/api/consult'
import { showFailToast, showSuccessToast, showConfirmDialog } from 'vant'

const props = defineProps<{ item: ConsultOrderItem }>()
// == 已完成订单使用 ==
// 控制更多操作显示
const showPopover = ref(false)
// 操作项
// 为什么用computed?  因为props也是异步传来的, 最开始可能没数据
const actions = computed(() => [
  // disabled是代表禁用(组件提供的字段)
  { text: '查看处方', disabled: !props.item.prescriptionId }, // 没有开处方不能查看
  { text: '删除订单' }
])

// 下拉菜单操作项的点击回调(点击了'更多'选项栏中选项触发)
const onSelect = (action: { text: string }, i: number) => {
  // 第二个参数代表索引 : 我们定义的索引为1的选项text为删除订单, 因此当i为1时执行删除订单
  if (i === 1) {
    // 删除订单
    deleteConsultOrder(props.item)
  } else if (i === 0) {
    // 查看处方
    showPrescription(props.item.prescriptionId)
  }
}

// 1. 点击取消问诊订单
// 通过 loading 属性设置按钮为加载状态，加载状态下默认会隐藏按钮文字，
// 可以通过 loading-text 设置加载状态下的文字。
const loading = ref(false) // 防止重复点击
const cancelConsultOrder = async (item: ConsultOrderItem) => {
  loading.value = true
  showConfirmDialog({
    title: '温馨提示',
    message: '确认取消问诊吗? 亲'
  })
    .then(async () => {
      // 这里就近还是要加async
      console.log('点了确定')
      try {
        // 1.后台数据库取消
        await cancelOrder(item.id)

        // 2.前端修改订单的状态(局部刷新下, 不需要重新刷新列表)
        item.status = OrderType.ConsultCancel
        item.statusValue = '已取消'
        showSuccessToast('取消成功')
      } catch (e) {
        showFailToast('取消失败')
      } finally {
        // try/catch后不管成功还是失败都执行
        loading.value = false
      }
    })
    .catch(() => {
      console.log('点了取消')
      loading.value = false
    })
}

// 2. 点击删除问诊订单
// 注意 ❗ 我们是要删除订单, 要将父组件中的list列表根据id删除订单
// 因此我们要子传父一个订单id, 父组件根据订单id进行filter删除
const emit = defineEmits<{
  (e: 'on-delete', id: string): void
}>()
const deleteLoading = ref(false) // 防止重复点击
const deleteConsultOrder = (item: ConsultOrderItem) => {
  deleteLoading.value = true
  showConfirmDialog({
    title: '温馨提示',
    message: '确认删除订单吗? 亲'
  })
    .then(async () => {
      console.log('点了确定')
      try {
        // 后台数据库取消
        await deleteOrder(item.id)
        // 通知父组件更新列表
        emit('on-delete', item.id)
        showSuccessToast('删除成功')
      } catch (e) {
        showFailToast('删除失败')
      } finally {
        // try/catch后不管成功还是失败都执行
        deleteLoading.value = false
      }
    })
    .catch(() => {
      console.log('点了取消')
      deleteLoading.value = false
    })
}

// 3.查看处方
import { useShowPrescription } from '@/hooks'
const { showPrescription } = useShowPrescription()

// 4.定义支付弹层所需参数
const show = ref(false)
</script>

<template>
  <div class="consult-item">
    <div class="head van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p>{{ item.docInfo?.name || '暂未分配医生' }}</p>
      <span
        :class="{
          orange: item.status === OrderType.ConsultPay,
          green: item.status === OrderType.ConsultChat
        }"
        >{{ item.statusValue }}</span
      >
    </div>
    <!-- 患者信息 -->
    <!-- 这里的路由也支持vue2写法, 模板可用 -->
    <div class="body" @click="$router.push(`/user/consult/${item.id}`)">
      <div class="body-row">
        <div class="body-label">患者</div>
        <div class="body-value">{{ item.patientInfo.name }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">病情描述</div>
        <div class="body-value">{{ item.illnessDesc }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">价格</div>
        <div class="body-value">¥ {{ item.payment }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">创建时间</div>
        <div class="body-value tip">{{ item.createTime }}</div>
      </div>
    </div>

    <!-- 根据不同的订单状态显示不同的操作按钮 -->
    <!--   
      待支付 ConsultPay
      待接诊 ConsultWait
      咨询中 ConsultChat
      已完成 ConsultComplete
      已取消 ConsultCancel
    -->
    <!-- 1. 待支付：取消问诊+去支付 -->
    <div class="foot" v-if="item.status === OrderType.ConsultPay">
      <van-button
        type="danger"
        plain
        size="small"
        round
        :loading="loading"
        @click="cancelConsultOrder(item)"
        >取消问诊</van-button
      >
      <van-button type="primary" plain size="small" round @click="show = true"> 去支付 </van-button>
    </div>
    <!-- 2. 待接诊：取消问诊+继续沟通 -->
    <div class="foot" v-if="item.status === OrderType.ConsultWait">
      <van-button
        type="danger"
        plain
        size="small"
        round
        :loading="loading"
        @click="cancelConsultOrder(item)"
        >取消问诊</van-button
      >
      <van-button type="primary" plain size="small" round :to="`/room?orderId=${item.id}`">
        继续沟通
      </van-button>
    </div>
    <!-- 3. 咨询中：查看处方（如果开了）+继续沟通 -->
    <div class="foot" v-if="item.status === OrderType.ConsultChat">
      <van-button
        v-if="item.prescriptionId"
        type="primary"
        plain
        @click="showPrescription(item.prescriptionId)"
        size="small"
        round
      >
        查看处方
      </van-button>
      <van-button type="primary" plain size="small" round :to="`/room?orderId=${item.id}`">
        继续沟通
      </van-button>
    </div>
    <!-- 4. 已完成：更多（查看处方，如果开了，删除订单）+问诊记录+（未评价?写评价:查看评价） -->
    <div class="foot" v-if="item.status === OrderType.ConsultComplete">
      <div class="more">
        <!-- van-popover组件下拉菜单, 因为一行放不下-->
        <!-- 通过action指定下拉选项 : text代表文字 -->
        <van-popover
          theme="dark"
          placement="top-start"
          v-model:show="showPopover"
          :actions="actions"
          @select="onSelect"
        >
          <template #reference>
            <van-button size="small" type="default">更多</van-button>
          </template>
        </van-popover>
      </div>
      <van-button type="warning" plain size="small" round :to="`/room?orderId=${item.id}`">
        问诊记录
      </van-button>
      <van-button
        v-if="!item.evaluateId"
        type="primary"
        :to="`/room?orderId=${item.id}`"
        plain
        size="small"
        round
      >
        <!-- 这里没有实现去评价的功能 -->
        去评价
      </van-button>
      <van-button v-else plain type="success" size="small" round> 已评价 </van-button>
    </div>
    <!-- 5. 已取消：删除订单+咨询其他医生 -->
    <div class="foot" v-if="item.status === OrderType.ConsultCancel">
      <van-button
        type="danger"
        plain
        size="small"
        round
        :loading="deleteLoading"
        @click="deleteConsultOrder(item)"
        >删除订单</van-button
      >
      <van-button type="primary" plain size="small" round to="/">咨询其他医生</van-button>
    </div>
  </div>
  <!-- 复用支付弹层 -->
  <cp-pay-sheet v-model:show="show" :orderId="item.id" :payment="item.payment"></cp-pay-sheet>
</template>

<style lang="scss" scoped>
.consult-item {
  border-radius: 4px;
  box-shadow: 0px 0px 22px 0px rgba(245, 245, 245, 0.1);
  background-color: #fff;
  margin-bottom: 10px;
  .head {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    .img {
      width: 20px;
      height: 20px;
    }
    > p {
      flex: 1;
      font-size: 15px;
      padding-left: 10px;
    }
    > span {
      color: var(--cp-tag);
      &.orange {
        color: #f2994a;
      }
      &.green {
        color: var(--cp-primary);
      }
    }
  }
  .body {
    padding: 15px 15px 8px 15px;
    .body-row {
      display: flex;
      margin-bottom: 7px;
    }
    .body-label {
      width: 62px;
      font-size: 13px;
      color: var(--cp-tip);
    }
    .body-value {
      width: 250px;
      &.tip {
        color: var(--cp-tip);
      }
    }
  }
  .foot {
    padding: 0 15px 15px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .van-button {
      margin-left: 10px;
      padding: 0 16px;
      &.gray {
        color: var(--cp-text3);
        background-color: var(--cp-bg);
      }
    }
    .more {
      color: var(--cp-tag);
      flex: 1;
      font-size: 13px;
    }
  }
}
</style>
