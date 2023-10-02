<script setup lang="ts">
import type { ConsultOrderItem } from '@/types/consult'
import { OrderType } from '@/enums'
import { computed, ref } from 'vue'

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

// 操作项的点击回调
const onSelect = () => {
  //
}

const props = defineProps<{ item: ConsultOrderItem }>()
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
      <van-button type="danger" plain size="small" round>取消问诊</van-button>
      <van-button type="primary" plain size="small" round :to="`/user/consult/${item.id}`">
        去支付
      </van-button>
    </div>
    <!-- 2. 待接诊：取消问诊+继续沟通 -->
    <div class="foot" v-if="item.status === OrderType.ConsultWait">
      <van-button type="danger" plain size="small" round>取消问诊</van-button>
      <van-button type="primary" plain size="small" round :to="`/room?orderId=${item.id}`">
        继续沟通
      </van-button>
    </div>
    <!-- 3. 咨询中：查看处方（如果开了）+继续沟通 -->
    <div class="foot" v-if="item.status === OrderType.ConsultChat">
      <van-button v-if="item.prescriptionId" type="primary" plain size="small" round>
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
      <van-button v-if="!item.evaluateId" type="primary" plain size="small" round>
        <!-- 这里没有实现去评价的功能 -->
        去评价
      </van-button>
      <van-button v-else plain type="success" size="small" round> 已评价 </van-button>
    </div>
    <!-- 5. 已取消：删除订单+咨询其他医生 -->
    <div class="foot" v-if="item.status === OrderType.ConsultCancel">
      <van-button type="danger" plain size="small" round>删除订单</van-button>
      <van-button type="primary" plain size="small" round to="/">咨询其他医生</van-button>
    </div>
  </div>
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
