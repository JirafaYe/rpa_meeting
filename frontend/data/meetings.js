/**
 * 模拟会议数据模块 - 从JSON文件加载和保存数据
 */
import { loadJsonData, saveJsonData } from './utils/jsonDataLoader.js';

// 数据文件路径
const MEETINGS_DATA_PATH = './json/meetings.json';

// 加载会议数据
let loadedMeetingsData = loadJsonData(MEETINGS_DATA_PATH);
let meetings = loadedMeetingsData.meetings || {};

// 修复可能的编码问题后的会议数据
try {
  // 检查数据是否需要修复
  if (Object.keys(meetings).length > 0) {
    const firstMeetingId = Object.keys(meetings)[0];
    const firstMeeting = meetings[firstMeetingId];
    // 如果标题包含乱码字符，尝试修复
    if (firstMeeting && firstMeeting.title && /[\ufffd\u25a1]/.test(firstMeeting.title)) {
      console.log('检测到编码问题，尝试修复会议数据');
      
      // 手动设置一些示例会议数据
      meetings = {
        "3": {
          "id": "3",
          "title": "项目进度例会",
          "description": "讨论项目的当前进度和遇到的问题",
          "roomId": "1",
          "roomName": "大会议室",
          "startTime": "2023-05-15 09:00",
          "endTime": "2023-05-15 10:00",
          "organizer": {
            "id": "1",
            "name": "张三"
          },
          "type": "regular",
          "status": "in-progress",
          "participants": [
            {
              "id": "1",
              "name": "张三",
              "avatar": "/static/images/avatar/user1.png",
              "confirmed": true
            },
            {
              "id": "2",
              "name": "李四",
              "avatar": "/static/images/avatar/user2.png",
              "confirmed": true
            },
            {
              "id": "3",
              "name": "王五",
              "avatar": "/static/images/avatar/user3.png",
              "confirmed": true
            }
          ],
          "attachments": []
        },
        "101": {
          "id": "101",
          "title": "产品需求评审会议",
          "description": "讨论新产品功能的需求细节和实现方案",
          "roomId": "1",
          "roomName": "大会议室", 
          "startTime": "2023-06-10 09:30",
          "endTime": "2023-06-10 11:00",
          "organizer": {
            "id": "2",
            "name": "李四"
          },
          "type": "planning",
          "status": "in-progress",
          "participants": [
            {
              "id": "2",
              "name": "李四",
              "avatar": "/static/images/avatar/user2.png",
              "confirmed": true
            },
            {
              "id": "1",
              "name": "张三",
              "avatar": "/static/images/avatar/user1.png",
              "confirmed": true
            }
          ],
          "attachments": []
        }
      };
      
      // 保存修复后的数据
      saveMeetingsData();
    }
  }
} catch (error) {
  console.error('修复会议数据失败:', error);
}

// 导出静态会议数据 (原始数据，用作引用)
export { meetings };

// 保存会议数据到JSON文件
function saveMeetingsData() {
  return saveJsonData(MEETINGS_DATA_PATH, { meetings });
}

/**
 * 获取会议列表
 * @param {Object} params - 查询参数
 * @returns {Object} 会议列表响应
 */
