/**
 * 模拟会议议程数据
 */
export const agendasData = {
  // 会议ID 5的议程
  '5': [
    {
      id: '1',
      title: '项目进度汇报',
      description: '各部门汇报当前项目进度、存在的问题及解决方案',
      owner: '张三',
      duration: 30,
      status: 2, // 1-未开始, 2-进行中, 3-已完成, 4-已取消
      files: ['1', '2'], // 关联文件ID
      subAgendas: [
        {
          id: '1-1',
          title: '前端开发进度',
          description: '前端团队开发进度汇报，包括功能完成情况和遇到的问题',
          owner: '李四',
          duration: 10,
          status: 3,
          files: ['1'],
          parentId: '1'
        },
        {
          id: '1-2',
          title: '后端开发进度',
          description: '后端团队开发进度汇报，包括API开发情况和性能优化',
          owner: '王五',
          duration: 10,
          status: 3,
          files: ['2'],
          parentId: '1'
        }
      ]
    },
    {
      id: '2',
      title: '下一阶段工作规划',
      description: '讨论下一阶段的工作重点和任务分配',
      owner: '张三',
      duration: 20,
      status: 1,
      files: [],
      subAgendas: []
    },
    {
      id: '3',
      title: '技术难点讨论',
      description: '讨论项目中的技术难点和解决方案',
      owner: '王五',
      duration: 15,
      status: 1,
      files: [],
      subAgendas: []
    }
  ],
  
  // 会议ID 6的议程
  '6': [
    {
      id: '1',
      title: 'Q1业绩回顾',
      description: '回顾第一季度的业绩表现和目标完成情况',
      owner: '张三',
      duration: 20,
      status: 3,
      files: ['3'],
      subAgendas: []
    },
    {
      id: '2',
      title: 'Q2产品规划',
      description: '讨论Q2的产品开发方向和功能优先级',
      owner: '李四',
      duration: 30,
      status: 2,
      files: [],
      subAgendas: [
        {
          id: '2-1',
          title: '用户留存问题分析',
          description: '分析当前用户留存率偏低的原因和改进方案',
          owner: '赵六',
          duration: 15,
          status: 3,
          files: [],
          parentId: '2'
        },
        {
          id: '2-2',
          title: '竞品分析报告',
          description: '分析主要竞争对手的产品特点和市场策略',
          owner: '钱七',
          duration: 15,
          status: 2,
          files: ['4'],
          parentId: '2'
        }
      ]
    },
    {
      id: '3',
      title: '营销策略讨论',
      description: '讨论Q2的市场营销策略和预算分配',
      owner: '王五',
      duration: 25,
      status: 1,
      files: [],
      subAgendas: []
    }
  ],
  
  // 会议ID 1的议程
  '1': [
    {
      id: '1',
      title: '项目进展',
      description: '讨论当前项目进展情况',
      owner: '张三',
      duration: 15,
      status: 3,
      files: [],
      subAgendas: []
    },
    {
      id: '2',
      title: '问题反馈',
      description: '收集和解决项目中遇到的问题',
      owner: '李四',
      duration: 10,
      status: 3,
      files: [],
      subAgendas: []
    }
  ]
}; 

/**
 * 模拟会议议程数据模块 - 从JSON文件加载和保存数据
 */
import { loadJsonData, saveJsonData } from './utils/jsonDataLoader.js';

// 数据文件路径
const AGENDAS_DATA_PATH = './json/agendas.json';

// 加载议程数据
let loadedAgendasData = loadJsonData(AGENDAS_DATA_PATH);
export const agendas = loadedAgendasData.agendas || [];

// 保存议程数据到JSON文件
function saveAgendasData() {
  return saveJsonData(AGENDAS_DATA_PATH, { agendas });
}

/**
 * 获取会议议程列表
 * @param {string} meetingId - 会议ID
 * @returns {Object} 议程列表响应
 */
export function getAgendaList(meetingId) {
  console.log('获取会议议程列表，会议ID：', meetingId);
  
  if (!meetingId) {
    return {
      code: 400,
      message: '会议ID不能为空',
      data: null
    };
  }
  
  // 根据会议ID筛选议程
  const filteredAgendas = agendas.filter(agenda => agenda.meetingId === meetingId);
  
  // 按议程顺序排序
  filteredAgendas.sort((a, b) => a.order - b.order);
  
  return {
    code: 200,
    message: '获取会议议程成功',
    data: filteredAgendas
  };
}

