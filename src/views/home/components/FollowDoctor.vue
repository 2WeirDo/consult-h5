<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
import { onMounted, ref } from 'vue'
import type { DoctorList } from '@/types/consult'
import { getDoctorPage } from '@/api/consult'

// 轮播图尺寸自适应
// 1.普通方法
// const width = ref(375)
// onMounted(() => {
//   // 通过window.innerWidth获取手机屏幕宽度
//   width.value = window.innerWidth
//   // 发生变化的时候也要跟着变, 达到自适应的目的
//   window.addEventListener('resize', () => {
//     width.value = window.innerWidth
//   })
// })
// 2.vueUse插件
import { useWindowSize } from '@vueuse/core'
// 获取的就是响应式的
const { width } = useWindowSize()

// 获取关注的医生
const list = ref<DoctorList>()
const loadData = async () => {
  const res = await getDoctorPage({ current: 1, pageSize: 5 })
  list.value = res.rows
}
onMounted(() => loadData())
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 : 提供滑动 -->
      <!-- 宽度需要根据屏幕宽度做自适应 -->
      <van-swipe
        :width="(150 / 375) * width"
        :autoplay="2500"
        :show-indicators="false"
        :loop="true"
      >
        <van-swipe-item v-for="item in list" :key="item.id">
          <doctor-card :item="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  // height: 250px;
  padding-bottom: 20px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
