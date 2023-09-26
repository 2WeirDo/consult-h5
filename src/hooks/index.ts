// 放置全局可复用的钩子函数

// 关注逻辑复用
import { followDoctor } from '@/api/consult'
import { ref } from 'vue'
import type { FollowType } from '@/types/consult'
const useFollow = (type: FollowType = 'doc') => {
  // 关注逻辑
  const loading = ref(false)
  const follow = async (doc: { id: string; likeFlag: 0 | 1 }) => {
    // 防止重复点击
    // 组件规定为true的时候点击才有效
    loading.value = true
    try {
      // 这儿后端它没有存储数据, 我们知道就行了
      await followDoctor(doc.id, type)
      // likeFlag决定显示的是已关注还是关注
      doc.likeFlag = doc.likeFlag === 1 ? 0 : 1
    } finally {
      // 无论 try / catch 结果如何都会执行的代码块
      loading.value = false
    }
  }
  return { loading, follow }
}

export { useFollow }
