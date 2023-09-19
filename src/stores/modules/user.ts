import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'

/**
 * 用户store: 存储登录用户相关数据
 */

export const useUserStore = defineStore('cp-user', () => {
  // 空对象的变量通过 as 断言指定类型
  const user = ref({} as User)

  // 存储用户信息 => 登录成功
  const setUser = (userData: User) => {
    user.value = userData
  }
  // 删除用户信息 => 退出登录
  const delUser = () => {
    user.value = {} as User
  }

  // 返回变量和方法
  return {
    user,
    setUser,
    delUser
  }
})
