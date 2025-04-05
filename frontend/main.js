import App from './App.vue'
import { createSSRApp } from 'vue'
import config from './config'
import store from './store'
import './uni.promisify.adaptor'
// 移除 Vue Router 的导入，因为uni-app已经内置了路由系统
// import router from './router'

// 引入页面路径日志工具
import { pageLoggerMixin } from './utils/page-logger.js'

// 引入自定义组件
import uniPopup from './components/uni/popup.vue'

// 设置应用类型
App.mpType = 'app'

// 创建应用实例
export function createApp() {
  const app = createSSRApp(App)
  
  // 全局配置
  app.config.globalProperties.$config = config
  
  // 导入Store
  app.use(store)
  
  // 移除Vue Router的使用
  // app.use(router)
  
  // 全局混入页面日志功能
  app.mixin(pageLoggerMixin)
  
  // 全局注册组件
  app.component('uni-popup', uniPopup)
  
  // 全局错误处理
  app.config.errorHandler = (err, instance, info) => {
    console.error('[全局错误]', err)
    console.error('错误信息:', info)
  }
  
  return {
    app
    // 移除router导出
    // router
  }
}