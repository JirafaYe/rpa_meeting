/**
 * 模拟聊天消息数据
 */
export const messagesData = {
  // 会议ID 5的聊天记录
  '5': [
    {
      id: '1',
      name: '张三',
      avatar: '/static/avatar1.png',
      content: '各位好，今天我们主要讨论一下项目进度和下一阶段规划',
      time: '14:00'
    },
    {
      id: '2',
      name: '李四',
      avatar: '/static/avatar2.png',
      content: '前端部分已经完成了约75%，不过在移动端适配方面遇到一些问题',
      time: '14:03'
    },
    {
      id: '3',
      name: '王五',
      avatar: '/static/avatar3.png',
      content: '后端API开发已全部完成，正在进行性能测试',
      time: '14:05'
    },
    {
      id: '4',
      name: '张三',
      avatar: '/static/avatar1.png',
      content: '移动端适配问题具体是什么？需要增加人手吗？',
      time: '14:07'
    },
    {
      id: '5',
      name: '李四',
      avatar: '/static/avatar2.png',
      content: '主要是在不同尺寸的设备上布局会出现错位，我觉得需要引入一个更好的响应式框架',
      time: '14:09'
    },
    {
      id: '6',
      name: '王五',
      avatar: '/static/avatar3.png',
      content: '数据库查询优化方案我已经发到群里了，大家可以看一下',
      time: '14:12'
    },
    {
      id: '7',
      name: '张三',
      avatar: '/static/avatar1.png',
      content: '好的，后续我们需要安排两位前端加入，协助解决移动端适配问题',
      time: '14:15'
    },
    {
      id: '8',
      name: '李四',
      avatar: '/static/avatar2.png',
      content: '我这边还有个建议，UI组件库可以考虑升级到最新版本，它对移动端支持更好',
      time: '14:18'
    },
    {
      id: '9',
      name: '王五',
      avatar: '/static/avatar3.png',
      content: '性能测试发现了几个慢查询，我已经初步优化，速度提升了约40%',
      time: '14:22'
    },
    {
      id: '10',
      name: '张三',
      avatar: '/static/avatar1.png',
      content: '非常好，今天的会议我们主要决定了增加前端人手、更新UI库以及数据库优化方案',
      time: '14:45'
    }
  ],
  
  // 会议ID 6的聊天记录
  '6': [
    {
      id: '1',
      name: '李四',
      avatar: '/static/avatar2.png',
      content: '欢迎大家参加Q2产品规划会议，今天我们需要确定下一季度的产品方向',
      time: '10:00'
    },
    {
      id: '2',
      name: '张三',
      avatar: '/static/avatar1.png',
      content: '先简单回顾一下Q1的目标完成情况，我们达成了用户增长25%的目标',
      time: '10:03'
    },
    {
      id: '3',
      name: '王五',
      avatar: '/static/avatar3.png',
      content: '但是用户留存率不太理想，只有62%，低于预期的75%',
      time: '10:07'
    },
    {
      id: '4',
      name: '赵六',
      avatar: '/static/avatar4.png',
      content: '我分析了用户流失的原因，主要在核心功能的易用性和性能方面',
      time: '10:10'
    },
    {
      id: '5',
      name: '钱七',
      avatar: '/static/avatar5.png',
      content: '竞品分析显示，竞争对手在数据分析和可视化方面领先我们',
      time: '10:15'
    },
    {
      id: '6',
      name: '李四',
      avatar: '/static/avatar2.png',
      content: '那么我们Q2的重点是否应该放在提升用户体验和留存率上？',
      time: '10:20'
    },
    {
      id: '7',
      name: '张三',
      avatar: '/static/avatar1.png',
      content: '同意，我们应该优先解决现有问题，然后再考虑新功能',
      time: '10:23'
    },
    {
      id: '8',
      name: '赵六',
      avatar: '/static/avatar4.png',
      content: '我建议我们全面改版产品UI，提升整体用户体验',
      time: '10:30'
    },
    {
      id: '9',
      name: '王五',
      avatar: '/static/avatar3.png',
      content: '另外，数据分析功能是用户强烈要求的，我们应该在Q2完成这个模块',
      time: '10:35'
    },
    {
      id: '10',
      name: '钱七',
      avatar: '/static/avatar5.png',
      content: '还有注册流程优化，目前从点击注册到完成的转化率只有40%',
      time: '10:42'
    },
    {
      id: '11',
      name: '李四',
      avatar: '/static/avatar2.png',
      content: '好的，那我们Q2的核心目标就是：用户体验提升、数据分析功能、UI改版和注册流程优化',
      time: '11:15'
    },
    {
      id: '12',
      name: '张三',
      avatar: '/static/avatar1.png',
      content: '会后我会整理详细的产品路线图，下周二前发给大家审阅',
      time: '11:30'
    }
  ],
  
  // 会议ID 1的聊天记录
  '1': [
    {
      id: '101',
      sender: '张三',
      content: '大家好，欢迎参加本次项目进度会议。',
      time: '14:00',
      isSystem: false
    },
    {
      id: '102',
      sender: '李四',
      content: '我已经整理好了前端开发进度，等下可以讨论一下UI改进方案。',
      time: '14:05',
      isSystem: false
    },
    {
      id: '103',
      sender: '王五',
      content: '后端接口已经完成了80%，我们在安全性方面做了一些优化。',
      time: '14:10',
      isSystem: false
    },
    {
      id: '104',
      sender: '赵六',
      content: '移动端适配遇到了一些问题，特别是在iOS设备上，需要大家一起讨论下解决方案。',
      time: '14:15',
      isSystem: false
    },
    {
      id: '105',
      sender: '钱七',
      content: '数据库优化后，性能提升了30%，加载速度明显改善。',
      time: '14:18',
      isSystem: false
    },
    {
      id: '106',
      sender: '李四',
      content: '我这边有个新的UI设计方案，大家可以看一下，主要改进了用户体验。',
      time: '14:20',
      isSystem: false
    },
    {
      id: '107',
      sender: '张三',
      content: '总体来看，项目进展顺利，主要需要解决UI和移动端适配问题。',
      time: '14:25',
      isSystem: false
    },
    {
      id: '108',
      sender: '王五',
      content: '我已经整理好了新的后端API文档，会后分享给大家。',
      time: '14:30',
      isSystem: false
    },
    {
      id: '109',
      isSystem: true,
      content: '会议已开始，请各位遵守会议纪律',
      time: '14:00'
    },
    {
      id: '110',
      isSystem: true,
      content: '张三已添加文件：系统架构设计.pdf',
      time: '14:30'
    }
  ]
};

