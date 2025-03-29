import App from './App.vue'
import { createSSRApp } from 'vue'
import config from './config'
import store from './store'
import './uni.promisify.adaptor'

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
  
  // 全局注册组件
  app.component('uni-popup', uniPopup)
  
  return {
    app
  }
}