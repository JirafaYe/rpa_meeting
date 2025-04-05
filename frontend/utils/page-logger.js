/**
 * 页面路径日志工具
 * 用于记录和显示当前页面的路径信息
 */

// 导入配置文件
import config from '../config';

// 样式配置
const logStyles = {
  page: 'color: #42b983; font-weight: bold; font-size: 12px;',
  path: 'color: #2c3e50; font-weight: bold; font-size: 12px;',
  title: 'color: #1890ff; font-weight: bold; font-size: 12px;',
  info: 'color: #7f8c8d; font-size: 12px;'
};

/**
 * 记录页面路径
 * @param {Object} options - 日志选项
 * @param {String} options.path - 页面路径
 * @param {String} options.title - 页面标题
 * @param {String} options.type - 生命周期类型 (onLoad, onShow, onHide, onUnload等)
 * @param {Object} options.query - 页面参数
 */
export const logPagePath = (options = {}) => {
  const { path, title, type = 'onShow', query = {} } = options;
  
  // 获取当前页面路由信息
  let currentPages = [];
  try {
    currentPages = getCurrentPages() || [];
  } catch (e) {
    console.error('获取页面栈失败:', e);
    // 不能获取页面栈，尝试从window.location获取路径(仅支持H5)
    try {
      const href = window.location.href;
      const pathname = window.location.pathname;
      console.log('[页面] 从location获取路径:', pathname);
      console.log('[页面] 完整URL:', href);
      
      return {
        path: pathname || '未知页面',
        query: query,
        title: title || '未知标题',
        pageStack: []
      };
    } catch (err) {
      console.error('获取location失败:', err);
    }
  }
  
  // 当前页面路径
  const currentPath = path || (currentPages.length > 0 ? currentPages[currentPages.length - 1].route : '未知页面');
  
  // 生成路径日志标题
  let pageTitle = '';
  let queryString = '';
  
  // 如果有查询参数，将其格式化为字符串
  if (query && Object.keys(query).length > 0) {
    queryString = '?' + Object.entries(query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  }
  
  // 格式化页面标题
  if (title) {
    pageTitle = title;
  } else if (currentPages.length > 0 && currentPages[currentPages.length - 1].$page) {
    pageTitle = currentPages[currentPages.length - 1].$page.fullPath || '无标题';
  }
  
  // 输出带样式的日志
  if (config && config.debug && config.debug.enabled && config.debug.showPageLog) {
    // console.log(
    //   `%c[页面] %c${currentPath}${queryString} %c${pageTitle || ''} %c(${type})`,
    //   logStyles.page,
    //   logStyles.path,
    //   logStyles.title,
    //   logStyles.info
    // );
  }
  
  // 输出页面栈信息
  if (currentPages.length > 0 && config && config.debug && config.debug.enabled && config.debug.showPageStack) {
    const pageStack = currentPages.map((page, index) => {
      return `${index}: ${page.route || '未知'}`;
    }).join(' -> ');
    
    // console.log(
    //   `%c[页面栈] %c${pageStack}`,
    //   logStyles.page,
    //   logStyles.info
    // );
  }
  
  return {
    path: currentPath,
    query: query,
    title: pageTitle,
    pageStack: currentPages.map(page => page.route)
  };
};

/**
 * 记录当前页面的URL
 * 仅在H5环境下有效
 */
export const logCurrentUrl = () => {
  try {
    // 检查是否在浏览器环境
    if (typeof window !== 'undefined' && window.location) {
      const url = window.location.href;
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      
      // 返回URL信息但不打印日志
      return { url, path, search, hash };
    }
  } catch (e) {
    console.error('获取URL信息失败:', e);
  }
  
  return null;
};

/**
 * 页面混入
 * 自动为所有页面添加路径日志功能
 */
export const pageLoggerMixin = {
  onLoad(query) {
    logPagePath({
      query,
      type: 'onLoad'
    });
  },
  onShow() {
    logPagePath({
      type: 'onShow'
    });
  },
  onHide() {
    logPagePath({
      type: 'onHide'
    });
  },
  onUnload() {
    logPagePath({
      type: 'onUnload'
    });
  }
};

export default {
  logPagePath,
  logCurrentUrl,
  pageLoggerMixin
}; 