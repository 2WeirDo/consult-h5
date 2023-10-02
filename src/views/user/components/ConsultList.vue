<script setup lang="ts">
import type { ConsultType } from '@/enums'
import { getConsultOrderList } from '@/api/consult'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { ref } from 'vue'
import ConsultItem from './ConsultItem.vue'

const props = defineProps<{ type: ConsultType }>() // 获取订单类型
const params = ref<ConsultOrderListParams>({
  // 定义要传入api的参数(请求分页参数)
  type: props.type,
  current: 1,
  pageSize: 5
})
const loading = ref(false) // 列表加载状态
const finished = ref(false) // 列表是否加载完成
// 列表数据
const list = ref<ConsultOrderItem[]>([])

// 滚动到底部加载方法
// 默认页面加载会执行一次(有数据情况下 => 不够一屏会再次加载)
// 用户每次滚动到上次数据的底部 => 会再次执行(再加载一页数据)
const onLoad = async () => {
  const res = await getConsultOrderList(params.value)
  list.value.push(...res.rows) // 追加当前页的数据到列表中去
  // 如果没有拿完数据, 页码加一, 可进行下次请求
  if (params.value.current < res.pageTotal) {
    params.value.current++
  } else {
    // 数据拿完, finished置为true
    finished.value = true
  }
  // 关闭loading效果
  loading.value = false
}

// 根据传入订单id删除订单
const onDelete = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="诶~没有更多了~~"
      @load="onLoad"
    >
      <consult-item v-for="item in list" :key="item.id" :item="item" @on-delete="onDelete" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
