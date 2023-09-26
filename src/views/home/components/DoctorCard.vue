<script lang="ts" setup>
import type { Doctor } from '@/types/consult'
import { followDoctor } from '@/api/consult'
import { ref } from 'vue'
defineProps<{ item: Doctor }>()

// 关注逻辑
const loading = ref(false)
const follow = async (doc: Doctor) => {
  // 防止重复点击
  // 组件规定为true的时候点击才有效
  loading.value = true
  try {
    // 这儿后端它没有存储数据, 我们知道就行了
    await followDoctor(doc.id)
    // likeFlag决定显示的是已关注还是关注
    doc.likeFlag = doc.likeFlag === 1 ? 0 : 1
  } finally {
    // 无论 try / catch 结果如何都会执行的代码块
    loading.value = false
  }
}
</script>
<template>
  <div class="doctor-card">
    <van-image round :src="item.avatar" />
    <p class="name">{{ item.name }}</p>
    <p>{{ item.hospitalName }} {{ item.depName }}</p>
    <p>{{ item.positionalTitles }}</p>
    <van-button
      round
      size="small"
      type="primary"
      :loading="loading"
      @click="follow(item)"
      :class="{ liked: item.likeFlag === 1 }"
    >
      {{ item.likeFlag === 1 ? '已关注' : '+ 关注' }}
    </van-button>
  </div>
</template>
<style scoped lang="scss">
.doctor-card {
  width: 135px;
  // height: 190px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 11px 0px rgba(229, 229, 229, 0.2);
  text-align: center;
  padding: 15px;
  margin-left: 15px;
  display: inline-block;
  box-sizing: border-box;

  .liked {
    background-color: rgb(194, 194, 194);
    border-color: rgb(194, 194, 194);
  }
  > .van-image {
    width: 58px;
    height: 58px;
    vertical-align: top;
    border-radius: 50%;
    margin: 0 auto 8px;
  }
  > p {
    margin-bottom: 0;
    font-size: 11px;
    color: var(--cp-tip);
    &.name {
      font-size: 13px;
      color: var(--cp-text1);
      margin-bottom: 5px;
    }
  }
  > .van-button {
    padding: 0 12px;
    height: 28px;
    margin-top: 8px;
    width: 72px;
  }
}
</style>
