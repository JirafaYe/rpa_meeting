// 应用配置
const config = {
  // 应用名称
  appName: 'RPA会议系统',
  
  // API基础URL - 设置后端API地址
  apiBaseUrl: 'http://182.92.115.169:8080',
  
  // 是否开启调试模式
  debug: {
    // 总开关，是否开启调试模式
    enabled: process.env.NODE_ENV === 'development',
    // 是否显示页面路径日志
    showPageLog: false,
    // 是否显示页面栈信息
    showPageStack: false,
    // 是否显示网络请求日志
    showNetworkLog: false,
    // 是否显示控制台警告信息
    showWarnings: false
  },
  
  // 默认页面路径
  defaultPage: '/pages/user/schedule',
  
  // 登录页面路径
  loginPage: '/pages/user/login',
  
  // 管理员登录页面路径
  adminLoginPage: '/pages/admin/login',
  
  // 上传文件配置
  upload: {
    // 文件大小限制（单位MB）
    maxSize: 10,
    // 允许上传的文件类型
    acceptFileTypes: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'jpg', 'jpeg', 'png', 'txt']
  },
  
  // 会议配置
  meeting: {
    // 预约会议的最小提前时间（单位分钟）
    minAdvanceTime: 30,
    // 会议最小时长（单位分钟）
    minDuration: 15,
    // 会议最大时长（单位分钟）
    maxDuration: 240
  },
  
  // 应用版本
  version: '1.0.0',
  
  // 请求超时设置（毫秒）
  requestTimeout: 30000,
  
  // 网络配置
  network: {
    // 重试次数
    retryCount: 3,
    // 重试间隔（毫秒）
    retryDelay: 1000,
    // 是否显示网络错误提示
    showErrorToast: true
  }
};

// 不再需要这个变量，直接使用config.apiBaseUrl
// const BASE_URL = config.apiBaseUrl || 'http://localhost:3000';

export default config; 