import { createApp } from 'vue'
import App from './App.vue'
import config from './config'
import store from './store'
import router from './router'

// 引入自定义组件
import uniPopup from './components/uni/popup.vue'

// 创建应用实例
const app = createApp(App)

// 全局配置
app.config.globalProperties.$config = config

// 导入Store
app.use(store)

// 导入Router
app.use(router)

// 全局注册组件
app.component('uni-popup', uniPopup)

// 判断平台并设置平台信息
let platformType = 'web';
let isApp = false;

// 检测是否为移动端
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  platformType = 'mobile';
  isApp = true;
}

// 存储平台信息
window.$platform = {
  type: platformType,
  isApp: isApp
}

console.log('当前平台:', platformType, isApp ? '(APP环境)' : '(H5环境)')

// 注入全局平台检测方法
app.config.globalProperties.$platform = window.$platform

// 挂载应用
app.mount('#app') 