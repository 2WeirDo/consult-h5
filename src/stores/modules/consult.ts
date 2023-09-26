import type { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 1. 问诊记录数据
    const consult = ref<PartialConsult>({})
    // 2. 设置问诊类型
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 3. 设置极速问诊级别
    const setIllnessType = (type: 0 | 1) => (consult.value.illnessType = type)
    // 4. 设置科室
    const setDep = (id: string) => (consult.value.depId = id)
    // 5. 设置病情描述
    const setIllness = (
      // 通过Pick内置泛型工具将所选类型取出来, (只取某几个字段)
      illness: Pick<PartialConsult, 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'>
    ) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 6. 设置患者
    const setPatient = (id: string) => (consult.value.patientId = id)
    // 7. 设置优惠券
    // const setCunpon = (id?: string) => (consult.value.couponId = id)
    // 8. 清空记录
    const clear = () => (consult.value = {})

    return { consult, setType, setIllnessType, setDep, setIllness, setPatient, clear }
  },
  {
    persist: true
  }
)
