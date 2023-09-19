import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// vant按需引入
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

export default defineConfig({
  // base: '/服务器中放置打包代码的目录名'
  plugins: [
    vue({
      reactivityTransform: true // 允许对父传子props解构时保留响应式
    }),
    Components({
      resolvers: [VantResolver()], // vant按需引入
      dts: false // 关闭自动生成类型声明文件(不需要了, 已经有了)
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