/**
 * 创建会议议程
 * @param {Object} agendaData - 议程数据
 * @returns {Object} 创建结果响应
 */
export function createAgenda(agendaData) {
  console.log('创建会议议程，数据：', agendaData);
  
  if (!agendaData.meetingId) {
    return {
      code: 400,
      message: '会议ID不能为空',
      data: null
    };
  }
  
  if (!agendaData.title) {
    return {
      code: 400,
      message: '议程标题不能为空',
      data: null
    };
  }
  
  // 生成唯一ID
  const newId = String(Math.max(0, ...agendas.map(agenda => parseInt(agenda.id || '0'))) + 1);
  
  // 获取当前会议的议程数量，用于确定顺序
  const currentAgendas = agendas.filter(agenda => agenda.meetingId === agendaData.meetingId);
  const order = agendaData.order || (currentAgendas.length + 1);
  
  // 创建新议程
  const newAgenda = {
    id: newId,
    meetingId: agendaData.meetingId,
    title: agendaData.title,
    description: agendaData.description || '',
    duration: agendaData.duration || 15,
    order: order,
    presenter: agendaData.presenter || '',
    status: agendaData.status || 'pending'
  };
  
  // 添加到议程列表
  agendas.push(newAgenda);
  
  // 保存数据
  saveAgendasData();
  
  return {
    code: 200,
    message: '创建议程成功',
    data: { id: newId }
  };
}

/**
 * 更新会议议程
 * @param {string} id - 议程ID
 * @param {Object} agendaData - 更新的议程数据
 * @returns {Object} 更新结果响应
 */
export function updateAgenda(id, agendaData) {
  console.log('更新会议议程，ID：', id, '数据：', agendaData);
  
  if (!id) {
    return {
      code: 400,
      message: '议程ID不能为空',
      data: null
    };
  }
  
  // 查找议程
  const index = agendas.findIndex(agenda => agenda.id === id);
  if (index === -1) {
    return {
      code: 404,
      message: '议程不存在',
      data: null
    };
  }
  
  // 更新议程
  agendas[index] = {
    ...agendas[index],
    ...agendaData,
    id // 确保ID不变
  };
  
  // 保存数据
  saveAgendasData();
  
  return {
    code: 200,
    message: '更新议程成功',
    data: { id }
  };
}

/**
 * 删除会议议程
 * @param {string} id - 议程ID
 * @returns {Object} 删除结果响应
 */
export function deleteAgenda(id) {
  console.log('删除会议议程，ID：', id);
  
  if (!id) {
    return {
      code: 400,
      message: '议程ID不能为空',
      data: null
    };
  }
  
  // 查找议程
  const index = agendas.findIndex(agenda => agenda.id === id);
  if (index === -1) {
    return {
      code: 404,
      message: '议程不存在',
      data: null
    };
  }
  
  // 删除议程
  agendas.splice(index, 1);
  
  // 保存数据
  saveAgendasData();
  
  return {
    code: 200,
    message: '删除议程成功',
    data: { id }
  };
}

/**
 * 根据会议ID获取议题
 * @param {string} meetingId 会议ID
 * @returns {Array} 议题数组
 */
export function getAgendaByMeetingId(meetingId) {
  console.log('根据会议ID获取议题:', meetingId);
  
  if (!meetingId) {
    console.error('会议ID不能为空');
    return [];
  }
  
  try {
    // 从本地JSON文件获取议题
    const agendas = require('./json/agendas.json');
    
    if (!agendas || !Array.isArray(agendas)) {
      console.error('议题数据异常:', agendas);
      return [];
    }
    
    // 过滤指定会议的议题
    const meetingAgendas = agendas.filter(agenda => agenda.meetingId === meetingId);
    
    // 构建议题树结构
    const mainAgendas = meetingAgendas.filter(agenda => !agenda.parentId);
    
    // 为每个主议题添加子议题
    mainAgendas.forEach(mainAgenda => {
      mainAgenda.subAgendas = meetingAgendas.filter(agenda => 
        agenda.parentId === mainAgenda.id
      );
    });
    
    console.log(`会议${meetingId}的议题数:`, mainAgendas.length);
    return mainAgendas;
  } catch (error) {
    console.error('获取议题异常:', error);
    return [];
  }
}

export default {
  getAgendaList,
  createAgenda,
  updateAgenda,
  deleteAgenda
}; 