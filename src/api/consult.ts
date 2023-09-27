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
  ConsultOrderPreParams
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
