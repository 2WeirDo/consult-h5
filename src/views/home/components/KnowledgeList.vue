<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import { getKnowledgePage } from '@/api/consult'
import type { KnowledgeType, KnowledgeList, KnowledgeParams } from '@/types/consult'

// 接收参数
const props = defineProps<{
  type: KnowledgeType
}>()

// 获取文章列表
const list = ref<KnowledgeList>([])
const loading = ref(false)
const finished = ref(false)

// 请求的分页参数
const params = ref<KnowledgeParams>({
  type: props.type, // 频道类型值
  current: 1, // 当前页码
  pageSize: 10 // 每页多少条数据
})

const onLoad = async () => {
  // 加载更多
  const res = await getKnowledgePage(params.value)
  // 先展开再push, 不然就是push一个数组了
  list.value.push(...res.rows)
  // 判断列表数据是否加载完成
  if (params.value.current >= res.pageTotal) {
    finished.value = true
  } else {
    // 数据未加载完, 后续会请求下一页, 我们将页码加一
    params.value.current++
  }
  // 加载完成, 关闭loading
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <!-- 瀑布流滚动加载，用于展示长列表，当列表即将滚动到底部时，会触发事件并加载更多列表项。 -->
    <!-- 当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true -->
    <!-- 此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
