import { logPagePath, logCurrentUrl } from './page-logger.js'

/**
 * 实用工具函数集合
 */

/**
 * 打印当前页面路径
 * @param {Object} options - 选项
 * @param {String} options.title - 自定义标题
 * @param {Object} options.params - 附加参数
 */
export const printCurrentPath = (options = {}) => {
  // 同时记录URL信息(H5环境)
  logCurrentUrl();
  
  return logPagePath({
    title: options.title || '手动记录',
    type: 'manual',
    query: options.params || {}
  });
};

/**
 * 调试页面状态
 * 打印出当前页面状态的完整信息，包括URL、路由状态等
 */
export const debugPageState = () => {
  console.log('%c[页面状态调试]', 'color: #ff6b81; font-weight: bold; font-size: 14px;');
  
  // 记录URL信息
  const urlInfo = logCurrentUrl();
  
  // 记录页面信息
  const pageInfo = logPagePath({
    title: '状态调试',
    type: 'debug'
  });
  
  // 记录本地存储信息
  try {
    const token = uni.getStorageSync('token');
    const adminToken = uni.getStorageSync('adminToken');
    const userInfo = uni.getStorageSync('userInfo');
    const adminInfo = uni.getStorageSync('adminInfo');
    
    console.log('[存储信息]');
    console.log('token:', token || '未设置');
    console.log('adminToken:', adminToken || '未设置');
    console.log('userInfo:', userInfo || '未设置');
    console.log('adminInfo:', adminInfo || '未设置');
  } catch (e) {
    console.error('读取存储信息失败:', e);
  }
  
  // 记录系统信息
  try {
    const systemInfo = uni.getSystemInfoSync();
    console.log('[系统信息]', systemInfo);
  } catch (e) {
    console.error('获取系统信息失败:', e);
  }
  
  return {
    urlInfo,
    pageInfo
  };
};

/**
 * 格式化日期时间
 * @param {Date|String|Number} date - 日期对象或时间戳
 * @param {String} format - 格式化模式，默认 'YYYY-MM-DD HH:mm:ss'
 * @return {String} 格式化后的日期字符串
 */
export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';
  
  // 转换为日期对象
  const d = typeof date === 'object' ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const o = {
    'YYYY': d.getFullYear(),
    'MM': ('0' + (d.getMonth() + 1)).slice(-2),
    'DD': ('0' + d.getDate()).slice(-2),
    'HH': ('0' + d.getHours()).slice(-2),
    'mm': ('0' + d.getMinutes()).slice(-2),
    'ss': ('0' + d.getSeconds()).slice(-2),
    'SSS': ('00' + d.getMilliseconds()).slice(-3)
  };
  
  return format.replace(/(YYYY|MM|DD|HH|mm|ss|SSS)/g, (match) => o[match]);
};

/**
 * 生成随机ID
 * @param {Number} length - ID长度
 * @return {String} 随机ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

/**
 * 简化的页面数据日志
 * 极简版 - 只显示最基本的信息
 * @param {string} pageName - 页面名称
 * @param {string} dataType - 数据类型
 * @param {any} data - 要记录的数据
 */
export function logPageData(pageName, dataType, data) {
  // 只有在开发环境下才输出日志
  if (process.env.NODE_ENV !== 'development') return;
  
  // 最小化输出 - 只记录API调用和数据数量
  if (dataType === '原始响应') {
    // 不显示原始响应
    return;
  }
  
  // 只显示处理后的数据
  if (dataType === '处理后数据' && data) {
    let infoText = '';
    
    if (Array.isArray(data)) {
      infoText = `${data.length}条记录`;
    }
    else if (typeof data === 'object' && data.list && Array.isArray(data.list)) {
      infoText = `${data.list.length}/${data.total || 0}条记录`;
    }
    
    if (infoText) {
      console.log(`${pageName}: ${infoText}`);
    }
  }
}

/**
 * 安全导航到页面
 * 检查页面是否存在，存在则导航到指定页面，不存在则显示提示弹窗
 * @param {String} url - 导航URL
 * @param {Boolean} useRedirect - 是否使用重定向而不是新开页面
 * @return {Promise} 导航结果的Promise
 */
