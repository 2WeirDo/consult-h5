// 配置路由规则
const routes = [
  // tabBar页面
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/home',
    children: [
      { path: '/home', component: () => import('@/views/home/index.vue'), meta: { title: '首页' } },
      {
        path: '/article',
        component: () => import('@/views/article/index.vue'),
        // 路由元信息作用 => 给路由添加数据
        meta: { title: '健康百科' }
      },
      {
        path: '/notify',
        component: () => import('@/views/notify/index.vue'),
        meta: { title: '消息通知' }
      },
      {
        path: '/user',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  // 测试页面
  {
    path: '/test',
    component: () => import('@/views/test/index.vue')
  }
]

export default routes
