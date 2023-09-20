import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import routes from './routes'

const router = createRouter({
  /**
   * 说明：项目部署 => 项目开发完了，打包 => dist目录
   * 1. 把dist代码放到服务器根目录（root）=> import.meta.env.BASE_URL 不需要设置
   * 2. 没有把dist代码放到服务器根目录（root）=> 例如：放到root/consult-h5 =>  在vite.config.ts  添加配置 =>  base: /consult-h5/
   */
  history: createWebHistory(import.meta.env.BASE_URL), // import.meta.env.BASE_URL是路由的的基准地址, 默认是 '/'
  routes
})

// 访问权限控制
// 加一个前置路由守卫
router.beforeEach((to) => {
  // 给页面动态添加title
  document.title = `在线问诊-${to.meta.title || '无title'}`

  // 用户仓库
  const store = useUserStore()
  // 不需要登录的页面，白名单
  const wihteList = ['/login', 'register']
  // 如果没有登录且不在白名单内，去登录
  // 这里也可以不加可选链, 因为在store中 : ref({} as User) 是通过断言来指定的类型, 有初始值并非空对象, 不会报错
  if (!store.user?.token && !wihteList.includes(to.path)) return '/login'
  // 否则不做任何处理
})
export default router
