<script setup lang="ts">
import { getAllDep } from '@/api/consult'
import type { TopDep } from '@/types/consult'
import { onMounted, ref, computed } from 'vue'
import { useConsultStore } from '@/stores'

const store = useConsultStore()

// active决定当前选中的一级科室
const active = ref(0)

// 获取所有科室数据
const allDep = ref<TopDep[]>([])
const getAllDepApi = async () => {
  const res = await getAllDep()
  allDep.value = res
}
onMounted(() => {
  getAllDepApi()
})
// 二级科室，注意：组件初始化没有数据 child 可能拿不到(因为allDep也是异步请求的数据, 默认为[])
// 注意这里用到computed, 且省略了{}, 否则要加return
const subDep = computed(() => allDep.value[active.value]?.child)
</script>

<template>
  <!-- 2. 极速问诊-选择科室 -->
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <!-- 一级科室 -->
      <van-sidebar v-model="active">
        <!-- 这里要是一级科室后没有二级科室我们就不渲染, 但这里不知道为什么不行 -->
        <!-- <template v-for="top in allDep">
          <van-sidebar-item v-if="top.child.length !== 0" :title="top.name" :key="top.id" />
        </template> -->
        <van-sidebar-item v-for="top in allDep" :title="top.name" :key="top.id" />
      </van-sidebar>
      <!-- 二级科室: 跟随一级科室动态切换 -->
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          v-for="sub in subDep"
          :key="sub.id"
          @click="store.setDep(sub.id)"
        >
          {{ sub.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
}

.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
</style>
