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
  // 家庭档案
  {
    path: '/user/patient',
    component: () => import('@/views/user/PatientInfo.vue'),
    meta: { title: '家庭档案' }
  },
  {
    path: '/user/consult',
    component: () => import('@/views/user/ConsultOrder.vue'),
    meta: { title: '问诊记录' }
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/consult/fast',
    component: () => import('@/views/consult/ConsultFast.vue'),
    meta: { title: '极速问诊' }
  },
  {
    path: '/consult/dep',
    component: () => import('@/views/consult/ConsultDep.vue'),
    meta: { title: '选择科室' }
  },
  {
    path: '/consult/illness',
    component: () => import('@/views/consult/ConsultIllness.vue'),
    meta: { title: '病情描述' }
  },
  {
    path: '/consult/pay',
    component: () => import('@/views/consult/ConsultPay.vue'),
    meta: { title: '问诊支付' }
  },
  {
    path: '/room',
    component: () => import('@/views/room/index.vue'),
    meta: { title: '问诊室' }
  },
  {
    path: '/user/consult/:id',
    component: () => import('@/views/user/ConsultDetail.vue'),
    meta: { title: '问诊详情' }
  },
  {
    path: '/medicine/pay',
    component: () => import('@/views/medicine/OrderPay.vue'),
    meta: { title: '药品支付' }
  },
  {
    path: '/medicine/pay/result',
    component: () => import('@/views/medicine/OrderPayResult.vue'),
    meta: { title: '药品支付结果' }
  },
  // 测试页面
  {
    path: '/test',
    component: () => import('@/views/test/index.vue')
  }
]

export default routes
