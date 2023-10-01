// 问诊室类型声明文件

import { MsgType, PrescriptionStatus } from '@/enums'
import type { Consult, Image } from './consult'
import type { Patient } from './user'

// 1. 聊天-消息中包含处方和药品类型
// 药品
export type Medical = {
  id: string
  name: string
  amount: string
  avatar: string
  specs: string
  // 用量
  usageDosag: string
  quantity: string
  // 是否是处方药
  prescriptionFlag: 0 | 1
}
// 处方
export type Prescription = {
  id: string
  orderId: string
  createTime: string
  name: string
  recordId: string
  gender: 0 | 1
  genderValue: string
  age: number
  // 诊断信息
  diagnosis: string
  status: PrescriptionStatus
  // 药品订单
  medicines: Medical[]
}

// 2. 聊天-评价医生
export type EvaluateDoc = {
  id?: string
  score?: number
  content?: string
  createTime?: string
  creator?: string
}

// 3. 聊天-消息类型
// 消息类型：聊天-接收对话信息api
export type Message = {
  id: string
  msgType: MsgType
  // 发消息的人ID
  from?: string
  fromAvatar?: string
  // 收消息的人ID
  to?: string
  toAvatar?: string
  createTime: string
  // 具体消息内容
  msg: {
    // 文字类型
    content?: string
    // 图片类型
    picture?: Image
    // 患者卡片
    consultRecord?: Consult & {
      patientInfo: Patient
    }
    // 处方信息
    prescription?: Prescription
    // 评价信息
    evaluateDoc?: EvaluateDoc
  }
}

// 消息分组：聊天-查询历史聊天记录api
export type TimeMessages = {
  createTime: string
  items: Message[]
  orderId: string
  sid: string
}
