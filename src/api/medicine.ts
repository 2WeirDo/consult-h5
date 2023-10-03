import type { OrderPre, AddressItem, OrderDetail } from '@/types/medicine'
import { request } from '@/utils/request'

// 查询药品订单预支付信息
export const getMedicalOrderPre = (params: { prescriptionId: string }) =>
  request.get<any, OrderPre>('/patient/medicine/order/pre', { params })

// 获取收货地址列表
export const getAddressList = () => request.get<any, AddressItem[]>('/patient/order/address')

// 创建药品订单
export const createMedicalOrder = (data: { id: string; addressId: string; couponId?: string }) =>
  request.post<any, { id: string }>('/patient/medicine/order', data)

// 获取药品订单详情
export const getMedicalOrderDetail = (id: string) =>
  request.get<any, OrderDetail>(`/patient/medicine/order/detail/${id}`)
