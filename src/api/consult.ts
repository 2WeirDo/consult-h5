// 存放看病的相关接口

import type {
  KnowledgePage,
  KnowledgeParams,
  DoctorPage,
  PageParams,
  FollowType
} from '@/types/consult'

import { request } from '@/utils/request'

export const getKnowledgePage = (params: KnowledgeParams) =>
  request.get<any, KnowledgePage>('/patient/home/knowledge', { params })

export const getDoctorPage = (params: PageParams) =>
  request.get<any, DoctorPage>('/home/page/doc', { params })

// 传入类型的默认值
export const followDoctor = (id: string, type: FollowType = 'doc') =>
  request.post('/like', { id, type })
