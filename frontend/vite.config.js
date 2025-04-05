import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '~@': path.resolve(__dirname, '.')
    }
  },
  build: {
    target: 'es2015',
    minify: false,
    cssCodeSplit: true,
    brotliSize: false,
    // 确保ES模块能正常工作
    modulePreload: {
      polyfill: true
    }
  },
  // 定义环境变量
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  server: {
    cors: true
  }
}) 