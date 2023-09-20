import type { User } from '@/types/user'
import { request } from '@/utils/request'

// 密码登录
export const loginByPassword = (mobile: string, password: string) => {
  // User是定义返回数据的类型
  return request.post<any, User>('/login/password', { mobile, password })
}
