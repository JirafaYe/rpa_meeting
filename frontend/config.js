// 应用配置
const config = {
  // 应用名称
  appName: 'RPA会议系统',
  
  // API基础URL - 设置默认值避免file协议错误
  apiBaseUrl: '/api',
  
  // 是否开启调试模式
  debug: process.env.NODE_ENV === 'development',
  
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

  // 是否启用模拟数据
  enableMock: true,
  
  // 开发模式自动登录配置
  autoLogin: {
    // 是否启用自动登录（默认在开发环境下启用）
    enabled: process.env.NODE_ENV === 'development',
    // 自动登录使用的用户名
    username: 'user',
    // 自动登录使用的密码
    password: 'user123'
  },
  
  // 应用版本
  version: '1.0.0'
};

// 根据环境设置BASE_URL
const BASE_URL = config.apiBaseUrl || 'http://localhost:3000';

export default config; 