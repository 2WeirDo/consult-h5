// 用户相关TS类型

// 1.登录接口返回数据类型
export type User = {
  token: string
  id: string
  account: string
  mobile: string
  avatar: string
}

// 短信验证码类型(字面量类型)
export type CodeType = 'login' | 'register'

// Pick 可以从一个对象类型中 取出某些属性
// Omit 可以从一个对象类型中 排出某些属性
type OmitUser = Omit<User, 'token'>

// 个人信息-交叉类型
export type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}

// 家庭档案-患者信息
export type Patient = {
  id?: string
  name: string
  idCard: string
  defaultFlag: 0 | 1
  gender: number
  genderValue?: string
  age?: number
}

// 家庭档案-患者信息列表
export type PatientList = Patient[]
