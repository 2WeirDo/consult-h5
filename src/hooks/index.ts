// 放置全局可复用的钩子函数

import { followDoctor } from '@/api/consult'
import { ref, watch } from 'vue'
import type { FollowType } from '@/types/consult'
import { getPrescriptionPic } from '@/api/consult'
import { showImagePreview } from 'vant'
import { useClipboard } from '@vueuse/core' // 使用vueuse
import { showSuccessToast, showFailToast } from 'vant'

// 关注医生或文章逻辑
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

// 查看处方
const useShowPrescription = () => {
  const showPrescription = async (id?: string) => {
    if (id) {
      const res = await getPrescriptionPic(id)
      showImagePreview([res.url])
    }
  }
  return { showPrescription }
}

// 复制文本
const useCopy = () => {
  const { copy, copied, isSupported } = useClipboard()

  // 1. 复制回调
  const onCopy = (copyText: string) => {
    // isSupported判断浏览器是否支持复制
    if (!isSupported.value) showFailToast('未授权, 不支持')
    copy(copyText || '')
  }
  // 2. 复制后提示
  watch(copied, () => {
    // 注意传入的是响应式变量, 而不是.value值
    if (copied.value) showSuccessToast('已复制') // 为true则复制成功
  })
  return { onCopy }
}

export { useFollow, useShowPrescription, useCopy }
