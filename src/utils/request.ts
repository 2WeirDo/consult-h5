import { useUserStore } from '@/stores'
import router from '@/router'
import axios from 'axios'
import { showFailToast } from 'vant'

// 1. 新axios实例，基础配置
const baseURL = 'https://consult-api.itheima.net/'
const request = axios.create({
  baseURL,
  timeout: 10000
})

// 2. 请求拦截器，携带token => 发请求之前
request.interceptors.request.use(
  (config) => {
    const store = useUserStore()
    if (store.user?.token) {
      config.headers.Authorization = `Bearer ${store.user.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 3. 响应拦截器，剥离无效数据，401拦截
request.interceptors.response.use(
  (res) => {
    // 后台约定，响应成功，但是code不是10000，是业务逻辑失败(后端自定义的)
    // HTTP返回的状态码都是200, 所以我们要用后端自定义的状态码
    if (res.data?.code !== 10000) {
      showFailToast(res.data.message)
      return Promise.reject(res.data)
    }
    // 业务逻辑成功，返回响应数据，作为axios成功的结果
    return res.data?.data
  },
  (err) => {
    if (err.response.status === 401) {
      // 删除用户信息
      const store = useUserStore()
      store.delUser()
      // 跳转登录，带上接口失效所在页面的地址，登录完成后回跳使用
      // router.currentRoute.value.fullPath 当前访问的页面(vue3 => currentRoute是一个ref变量, 要加上.value)
      // fullPath是全路径, 会带上网址上的参数, 而Path不会带上参数, 这里回跳地址用fullPath更合适(有可能需要用参数发请求之类)
      // 用于提升用户的交互体验, 让用户重新登录后跳转回上次的访问页面
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }
    return Promise.reject(err)
  }
)

export { baseURL, request }
