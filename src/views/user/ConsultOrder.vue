<script setup lang="ts">
import ConsultList from './components/ConsultList.vue'
import { ConsultType } from '@/enums'
</script>

<template>
  <div class="consult-page">
    <!-- 1.导航栏 -->
    <cp-nav-bar title="问诊记录" />
    <!-- 页签组件 -->
    <van-tabs sticky>
      <!-- 开发极速问诊 type = 2 -->
      <van-tab title="极速问诊"><consult-list :type="ConsultType.Fast" /></van-tab>
      <van-tab title="找医生"><consult-list :type="ConsultType.Doctor" /></van-tab>
      <van-tab title="开药问诊"><consult-list :type="ConsultType.Medication" /></van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.consult-page {
  padding-top: 46px;
  background-color: var(--cp-bg);
  min-height: calc(100vh - 46px);
}
</style>
