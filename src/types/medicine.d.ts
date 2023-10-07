import type { Medical } from './room' // 从问诊室导入药品类型
// 药品预订单数据
export type OrderPre = {
  id: string
  couponId: string
  pointDeduction: number
  couponDeduction: number
  payment: number
  expressFee: number
  actualPayment: number
  medicines: Medical[]
}
// 地址信息
export type Address = {
  id: string
  mobile: string
  receiver: string
  province: string
  city: string
  county: string
  addressDetail: string
}

// 收货地址
export type AddressItem = Address & {
  isDefault: 0 | 1
  postalCode: string
}

// 药品订单详情
export type OrderDetail = {
  id: string
  orderNo: string
  type: 4
  createTime: string
  prescriptionId: string
  status: OrderType
  statusValue: string
  medicines: Medical[]
  countDown: number
  addressInfo: Address
  expressInfo: {
    content: string
    time: string
  }
  payTime: string
  paymentMethod?: 0 | 1
  payment: number
  pointDeduction: number
  couponDeduction: number
  payment: number
  expressFee: number
  actualPayment: number
  roomId: string
}

// 物流日志item
export type Log = {
  id: string
  content: string
  createTime: string
  status: number // 订单派送状态：1已发货 2已揽件 3 运输中 4 派送中 5已签收
  statusValue: string
}
// 经纬度
export type Location = {
  longitude: string
  latitude: string
}
// data数据
export type Express = {
  estimatedTime: string
  name: string
  awbNo: string
  status: ExpressStatus
  statusValue: string
  list: Log[]
  logisticsInfo: Location[]
  currentLocationInfo: Location
}
