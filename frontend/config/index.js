/**
 * 全局配置文件
 */

// 全局配置
const config = {
  // API基础URL, 本地mock模式下为空
  apiBaseUrl: '',
  // 备用外部API: 'https://mock.apifox.cn/m1/3233455-0-default',
  
  // 启用mock模式
  enableMock: true,
  
  // 当前运行的环境
  env: process.env.NODE_ENV || 'development',
  
  // 调试选项
  debug: {
    // 是否显示详细错误信息
    verbose: true,
    
    // 是否在控制台记录请求
    logRequests: true,
    
    // 网络请求超时时间（毫秒）
    timeout: 15000
  },
  
  // 应用基本信息
  app: {
    name: '会议室预定系统',
    version: '1.0.0',
    logo: '/static/images/logo.png'
  },
  
  // 上传文件的最大大小 (MB)
  maxFileSize: 10,
  
  // 会议室预定相关配置
  booking: {
    // 预定时间间隔 (分钟)
    timeInterval: 30,
    
    // 最长预定时间 (小时)
    maxDuration: 4,
    
    // 可提前预定的最长时间 (天)
    maxAdvanceDays: 30
  }
}

export default config 