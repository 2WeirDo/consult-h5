import type { User, CodeType } from '@/types/user'
import { request } from '@/utils/request'

// 说明 : 通过request.method<指定data数据类型>
// 密码登录
export const loginByPassword = (mobile: string, password: string) => {
  // User是定义返回数据的类型
  // post请求传递data可以直接{}传递
  return request.post<any, User>('/login/password', { mobile, password })
}

// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) => {
  // 注意get请求传递Query参数格式
  return request.get<any, { code: string }>('/code', { params: { mobile, type } })
}

export const loginByMobile = (mobile: string, code: string) => {
  return request.post<any, User>('/login', { mobile, code })
}