export function getMeetingList(params = {}) {
  console.log('获取会议列表，参数：', params);
  
  // 检查meetings对象
  if (!meetings || typeof meetings !== 'object') {
    console.error('meetings数据异常:', meetings);
    return {
      code: 500,
      message: '会议数据异常',
      data: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
        list: []
      }
    };
  }
  
  console.log('当前meetings对象键数量：', Object.keys(meetings).length);
  
  // 从params中获取查询参数
  const { status, type, startDate, endDate, keyword, pageSize = 10, pageNum = 1 } = params;
  
  // 克隆并转换meetings对象为数组
  let meetingList = Object.values(meetings).map(meeting => ({ ...meeting }));
  console.log('转换后的meetingList长度:', meetingList.length);
  
  // 根据用户类型筛选(我发起的/我参与的)
  if (type === 'initiated') {
    // 筛选我发起的会议
    meetingList = meetingList.filter(meeting => meeting.organizer && meeting.organizer.id === '1');
    console.log('我发起的会议列表:', meetingList);
  } else if (type === 'participated') {
    // 筛选我参与的会议
    meetingList = meetingList.filter(meeting => 
      meeting.participants && 
      meeting.participants.some(p => p.id === '1')
    );
    console.log('我参与的会议列表:', meetingList);
  }
  
  // 根据查询参数筛选
  if (status) {
    meetingList = meetingList.filter(meeting => meeting.status === status);
  }
  
  // 会议类型筛选（如regular, planning等）- 不要和用户参与类型混淆
  if (params.meetingType) {
    meetingList = meetingList.filter(meeting => meeting.type === params.meetingType);
  }
  
  if (startDate) {
    meetingList = meetingList.filter(meeting => new Date(meeting.startTime) >= new Date(startDate));
  }
  
  if (endDate) {
    meetingList = meetingList.filter(meeting => new Date(meeting.endTime) <= new Date(endDate));
  }
  
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    meetingList = meetingList.filter(meeting => 
      meeting.title.toLowerCase().includes(lowerKeyword) || 
      (meeting.description && meeting.description.toLowerCase().includes(lowerKeyword))
    );
  }
  
  // 按开始时间排序
  meetingList.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  // 分页
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentList = meetingList.slice(startIndex, endIndex);
  console.log('返回的会议列表数量:', currentList.length);
  
  // 修复问题：确保总数和列表数据正确
  const responseData = {
    total: meetingList.length,
    pageSize,
    pageNum,
    list: currentList
  };
  
  console.log('最终返回的数据:', responseData);
  
  // 返回结果
  return {
    code: 200,
    message: '获取会议列表成功',
    data: responseData
  };
}

/**
 * 根据ID获取会议详情
 * @param {string} meetingId 会议ID
 * @returns {Object|null} 会议对象或null
 */
export function getMeetingById(meetingId) {
  console.log('根据ID获取会议详情:', meetingId);
  
  if (!meetingId) {
    console.error('会议ID不能为空');
    return null;
  }
  
  try {
    // 从本地数据获取会议
    if (!Array.isArray(meetings)) {
      console.error('会议数据格式不正确');
      return null;
    }
    
    // 查找指定ID的会议
    const meeting = meetings.find(meeting => meeting.id === meetingId);
    
    if (!meeting) {
      console.warn(`未找到ID为${meetingId}的会议`);
      return null;
    }
    
    console.log('找到会议:', meeting);
    return meeting;
  } catch (error) {
    console.error('获取会议详情异常:', error);
    return null;
  }
}

/**
 * 创建新会议
 * @param {Object} meetingData - 会议数据
 * @returns {Object} 创建结果响应
 */
