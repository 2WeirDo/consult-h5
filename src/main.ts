import { createApp } from 'vue'
import pinia from './stores/index'
import App from './App.vue'
import router from './router'

// 导入全局样式
import '@/styles/main.scss'

// 注册svg图标
import 'virtual:svg-icons-register'

// 引入vant反馈组件样式
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/toast/style'
import 'vant/es/image-preview/style'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
