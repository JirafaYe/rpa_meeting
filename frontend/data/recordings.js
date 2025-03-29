/**
 * 模拟录音数据
 */
export const recordingsData = {
  // 会议ID 5的录音
  '5': [
    {
      id: '1',
      name: '项目进度讨论',
      duration: '28:15',
      createTime: '2025-03-15 14:05',
      path: 'mock://recordings/1'
    },
    {
      id: '2',
      name: '技术难点讨论',
      duration: '32:40',
      createTime: '2025-03-15 14:35',
      path: 'mock://recordings/2'
    },
    {
      id: '3',
      name: '任务分配讨论',
      duration: '15:20',
      createTime: '2025-03-15 15:10',
      path: 'mock://recordings/3'
    }
  ],
  
  // 会议ID 6的录音
  '6': [
    {
      id: '1',
      name: 'Q1成果回顾与Q2规划讨论',
      duration: '56:30',
      createTime: '2025-04-01 10:05',
      path: 'mock://recordings/4'
    },
    {
      id: '2',
      name: '用户增长策略讨论',
      duration: '27:45',
      createTime: '2025-04-01 11:10',
      path: 'mock://recordings/5'
    },
    {
      id: '3',
      name: '竞品分析讨论',
      duration: '22:15',
      createTime: '2025-04-01 11:45',
      path: 'mock://recordings/6'
    }
  ],
  
  // 会议ID 1的录音
  '1': [
    {
      id: '1',
      name: '会议录音1',
      duration: '10:25',
      createTime: '2025-03-19 14:10',
      path: 'mock://recordings/1'
    },
    {
      id: '2',
      name: '会议录音2',
      duration: '15:40',
      createTime: '2025-03-19 14:30',
      path: 'mock://recordings/2'
    }
  ]
};

/**
 * 模拟会议录音数据模块 - 从JSON文件加载和保存数据
 */
import { loadJsonData, saveJsonData } from './utils/jsonDataLoader.js';

// 数据文件路径
const RECORDINGS_DATA_PATH = './json/recordings.json';

// 加载录音数据
let loadedRecordingsData = loadJsonData(RECORDINGS_DATA_PATH);
export const recordings = loadedRecordingsData.recordings || [];

// 保存录音数据到JSON文件
function saveRecordingsData() {
  return saveJsonData(RECORDINGS_DATA_PATH, { recordings });
}

/**
 * 获取会议录音列表
 * @param {string} meetingId - 会议ID
 * @returns {Object} 录音列表响应
 */
export function getRecordingList(meetingId) {
  console.log('获取会议录音列表，会议ID：', meetingId);
  
  if (!meetingId) {
    return {
      code: 400,
      message: '会议ID不能为空',
      data: null
    };
  }
  
  // 根据会议ID筛选录音
  const filteredRecordings = recordings.filter(recording => recording.meetingId === meetingId);
  
  // 按创建时间排序（从新到旧）
  filteredRecordings.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  
  return {
    code: 200,
    message: '获取会议录音成功',
    data: filteredRecordings
  };
}

/**
 * 上传会议录音
 * @param {string} meetingId - 会议ID
 * @param {Object} recordingData - 录音数据
 * @returns {Object} 上传结果响应
 */
export function uploadRecording(meetingId, recordingData) {
  console.log('上传会议录音，会议ID：', meetingId, '数据：', recordingData);
  
  if (!meetingId) {
    return {
      code: 400,
      message: '会议ID不能为空',
      data: null
    };
  }
  
  if (!recordingData.url) {
    return {
      code: 400,
      message: '录音URL不能为空',
      data: null
    };
  }
  
  // 生成唯一ID
  const newId = String(Math.max(0, ...recordings.map(recording => parseInt(recording.id || '0'))) + 1);
  
  // 创建新录音
  const newRecording = {
    id: newId,
    meetingId: meetingId,
    name: recordingData.name || `会议录音${newId}`,
    url: recordingData.url,
    duration: recordingData.duration || 0,
    size: recordingData.size || 0,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: recordingData.status || 'completed',
    transcriptUrl: recordingData.transcriptUrl || null
  };
  
  // 添加到录音列表
  recordings.push(newRecording);
  
  // 保存数据
  saveRecordingsData();
  
  return {
    code: 200,
    message: '上传录音成功',
    data: newRecording
  };
}

/**
 * 下载会议录音
 * @param {string} id - 录音ID
 * @returns {Object} 下载结果响应
 */
export function downloadRecording(id) {
  console.log('下载会议录音，ID：', id);
  
  if (!id) {
    return {
      code: 400,
      message: '录音ID不能为空',
      data: null
    };
  }
  
  // 查找录音
  const recording = recordings.find(recording => recording.id === id);
  if (!recording) {
    return {
      code: 404,
      message: '录音不存在',
      data: null
    };
  }
  
  return {
    code: 200,
    message: '获取录音下载链接成功',
    data: {
      id: recording.id,
      url: recording.url,
      name: recording.name,
      size: recording.size
    }
  };
}

/**
 * 根据会议ID获取录音列表
 * @param {string} meetingId - 会议ID
 * @returns {Array} 录音列表
 */
export function getRecordingsByMeetingId(meetingId) {
  console.log('根据会议ID获取录音列表:', meetingId);
  
  if (!meetingId) {
    throw new Error('会议ID不能为空');
  }
  
  // 判断是否有数据
  if (!recordings || !Array.isArray(recordings) || recordings.length === 0) {
    return [];
  }
  
  // 过滤录音
  let meetingRecordings = recordings.filter(recording => recording.meetingId === meetingId);
  
  // 如果没有找到录音，尝试使用静态数据
  if (meetingRecordings.length === 0 && recordingsData[meetingId]) {
    meetingRecordings = recordingsData[meetingId].map(recording => ({
      ...recording,
      meetingId: meetingId
    }));
  }
  
  // 按创建时间排序（从新到旧）
  meetingRecordings.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  
  return meetingRecordings;
}

export default {
  getRecordingList,
  uploadRecording,
  downloadRecording,
  getRecordingsByMeetingId
}; 