export function createMeeting(meetingData) {
  console.log('创建会议，数据：', meetingData);
  
  // 格式化日期时间字符串为标准格式
  const formatDateTime = (datetime) => {
    if (!datetime) return '';
    
    // 如果包含T，说明是ISO格式，转换为yyyy-MM-dd HH:mm格式
    if (datetime.includes('T')) {
      const date = new Date(datetime);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    
    // 如果只包含日期部分，添加默认时间
    if (datetime.includes('-') && !datetime.includes(':')) {
      return `${datetime} 00:00`;
    }
    
    return datetime;
  };
  
  // 生成唯一ID
  const newId = String(Math.max(0, ...Object.keys(meetings).map(id => parseInt(id))) + 1);
  
  // 创建新会议对象
  const newMeeting = {
    id: newId,
    title: meetingData.title || '',
    description: meetingData.description || '',
    roomId: meetingData.roomId || '',
    roomName: meetingData.roomName || '',
    startTime: formatDateTime(meetingData.startTime),
    endTime: formatDateTime(meetingData.endTime),
    organizer: meetingData.organizer || {
      id: '1', // 默认当前用户
      name: '张三'
    },
    type: meetingData.type || 'regular',
    status: meetingData.status || 'pending',
    participants: meetingData.participants || [],
    attachments: meetingData.attachments || [],
    createTime: formatDateTime(new Date().toISOString()),
    isRpa: meetingData.isRpa || false,
    rpaConfig: meetingData.rpaConfig || null
  };
  
  // 添加到会议列表
  meetings[newId] = newMeeting;
  
  // 保存数据
  saveMeetingsData();
  
  return {
    code: 200,
    message: '创建会议成功',
    data: { id: newId }
  };
}

/**
 * 更新会议
 * @param {string} id - 会议ID
 * @param {Object} meetingData - 更新的会议数据
 * @returns {Object} 更新结果响应
 */
export function updateMeeting(id, meetingData) {
  console.log('更新会议，ID：', id, '数据：', meetingData);
  
  if (!id || !meetings[id]) {
    return {
      code: 404,
      message: '会议不存在',
      data: null
    };
  }
  
  // 获取当前会议数据
  const currentMeeting = meetings[id];
  
  // 更新会议数据
  const updatedMeeting = {
    ...currentMeeting,
    ...meetingData,
    id // 确保ID不变
  };
  
  // 保存更新后的会议
  meetings[id] = updatedMeeting;
  
  // 保存数据
  saveMeetingsData();
  
  return {
    code: 200,
    message: '更新会议成功',
    data: { id }
  };
}

/**
 * 取消会议
 * @param {string} id - 会议ID
 * @param {string} reason - 取消原因
 * @returns {Object} 取消结果响应
 */
export function cancelMeeting(id, reason = '') {
  console.log('取消会议，ID：', id, '原因：', reason);
  
  if (!id || !meetings[id]) {
    return {
      code: 404,
      message: '会议不存在',
      data: null
    };
  }
  
  // 更新会议状态
  meetings[id] = {
    ...meetings[id],
    status: 'cancelled',
    cancelReason: reason,
    cancelTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  
  // 保存数据
  saveMeetingsData();
  
  return {
    code: 200,
    message: '取消会议成功',
    data: { id }
  };
}

/**
 * 拒绝参加会议
 * @param {string} id - 会议ID
 * @returns {Object} 拒绝结果响应
 */
export function rejectParticipation(id) {
  console.log('拒绝参加会议，ID：', id);
  
  if (!id || !meetings[id]) {
    return {
      code: 404,
      message: '会议不存在',
      data: null
    };
  }
  
  // 假设当前用户ID为1
  const currentUserId = '1';
  
  // 更新参会人员确认状态
  meetings[id] = {
    ...meetings[id],
    participants: (meetings[id].participants || []).map(participant => {
      if (participant.id === currentUserId) {
    return {
          ...participant,
          confirmed: false,
          rejectedTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return participant;
    })
  };
  
  // 保存数据
  saveMeetingsData();
  
  return {
    code: 200,
    message: '已拒绝参加会议',
    data: { id }
  };
}

/**
 * 生成会议纪要
 * @param {string} meetingId - 会议ID
 * @returns {Object} 会议纪要响应
 */
export function generateMeetingMinutes(meetingId) {
  console.log('生成会议纪要，会议ID：', meetingId);
  
  if (!meetingId || !meetings[meetingId]) {
    return {
      code: 404,
      message: '会议不存在',
      data: null
    };
  }
  
  const meeting = meetings[meetingId];
  
  // 模拟生成会议纪要
  const minutes = {
    id: `minutes-${meetingId}-${Date.now()}`,
        meetingId,
    title: `${meeting.title} - 会议纪要`,
    content: `# ${meeting.title}\n\n## 会议信息\n\n- 时间：${meeting.startTime} 至 ${meeting.endTime}\n- 地点：${meeting.roomName}\n- 组织者：${meeting.organizer.name}\n\n## 参会人员\n\n${meeting.participants.map(p => `- ${p.name}`).join('\n')}\n\n## 会议内容\n\n1. 项目进展情况讨论\n2. 问题分析与解决方案\n3. 下一步工作计划\n\n## 会议决议\n\n1. 完成当前迭代的开发任务\n2. 解决测试中发现的关键问题\n3. 准备下一次迭代的需求分析\n\n## 行动项\n\n| 任务 | 负责人 | 截止日期 |\n| --- | --- | --- |\n| 完成功能A开发 | 张三 | 2023-06-01 |\n| 修复Bug #123 | 李四 | 2023-05-25 |\n| 准备需求文档 | 王五 | 2023-05-30 |`,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    creator: meeting.organizer
  };
  
  // 更新会议数据，添加会议纪要
  if (!meeting.minutes) {
    meeting.minutes = [];
  }
  
  meeting.minutes.push(minutes);
  
  // 保存数据
  saveMeetingsData();
  
  return {
    code: 200,
    message: '生成会议纪要成功',
    data: minutes
  };
}

/**
 * 获取日程数据
 * @param {Object} params - 查询参数
 * @returns {Object} 日程数据响应
 */
export function getScheduleData(params = {}) {
  console.log('获取日程数据，参数：', params);
  
  const { date, userId } = params;
  
  // 如果指定了日期，只返回当天的会议
  let filteredMeetings = Object.values(meetings);
  
  if (date) {
    const dateStr = date.slice(0, 10); // 只取日期部分：yyyy-MM-dd
    filteredMeetings = filteredMeetings.filter(meeting => 
      meeting.startTime.startsWith(dateStr) || meeting.endTime.startsWith(dateStr)
    );
  }
  
  // 如果指定了用户ID，只返回该用户参与的会议
  if (userId) {
    filteredMeetings = filteredMeetings.filter(meeting => 
      meeting.organizer.id === userId || 
      meeting.participants.some(p => p.id === userId)
    );
  }
  
  // 按开始时间排序
  filteredMeetings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  return {
    code: 200,
    message: '获取日程成功',
    data: filteredMeetings
  };
}

/**
 * 根据类型获取会议列表
 * @param {string} type - 会议类型（initiated/participated）
 * @param {string} status - 会议状态
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 每页大小
 * @returns {Object} 分页会议列表
 */
export function getMeetingsByType(type, status, pageNum = 1, pageSize = 10) {
  console.log('根据类型获取会议列表:', { type, status, pageNum, pageSize });
  
  // 克隆并转换meetings对象为数组
  let meetingList = Object.values(meetings).map(meeting => ({ ...meeting }));
  console.log('转换后的meetingList长度:', meetingList.length);
  
  // 根据用户类型筛选(我发起的/我参与的)
  if (type === 'initiated') {
    // 筛选我发起的会议
    meetingList = meetingList.filter(meeting => meeting.organizer && meeting.organizer.id === '1');
    console.log('我发起的会议列表:', meetingList);
  } else if (type === 'participated') {
    // 筛选我参与的会议
    meetingList = meetingList.filter(meeting => 
      meeting.participants && 
      meeting.participants.some(p => p.id === '1')
    );
    console.log('我参与的会议列表:', meetingList);
  }
  
  // 根据状态筛选
  if (status) {
    meetingList = meetingList.filter(meeting => meeting.status === status);
  }
  
  // 按开始时间排序
  meetingList.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  // 分页
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentList = meetingList.slice(startIndex, endIndex);
  
  return {
    total: meetingList.length,
    pageSize,
    pageNum,
    list: currentList
  };
}

/**
 * 根据会议ID获取议题列表
 * @param {string} meetingId - 会议ID
 * @returns {Array} 议题列表
 */
export function getAgendaByMeetingId(meetingId) {
  console.log('根据会议ID获取议题列表:', meetingId);
  
  // 导入议题数据模块
  const { getAgendaList } = require('./agendas.js');
  const agendas = getAgendaList();
  
  // 过滤当前会议的议题
  return agendas.filter(agenda => agenda.meetingId === meetingId);
}

// ... 其他会议相关函数 ...

// 导出模块
export default {
  getMeetingList,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting
};

// 兼容CommonJS模块导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getMeetingList,
    getMeetingById,
    createMeeting,
    updateMeeting,
    cancelMeeting,
    rejectParticipation,
    generateMeetingMinutes,
    getScheduleData,
    meetings // 也导出meetings对象
  };
} 