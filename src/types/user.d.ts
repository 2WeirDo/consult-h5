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
