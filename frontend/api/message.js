import { get, post, put, del, Models } from './index'
import { getMessagesByMeetingId } from '../data/messages.js'

/**
 * 获取会议消息列表
 * @param {string} meetingId 会议ID
 * @returns {Promise} 返回包含消息列表的Promise
 */
export function getMessageListAPI(meetingId) {
  console.log('获取会议消息API调用:', meetingId);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    try {
      // 从本地数据获取消息
      const messages = getMessagesByMeetingId(meetingId);
      
      // 模拟API响应延迟
      setTimeout(() => {
        if (messages && messages.length > 0) {
          resolve({
            code: 200,
            message: '获取消息成功',
            data: messages
          });
        } else {
          resolve({
            code: 404,
            message: '未找到会议消息',
            data: []
          });
        }
      }, 300);
    } catch (error) {
      console.error('获取会议消息异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
}

/**
 * 发送会议消息
 * @param {string} meetingId 会议ID
 * @param {string} content 消息内容
 * @param {object} options 其他选项
 * @returns {Promise} 返回发送结果Promise
 */
export function sendMessageAPI(meetingId, content, options = {}) {
  console.log('发送会议消息API调用:', meetingId, content, options);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    if (!content) {
      reject({
        code: 400,
        message: '消息内容不能为空'
      });
      return;
    }
    
    try {
      // 实际环境通常会调用API发送消息
      // 这里模拟API响应
      setTimeout(() => {
        // 生成消息ID
        const messageId = 'msg_' + Date.now();
        
        // 创建消息对象
        const message = {
          id: messageId,
          meetingId,
          content,
          senderId: options.senderId || '1',
          senderName: options.senderName || '当前用户',
          senderAvatar: options.senderAvatar || '/static/images/avatar/default.png',
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          isSystem: options.isSystem || false
        };
        
        resolve({
          code: 200,
          message: '发送消息成功',
          data: message
        });
      }, 300);
    } catch (error) {
      console.error('发送会议消息异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
}

/**
 * 获取历史消息
 * @param {Object} params - 参数对象
 * @param {String} params.meetingId - 会议ID
 * @param {Number} params.page - 页码
 * @param {Number} params.pageSize - 每页数量
 * @returns {Promise} - Promise对象
 */
export function getHistoryMessagesAPI(params) {
  return new Promise((resolve) => {
    console.log('获取历史消息，参数:', params);
    
    // 调用API
    get('/api/messages/history', params)
      .then(res => {
        console.log('历史消息API返回:', res);
        resolve(res);
      })
      .catch(err => {
        console.error('获取历史消息失败:', err);
        
        // 模拟数据
        resolve({
          success: true,
          code: 200,
          message: '获取历史消息成功(模拟)',
          data: {
            total: 0,
            list: [],
            pageSize: params.pageSize || 20,
            page: params.page || 1
          }
        });
      });
  });
}

// 导出接口
export default {
  getMessageList: getMessageListAPI,
  sendMessage: sendMessageAPI
}; 