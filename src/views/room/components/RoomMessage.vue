<script setup lang="ts">
// 评价医生
import EvaluateCard from './EvaluateCard.vue'

import { ConsultTime, MsgType } from '@/enums'
import type { Message } from '@/types/room'
import { showFailToast, showImagePreview } from 'vant'
import type { Image } from '@/types/consult'

// 导入患病时间选项和是否就诊常量
import { timeOptions, flagOptions } from '@/api/const'

import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { PrescriptionStatus } from '@/enums'
import type { Prescription } from '@/types/room'

import { useUserStore } from '@/stores'
const store = useUserStore()

// 1. 定义病情格式化数据
// 获取患病时间label信息
const getIllnessTimeText = (time: ConsultTime) =>
  timeOptions.find((item) => item.value === time)?.label
// 获取是否就诊label信息
const getConsultFlagText = (flag: 0 | 1) => flagOptions.find((item) => item.value === flag)?.label

// 2.图片预览
const previewImg = (pictures?: Image[]) => {
  // 传入一个数组, 里面包括图片地址, 有多个就传入多个地址, 逗号分隔 showImagePreview([url1, url2, url3, ...])
  // 这里我们只要url, 就map获取地址的数组就行了
  if (pictures && pictures.length) {
    showImagePreview(pictures.map((item) => item.url))
  } else {
    showFailToast('没有传入病情描述图片')
  }
}

// 3.格式化时间
const formatTime = (time: string) => dayjs(time).format('HH:mm')

// 4.图片加载成功 => 执行滚动
// 进而解决了图片消息滚动失败的问题
const loadSuccess = () => {
  // 等奥图片下载渲染完执行滚动
  window.scrollTo(0, document.body.scrollHeight)
}

// 5.查看处方
import { useShowPrescription } from '@/hooks'
const { showPrescription } = useShowPrescription()

// 6.点击购买处方中的药品
// 点击处方的跳转
const router = useRouter()
const buy = (pre?: Prescription) => {
  // 同样要判断一下
  if (pre) {
    // 1. 如果处方失效：提示即可
    if (pre.status === PrescriptionStatus.Invalid) return showFailToast('处方已失效')
    // 2. 没有支付：去药品预支付页面
    if (pre.status === PrescriptionStatus.NotPayment)
      return router.push(`/medicine/pay?id=${pre.id}`)
  }
}

defineProps<{ list: Message[] }>()
</script>

