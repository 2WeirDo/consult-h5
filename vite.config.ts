import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// vant按需引入
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

// 导入打包精灵图插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig({
  // base: '/服务器中放置打包代码的目录名'
  base: '/consult/',
  plugins: [
    vue({
      reactivityTransform: true // 允许对父传子props解构时保留响应式
    }),
    Components({
      resolvers: [VantResolver()], // vant按需引入 => 项目下scr/components中的组件也会被自动全局注册, 因此不用导入
      dts: false // 关闭自动生成类型声明文件(不需要了, 已经有了)
    }),
    // 配置打包精灵图svg图片的位置
    createSvgIconsPlugin({
      // 指定图标文件夹，绝对路径（NODE代码）
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
      /**
       * 之后svg的使用方式:
       * <svg aria-hidden="true">
            <!-- #icon-文件夹名称-图片名称 -->
            <use href="#icon-login-eye-off" />
         </svg>
       */
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
