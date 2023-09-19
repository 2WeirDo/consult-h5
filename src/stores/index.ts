import { createPinia } from 'pinia'
// 导入持久化插件
import persistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 注册持久化插件
pinia.use(persistedstate)

export default pinia
