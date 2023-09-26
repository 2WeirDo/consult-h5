import { createPinia } from 'pinia'
// 导入持久化插件
import persistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 注册持久化插件
pinia.use(persistedstate)

export default pinia

// 对modules中store仓库做统一导出
// (以后再导入store的时候就省几个字符串hhh)
export * from './modules/user'

export * from './modules/consult'
