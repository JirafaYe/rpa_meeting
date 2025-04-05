/**
 * 日志工具模块 - 用于统一控制应用日志输出
 */

// 日志级别配置
const LOG_CONFIG = {
  // 是否启用API请求日志
  API_LOGS: true,
  // 是否启用数据处理日志
  DATA_LOGS: false,
  // 是否启用UI组件日志
  UI_LOGS: false,
  // 是否启用调试日志
  DEBUG_LOGS: false,
  // 是否启用页面导航日志
  NAV_LOGS: false,
  // 是否启用Mock数据日志
  MOCK_LOGS: false
};

// 统一的日志对象，根据配置决定是否输出日志
const logger = {
  /**
   * API相关日志
   * @param {...any} args 日志参数
   */
  api(...args) {
    if (LOG_CONFIG.API_LOGS) {
      console.log('[API]', ...args);
    }
  },
  
  /**
   * 数据处理相关日志
   * @param {...any} args 日志参数
   */
  data(...args) {
    if (LOG_CONFIG.DATA_LOGS) {
      console.log('[DATA]', ...args);
    }
  },
  
  /**
   * UI相关日志
   * @param {...any} args 日志参数
   */
  ui(...args) {
    if (LOG_CONFIG.UI_LOGS) {
      console.log('[UI]', ...args);
    }
  },
  
  /**
   * 调试日志
   * @param {...any} args 日志参数
   */
  debug(...args) {
    if (LOG_CONFIG.DEBUG_LOGS) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  /**
   * 页面导航日志
   * @param {...any} args 日志参数
   */
  nav(...args) {
    if (LOG_CONFIG.NAV_LOGS) {
      console.log('[NAV]', ...args);
    }
  },
  
  /**
   * Mock数据相关日志
   * @param {...any} args 日志参数
   */
  mock(...args) {
    if (LOG_CONFIG.MOCK_LOGS) {
      console.log('[MOCK]', ...args);
    }
  },
  
  /**
   * 错误日志 - 不受配置影响，始终输出
   * @param {...any} args 日志参数
   */
  error(...args) {
    console.error('[ERROR]', ...args);
  },
  
  /**
   * 警告日志 - 不受配置影响，始终输出
   * @param {...any} args 日志参数
   */
  warn(...args) {
    console.warn('[WARN]', ...args);
  }
};

// 导出日志对象
export default logger; 