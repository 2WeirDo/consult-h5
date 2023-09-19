import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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

export default router