/**
 * 模拟会议消息数据模块 - 从JSON文件加载和保存数据
 */
import { loadJsonData, saveJsonData } from './utils/jsonDataLoader.js';

// 数据文件路径
const MESSAGES_DATA_PATH = './json/messages.json';

// 加载消息数据
let loadedMessagesData = loadJsonData(MESSAGES_DATA_PATH);
export const messages = loadedMessagesData.messages || [];

// 保存消息数据到JSON文件
function saveMessagesData() {
  return saveJsonData(MESSAGES_DATA_PATH, { messages });
}

/**
 * 获取会议消息列表
 * @param {string} meetingId - 会议ID
 * @param {Object} params - 查询参数
 * @returns {Object} 消息列表响应
 */
export function getMessageList(meetingId, params = {}) {
  console.log('获取会议消息列表，会议ID：', meetingId, '参数：', params);
  
  if (!meetingId) {
    return {
      code: 400,
      message: '会议ID不能为空',
      data: null
    };
  }
  
  // 从params中获取分页参数
  const { pageSize = 20, pageNum = 1, lastId } = params;
  
  // 根据会议ID筛选消息
  let filteredMessages = messages.filter(message => message.meetingId === meetingId);
  
  // 如果指定了lastId，则只返回比lastId更新的消息
  if (lastId) {
    const lastIndex = filteredMessages.findIndex(message => message.id === lastId);
    if (lastIndex !== -1) {
      filteredMessages = filteredMessages.slice(lastIndex + 1);
    }
  }
  
  // 按时间排序（从新到旧）
  filteredMessages.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  
  // 分页
  const total = filteredMessages.length;
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentList = filteredMessages.slice(startIndex, endIndex);
  
  return {
    code: 200,
    message: '获取会议消息成功',
    data: {
      total,
      pageSize,
      pageNum,
      list: currentList
    }
  };
}

/**
 * 发送会议消息
 * @param {string} meetingId - 会议ID
 * @param {Object} messageData - 消息数据
 * @returns {Object} 发送结果响应
 */
export function sendMessage(meetingId, messageData) {
  console.log('发送会议消息，会议ID：', meetingId, '数据：', messageData);
  
  if (!meetingId) {
    return {
      code: 400,
      message: '会议ID不能为空',
      data: null
    };
  }
  
  if (!messageData.content) {
    return {
      code: 400,
      message: '消息内容不能为空',
      data: null
    };
  }
  
  if (!messageData.senderId) {
    return {
      code: 400,
      message: '发送者ID不能为空',
      data: null
    };
  }
  
  // 生成唯一ID
  const newId = String(Math.max(0, ...messages.map(message => parseInt(message.id || '0'))) + 1);
  
  // 创建新消息
  const newMessage = {
    id: newId,
    meetingId: meetingId,
    senderId: messageData.senderId,
    senderName: messageData.senderName || '未知用户',
    senderAvatar: messageData.senderAvatar || '',
    content: messageData.content,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    isSystem: messageData.isSystem || false
  };
  
  // 添加到消息列表
  messages.push(newMessage);
  
  // 保存数据
  saveMessagesData();
  
  return {
    code: 200,
    message: '发送消息成功',
    data: newMessage
  };
}

/**
 * 根据会议ID获取消息
 * @param {string} meetingId 会议ID
 * @returns {Array} 消息数组
 */
export function getMessagesByMeetingId(meetingId) {
  console.log('根据会议ID获取消息:', meetingId);
  
  if (!meetingId) {
    console.error('会议ID不能为空');
    return [];
  }
  
  try {
    // 从本地JSON文件获取消息
    const messages = require('./json/messages.json').messages;
    
    if (!messages || !Array.isArray(messages)) {
      console.error('消息数据异常:', messages);
      return [];
    }
    
    // 过滤指定会议的消息
    const meetingMessages = messages.filter(message => message.meetingId === meetingId);
    
    // 按时间排序（从早到晚）
    meetingMessages.sort((a, b) => {
      const timeA = a.createTime ? new Date(a.createTime) : 0;
      const timeB = b.createTime ? new Date(b.createTime) : 0;
      return timeA - timeB;
    });
    
    console.log(`会议${meetingId}的消息数:`, meetingMessages.length);
    return meetingMessages;
  } catch (error) {
    console.error('获取消息异常:', error);
    return [];
  }
}

export default {
  getMessageList,
  sendMessage,
  getMessagesByMeetingId
}; 