<template>
  <!-- 消息列表 -->
  <template v-for="{ msgType, msg, id, createTime, fromAvatar, from } in list" :key="id">
    <!-- item的消息显示需要根据当前消息卡片类型, 匹配对应消息卡片进行渲染展示 -->
    <!-- 1. 病情描述 -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom" v-if="msg.consultRecord">
        <p>
          {{ msg.consultRecord.patientInfo.name }}
          {{ msg.consultRecord.patientInfo.genderValue }}
          {{ msg.consultRecord.patientInfo.age }}岁
        </p>
        <p>
          <!-- 患病时间 -->
          {{ getIllnessTimeText(msg.consultRecord.illnessTime) }} |
          <!-- 是否就诊过 --- 后端没返回文字, 它只返回一个标识数字 -->
          {{ getConsultFlagText(msg.consultRecord.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="previewImg(msg.consultRecord?.pictures)"> 点击查看 </van-col>
      </van-row>
    </div>
    <!--2.  温馨提示 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 3. 通用通知 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 4. 发送文字：患者发的消息 -->
    <!-- 确定为文字消息且当前发送人id确保为登陆人id -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image :src="store.user?.avatar" />
    </div>

    <!-- 5. 接收文字：医生发的消息 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && store.user?.id !== from">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>
    <!-- 6. 发送图片 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgImage && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <!-- 在每次加载图片之后都将页面滚动到最底部 -->
        <!-- 使用@load方法 -->
        <van-image @load="loadSuccess()" fit="contain" :src="msg.picture?.url" />
      </div>
      <van-image :src="store.user?.avatar" />
    </div>
    <!-- 7. 接收图片 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgImage && store.user?.id !== from">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image @load="loadSuccess()" fit="contain" :src="msg.picture?.url" />
      </div>
    </div>
    <!-- 8. 处方消息 -->
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <!-- 传入处方id -->
            <p @click="showPrescription(msg.prescription?.id)">
              原始处方 <van-icon name="arrow"></van-icon>
            </p>
          </div>
          <p>
            {{ msg.prescription?.name }}
            {{ msg.prescription?.genderValue }}
            {{ msg.prescription?.age }}岁
            {{ msg.prescription?.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription?.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="med in msg.prescription?.medicines" :key="med.id">
            <div class="durg">
              <p>{{ med.name }} {{ med.specs }}</p>
              <p>{{ med.usageDosag }}</p>
            </div>
            <div class="num">x{{ med.quantity }}</div>
          </div>
        </div>
        <div class="foot"><span @click="buy(msg.prescription)">购买药品</span></div>
      </div>
    </div>
    <!-- 9. 订单取消/关闭诊室 -->
    <div class="msg msg-tip msg-tip-cancel" v-if="msgType === MsgType.NotifyCancel">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 10. 医生评价 -->
    <div class="msg" v-if="msgType === MsgType.CardEva || msgType === MsgType.CardEvaForm">
      <!-- 传入已经评价过的数据进行回显 -->
      <evaluate-card :evaluateDoc="msg.evaluateDoc"></evaluate-card>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.msg {
  display: flex;
  padding: 15px;
  // 医生消息+图片
  &-from {
    .content {
      max-width: 240px;
      min-width: 52px;
      .time {
        color: var(--cp-tip);
        margin-bottom: 5px;
      }
      .pao {
        padding: 15px;
        background-color: #fff;
        color: var(--cp-text3);
        font-size: 15px;
        border-radius: 8px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: -13px;
          top: 10px;
          width: 13px;
          height: 16px;
          background: #fff;
          border-top-left-radius: 13px 3px;
        }
        &::after {
          content: '';
          position: absolute;
          left: -13px;
          top: 13px;
          width: 13px;
          height: 13px;
          background: var(--cp-bg);
          border-top-right-radius: 13px 13px;
        }
      }
      .van-image {
        max-height: 160px;
        max-width: 160px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--cp-line);
      }
    }
    > .van-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 13px;
    }
  }
  // 患者消息+图片
  &-to {
    justify-content: flex-end;
    .content {
      max-width: 240px;
      min-width: 52px;
      .time {
        color: var(--cp-tip);
        margin-bottom: 5px;
        text-align: right;
      }
      .pao {
        padding: 15px;
        background-color: var(--cp-primary);
        color: #fff;
        font-size: 15px;
        border-radius: 8px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          right: -13px;
          top: 10px;
          width: 13px;
          height: 16px;
          background: var(--cp-primary);
          border-top-right-radius: 13px 3px;
        }
        &::after {
          content: '';
          position: absolute;
          right: -13px;
          top: 13px;
          width: 13px;
          height: 13px;
          background: var(--cp-bg);
          border-top-left-radius: 13px 13px;
        }
      }
      .van-image {
        max-height: 160px;
        max-width: 160px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--cp-line);
      }
    }
    > .van-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 13px;
    }
  }
  &-tip {
    justify-content: center;
    font-size: 12px;
    .content {
      height: 34px;
      line-height: 34px;
      background-color: #fff;
      color: var(--cp-tip);
      font-size: 12px;
      border-radius: 17px;
      padding: 0 16px;
      max-width: 100%;
      .green {
        color: var(--cp-primary);
      }
    }
    &-cancel {
      .content {
        background-color: #ededed;
      }
    }
  }
  &-illness {
    display: block;
    background-color: #fff;
    margin: 15px;
    border-radius: 8px;
    font-size: 12px;
    .patient {
      padding-bottom: 15px;
      margin-bottom: 15px;
      > p {
        &:first-child {
          font-size: 16px;
        }
        &:last-child {
          margin-top: 5px;
          color: var(--cp-tip);
        }
      }
    }
    .van-col {
      &:nth-child(-n + 2) {
        margin-bottom: 5px;
      }
      &:nth-child(2n) {
        color: var(--cp-tip);
      }
    }
  }
  &-recipe {
    padding: 15px;
    .content {
      background-color: #fff;
      border-radius: 8px;
      color: var(--cp-tip);
      font-size: 12px;
      flex: 1;
      .head {
        padding: 15px;
        .head-tit {
          display: flex;
          justify-content: space-between;
          > h3 {
            font-weight: normal;
            font-size: 16px;
            color: var(--cp-text1);
          }
        }
        p {
          margin-top: 5px;
        }
      }
      .body {
        padding: 15px 15px 0 15px;
        &-item {
          display: flex;
          margin-bottom: 15px;
          .durg {
            flex: 1;
            > p {
              &:first-child {
                font-size: 14px;
                color: var(--cp-text1);
                margin-bottom: 5px;
              }
            }
          }
          .num {
            color: var(--cp-text1);
          }
        }
      }
      .foot {
        background-color: var(--cp-plain);
        color: var(--cp-primary);
        font-size: 16px;
        text-align: center;
        height: 42px;
        line-height: 42px;
      }
    }
  }
}
</style>
