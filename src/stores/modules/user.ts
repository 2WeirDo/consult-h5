import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'

/**
 * 用户store: 存储登录用户相关数据
 */

export const useUserStore = defineStore(
  'cp-user',
  () => {
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
  },
  // 方式一: 默认存储所有数据, 以store的ID作为存储的key
  // {
  //   persist: true // 开启数据持久化
  // }
  // 方式二: 自定义存储的key, 指定存储哪些数据
  {
    persist: {
      key: 'cp-user', // 这里我们不变
      paths: ['user'] // 数组内放入的变量名都会持久化存储, 这里我们就只存了user
    }
  }
)
