import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
const routes = [
  // tabBar页面
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/home',
    children: [
      { path: '/home', component: () => import('@/views/home/index.vue') },
      { path: '/article', component: () => import('@/views/article/index.vue') },
      { path: '/notify', component: () => import('@/views/notify/index.vue') },
      { path: '/user', component: () => import('@/views/user/index.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
  },
  // 测试页面
  {
    path: '/test',
    component: () => import('@/views/test/index.vue')
  }
]

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
// 少提交了一次
router.beforeEach((to, from) => {
  // 用户仓库
  const store = useUserStore()
  // 不需要登录的页面，白名单
  const wihteList = ['/login', 'register']
  // 如果没有登录且不在白名单内，去登录
  if (!store.user?.token && !wihteList.includes(to.path)) return '/login'
  // 否则不做任何处理
})
export default router