export const safeNavigateTo = (url, useRedirect = false) => {
  // 已存在的页面列表
  const existingPages = [
    '/pages/admin/home',
    '/pages/admin/meeting/list',
    '/pages/admin/meeting/detail',
    '/pages/admin/room/list',
    '/pages/admin/room/edit',
    '/pages/admin/user/list',
    '/pages/admin/user/edit',
    '/pages/admin/statistics/index',
    '/pages/admin/rpa/index',
    '/pages/admin/notification/index',
    '/pages/admin/login',
    '/pages/user/login',
    '/pages/user/schedule'
  ];
  
  // 尚未实现的页面及其提示信息
  const upcomingPages = {
    '/pages/admin/meeting/calendar': '会议日历',
    '/pages/admin/meeting/approval': '会议审批',
    '/pages/admin/room/reservation': '会议室预约管理',
    '/pages/admin/user/add': '添加用户',
    '/pages/admin/settings/index': '系统设置',
    '/pages/admin/profile': '管理员个人信息'
  };
  
  // 检查页面是否存在
  if (!existingPages.some(page => url.startsWith(page))) {
    let pageName = '此功能';
    
    // 查找是否匹配到待开发页面
    for (const [path, name] of Object.entries(upcomingPages)) {
      if (url.startsWith(path)) {
        pageName = name;
        break;
      }
    }
    
    return new Promise((resolve, reject) => {
      uni.showToast({
        title: `${pageName}正在开发中`,
        icon: 'none',
        duration: 2000
      });
      
      setTimeout(() => {
        resolve({ cancelled: true });
      }, 2000);
    });
  }
  
  // 执行导航
  return new Promise((resolve, reject) => {
    const navMethod = useRedirect ? uni.redirectTo : uni.navigateTo;
    navMethod({
      url,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        console.error('导航错误:', err);
        
        // 如果导航失败，显示提示
        uni.showToast({
          title: '页面跳转失败',
          icon: 'none',
          duration: 2000
        });
        
        reject(err);
      }
    });
  });
};

/**
 * 安全重新加载页面
 * 检查页面是否存在，存在则重新加载指定页面，不存在则显示提示弹窗
 * @param {String} url - 重定向URL
 * @return {Promise} 导航结果的Promise
 */
export const safeReLaunch = (url) => {
  // 已存在的页面列表
  const existingPages = [
    '/pages/admin/home',
    '/pages/admin/meeting/list',
    '/pages/admin/meeting/detail',
    '/pages/admin/room/list',
    '/pages/admin/room/edit',
    '/pages/admin/user/list',
    '/pages/admin/user/edit',
    '/pages/admin/statistics/index',
    '/pages/admin/rpa/index',
    '/pages/admin/notification/index',
    '/pages/admin/login',
    '/pages/user/login',
    '/pages/user/schedule'
  ];
  
  // 尚未实现的页面及其提示信息
  const upcomingPages = {
    '/pages/admin/meeting/calendar': '会议日历',
    '/pages/admin/meeting/approval': '会议审批',
    '/pages/admin/room/reservation': '会议室预约管理',
    '/pages/admin/user/add': '添加用户',
    '/pages/admin/settings/index': '系统设置',
    '/pages/admin/profile': '管理员个人信息'
  };
  
  // 检查页面是否存在
  if (!existingPages.some(page => url.startsWith(page))) {
    let pageName = '此功能';
    
    // 查找是否匹配到待开发页面
    for (const [path, name] of Object.entries(upcomingPages)) {
      if (url.startsWith(path)) {
        pageName = name;
        break;
      }
    }
    
    return new Promise((resolve, reject) => {
      uni.showToast({
        title: `${pageName}正在开发中`,
        icon: 'none',
        duration: 2000
      });
      
      setTimeout(() => {
        resolve({ cancelled: true });
      }, 2000);
    });
  }
  
  // 执行导航
  return new Promise((resolve, reject) => {
    uni.reLaunch({
      url,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        console.error('重新加载页面错误:', err);
        
        // 如果导航失败，显示提示
        uni.showToast({
          title: '页面加载失败',
          icon: 'none',
          duration: 2000
        });
        
        reject(err);
      }
    });
  });
};

export default {
  printCurrentPath,
  debugPageState,
  formatDateTime,
  generateId,
  safeNavigateTo,
  safeReLaunch
}; 