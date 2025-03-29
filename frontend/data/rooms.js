/**
 * 模拟会议室数据模块 - 从JSON文件加载和保存数据
 */
import { loadJsonData, saveJsonData } from './utils/jsonDataLoader.js';

// 数据文件路径
const ROOMS_DATA_PATH = './json/rooms.json';

// 加载会议室数据
let roomsData = loadJsonData(ROOMS_DATA_PATH);
export const rooms = roomsData.rooms || [];
export const equipmentTypes = roomsData.equipmentTypes || [];

// 保存会议室数据到JSON文件
function saveRoomsData() {
  return saveJsonData(ROOMS_DATA_PATH, { rooms, equipmentTypes });
}

/**
 * 获取会议室列表
 * @param {Object} params - 查询参数
 * @returns {Object} 会议室列表响应
 */
export function getRoomList(params = {}) {
  console.log('获取会议室列表，参数：', params);
  
  // 从params中获取查询参数
  const { status, capacity, keyword, pageSize = 10, pageNum = 1 } = params;
  
  // 克隆并处理会议室数组
  let roomList = [...rooms];
  
  // 根据状态筛选
  if (status) {
    roomList = roomList.filter(room => room.status === status);
  }
  
  // 根据容量筛选
  if (capacity) {
    roomList = roomList.filter(room => room.capacity >= parseInt(capacity));
  }
  
  // 根据关键词筛选
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    roomList = roomList.filter(room => 
      room.name.toLowerCase().includes(lowerKeyword) || 
      room.location.toLowerCase().includes(lowerKeyword) ||
      (room.description && room.description.toLowerCase().includes(lowerKeyword))
    );
  }
  
  // 分页
  const total = roomList.length;
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentList = roomList.slice(startIndex, endIndex);
  
  // 返回结果
  return {
    code: 200,
    message: '获取会议室列表成功',
    data: {
      total,
      pageSize,
      pageNum,
      list: currentList
    }
  };
}

/**
 * 根据ID获取会议室详情
 * @param {string} id - 会议室ID
 * @returns {Object} 会议室详情响应
 */
export function getRoomById(id) {
  console.log('获取会议室详情，ID：', id);
  
  if (!id) {
    return {
      code: 400,
      message: '会议室ID不能为空',
      data: null
    };
  }
  
  const room = rooms.find(r => r.id === id);
  
  if (!room) {
    return {
      code: 404,
      message: '会议室不存在',
      data: null
    };
  }
  
  return {
    code: 200,
    message: '获取会议室详情成功',
    data: { ...room }
  };
}

/**
 * 获取会议室可用时间
 * @param {string} roomId - 会议室ID
 * @param {string} date - 日期，格式 YYYY-MM-DD
 * @returns {Object} 会议室可用时间响应
 */
export function getRoomAvailableTime(roomId, date) {
  console.log('获取会议室可用时间，ID：', roomId, '日期：', date);
  
  if (!roomId) {
    return {
      code: 400,
      message: '会议室ID不能为空',
      data: null
    };
  }
  
  if (!date) {
    return {
      code: 400,
      message: '日期不能为空',
      data: null
    };
  }
  
  // 查找会议室
  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    return {
      code: 404,
      message: '会议室不存在',
      data: null
    };
  }
  
  // 从会议数据中获取已预订的会议
  // 避免使用require导入会议模块，改为动态加载JSON数据
  const meetingsData = loadJsonData('/data/json/meetings.json');
  const meetings = meetingsData.meetings || {};
  
  // 筛选当天在该会议室的会议
  const meetingsInRoom = Object.values(meetings).filter(m => 
    m.roomId === roomId && 
    m.startTime.startsWith(date)
  );
  
  // 生成已预订时间段
  const schedules = meetingsInRoom.map(m => ({
    id: m.id,
    title: m.title,
    startTime: m.startTime.split(' ')[1],
    endTime: m.endTime.split(' ')[1],
    organizer: m.organizer.name
  })).sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  return {
    code: 200,
    message: '获取会议室可用时间成功',
    data: {
      roomId,
      date,
      roomName: room.name,
      schedules
    }
  };
}

/**
 * 生成会议室日程
 * @param {Object} data - 包含roomId和date的对象
 * @returns {Object} 会议室日程响应
 */
export function generateRoomSchedule(data) {
  const { roomId, date } = data;
  return getRoomAvailableTime(roomId, date);
}

export default {
  getRoomList,
  getRoomById,
  getRoomAvailableTime,
  generateRoomSchedule
}; 