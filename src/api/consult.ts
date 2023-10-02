// 存放看病的相关接口

import type {
  KnowledgePage,
  KnowledgeParams,
  DoctorPage,
  PageParams,
  FollowType,
  TopDep,
  Image,
  ConsultOrderPreData,
  ConsultOrderPreParams,
  PartialConsult,
  ConsultOrderItem,
  ConsultOrderListParams,
  ConsultOrderPage
} from '@/types/consult'

import { request } from '@/utils/request'

export const getKnowledgePage = (params: KnowledgeParams) =>
  request.get<any, KnowledgePage>('/patient/home/knowledge', { params })

export const getDoctorPage = (params: PageParams) =>
  request.get<any, DoctorPage>('/home/page/doc', { params })

// 传入类型的默认值
export const followDoctor = (id: string, type: FollowType = 'doc') =>
  request.post('/like', { id, type })

// 获取所有科室信息
export const getAllDep = () => request.get<any, TopDep[]>('/dep/all')

// 上传病情描述图片
export const uploadImage = (file: File) => {
  const fd = new FormData()
  // 说明：formData对象的key属性值后台定义
  fd.append('file', file)
  return request.post<any, Image>('/upload', fd)
}

// 拉取预支付订单信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request.get<any, ConsultOrderPreData>('/patient/consult/order/pre', { params })

// 生成问诊订单
export const createConsultOrder = (data: PartialConsult) =>
  request.post<any, { id: string }>('/patient/consult/order', data)

// 获取支付地址  0 是微信  1 支付宝
export const getConsultOrderPayUrl = (data: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request.post<any, { payUrl: string }>('/patient/consult/pay', data)

// 获取订单详情数据
export const getConsultOrderDetail = (orderId: string) =>
  request.get<any, ConsultOrderItem>('/patient/consult/order/detail', { params: { orderId } })

// 评价问诊
export const evaluateConsultOrder = (data: {
  docId: string // 医生ID
  orderId: string // 订单ID
  score: number // 评价星级
  content: string // 评价留言
  anonymousFlag: 0 | 1 // 是否匿名评价：1匿名 0实名
}) => request.post('/patient/order/evaluate', data)

// 查看处方
export const getPrescriptionPic = (id: string) =>
  request.get<any, { url: string }>(`/patient/consult/prescription/${id}`)

// 获取问诊订单记录列表
export const getConsultOrderList = (params: ConsultOrderListParams) =>
  request.get<any, ConsultOrderPage>('/patient/consult/order/list', { params })
