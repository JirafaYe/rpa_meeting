/**
 * 模拟会议文件数据
 */
export const filesData = {
  // 会议ID 5的文件
  '5': [
    {
      id: '1',
      name: '前端开发进度报告.pptx',
      type: 'pptx',
      size: 2048576, // 2MB
      uploadTime: '2023-05-15 14:05',
      uploader: '李四',
      agendaId: '1-1', // 关联议程ID
      path: '/static/files/frontend_progress.pptx',
      approved: true
    },
    {
      id: '2',
      name: '后端开发进度报告.docx',
      type: 'docx',
      size: 1536000, // 1.5MB
      uploadTime: '2023-05-15 14:10',
      uploader: '王五',
      agendaId: '1-2',
      path: '/static/files/backend_progress.docx',
      approved: true
    },
    {
      id: '5',
      name: '系统架构图.pdf',
      type: 'pdf',
      size: 3145728, // 3MB
      uploadTime: '2023-05-15 14:20',
      uploader: '张三',
      agendaId: '1',
      path: '/static/files/system_architecture.pdf',
      approved: true
    },
    {
      id: '6',
      name: '项目进度甘特图.xlsx',
      type: 'xlsx',
      size: 1048576, // 1MB
      uploadTime: '2023-05-15 14:25',
      uploader: '张三',
      agendaId: '1',
      path: '/static/files/project_gantt.xlsx',
      approved: false
    },
    {
      id: '7',
      name: '技术难点分析.txt',
      type: 'txt',
      size: 10240, // 10KB
      uploadTime: '2023-05-15 14:30',
      uploader: '王五',
      agendaId: '3',
      path: '/static/files/technical_challenges.txt',
      approved: false
    }
  ],
  
  // 会议ID 6的文件
  '6': [
    {
      id: '3',
      name: 'Q1业绩报告.pdf',
      type: 'pdf',
      size: 4194304, // 4MB
      uploadTime: '2023-05-20 10:05',
      uploader: '张三',
      agendaId: '1',
      path: '/static/files/q1_performance.pdf',
      approved: true
    },
    {
      id: '4',
      name: '竞品分析报告.pptx',
      type: 'pptx',
      size: 5242880, // 5MB
      uploadTime: '2023-05-20 10:25',
      uploader: '钱七',
      agendaId: '2-2',
      path: '/static/files/competitor_analysis.pptx',
      approved: true
    },
    {
      id: '8',
      name: '用户留存数据分析.xlsx',
      type: 'xlsx',
      size: 2097152, // 2MB
      uploadTime: '2023-05-20 10:15',
      uploader: '赵六',
      agendaId: '2-1',
      path: '/static/files/user_retention.xlsx',
      approved: true
    },
    {
      id: '9',
      name: '营销策略提案.docx',
      type: 'docx',
      size: 1572864, // 1.5MB
      uploadTime: '2023-05-20 10:40',
      uploader: '王五',
      agendaId: '3',
      path: '/static/files/marketing_strategy.docx',
      approved: false
    },
    {
      id: '10',
      name: '市场调研数据.zip',
      type: 'zip',
      size: 10485760, // 10MB
      uploadTime: '2023-05-20 10:45',
      uploader: '李四',
      agendaId: '3',
      path: '/static/files/market_research.zip',
      approved: false
    }
  ],
  
  // 会议ID 1的文件
  '1': [
    {
      id: '11',
      name: '项目计划书.docx',
      type: 'docx',
      size: 524288, // 512KB
      uploadTime: '2025-03-19 14:10',
      uploader: '张三',
      agendaId: '1',
      path: '/static/files/project_plan.docx',
      approved: true
    },
    {
      id: '12',
      name: '问题清单.xlsx',
      type: 'xlsx',
      size: 307200, // 300KB
      uploadTime: '2025-03-19 14:15',
      uploader: '李四',
      agendaId: '2',
      path: '/static/files/issue_list.xlsx',
      approved: true
    },
    {
      id: '13',
      name: '系统架构设计.pdf',
      type: 'pdf',
      size: 1572864, // 1.5MB
      uploadTime: '2025-03-19 14:30',
      uploader: '王五',
      agendaId: '1',
      path: '/static/files/system_architecture.pdf',
      approved: true
    },
    {
      id: '14',
      name: '前端UI设计方案.pdf',
      type: 'pdf',
      size: 2097152, // 2MB
      uploadTime: '2025-03-19 14:35',
      uploader: '李四',
      agendaId: '2',
      path: '/static/files/ui_design.pdf',
      approved: true
    },
    {
      id: '15',
      name: '移动端适配解决方案.pdf',
      type: 'pdf',
      size: 1048576, // 1MB
      uploadTime: '2025-03-19 14:40',
      uploader: '赵六',
      agendaId: '3',
      path: '/static/files/mobile_adaptation.pdf',
      approved: false
    }
  ]
}; 

/**
 * 模拟会议文件数据模块 - 从JSON文件加载和保存数据
 */
import { loadJsonData, saveJsonData } from './utils/jsonDataLoader.js';

// 数据文件路径
const FILES_DATA_PATH = './json/files.json';

// 加载文件数据
let loadedFilesData = loadJsonData(FILES_DATA_PATH);
export const files = loadedFilesData.files || [];

// 保存文件数据到JSON文件
function saveFilesData() {
  return saveJsonData(FILES_DATA_PATH, { files });
}

/**
 * 获取会议文件列表
 * @param {string} meetingId - 会议ID
 * @returns {Object} 文件列表响应
 */
export function getFileList(meetingId) {
  console.log('获取会议文件列表，会议ID：', meetingId);
  
  if (!meetingId) {
    return {
      code: 400,
      message: '会议ID不能为空',
      data: null
    };
  }
  
  // 根据会议ID筛选文件
  const filteredFiles = files.filter(file => file.meetingId === meetingId);
  
  // 按上传时间排序（从新到旧）
  filteredFiles.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));
  
  return {
    code: 200,
    message: '获取会议文件成功',
    data: filteredFiles
  };
}

/**
 * 上传会议文件
 * @param {string} meetingId - 会议ID
 * @param {Object} fileData - 文件数据
 * @returns {Object} 上传结果响应
 */
export function uploadFile(meetingId, fileData) {
  console.log('上传会议文件，会议ID：', meetingId, '数据：', fileData);
  
  if (!meetingId) {
    return {
      code: 400,
      message: '会议ID不能为空',
      data: null
    };
  }
  
  if (!fileData.name) {
    return {
      code: 400,
      message: '文件名不能为空',
      data: null
    };
  }
  
  if (!fileData.url) {
    return {
      code: 400,
      message: '文件URL不能为空',
      data: null
    };
  }
  
  // 生成唯一ID
  const newId = String(Math.max(0, ...files.map(file => parseInt(file.id || '0'))) + 1);
  
  // 根据文件扩展名确定文件类型
  const fileExtension = fileData.name.split('.').pop().toLowerCase();
  let fileType = 'other';
  
  if (['doc', 'docx', 'txt', 'pdf'].includes(fileExtension)) {
    fileType = 'document';
  } else if (['xls', 'xlsx', 'csv'].includes(fileExtension)) {
    fileType = 'spreadsheet';
  } else if (['ppt', 'pptx'].includes(fileExtension)) {
    fileType = 'presentation';
  } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileExtension)) {
    fileType = 'image';
  } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
    fileType = 'audio';
  } else if (['mp4', 'avi', 'mov', 'wmv'].includes(fileExtension)) {
    fileType = 'video';
  }
  
  // 创建新文件
  const newFile = {
    id: newId,
    meetingId: meetingId,
    name: fileData.name,
    type: fileData.type || fileType,
    size: fileData.size || 0,
    url: fileData.url,
    uploadTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    uploaderId: fileData.uploaderId || '1',
    uploaderName: fileData.uploaderName || '用户'
  };
  
  // 添加到文件列表
  files.push(newFile);
  
  // 保存数据
  saveFilesData();
  
  return {
    code: 200,
    message: '上传文件成功',
    data: newFile
  };
}

/**
 * 下载会议文件
 * @param {string} id - 文件ID
 * @returns {Object} 下载结果响应
 */
export function downloadFile(id) {
  console.log('下载会议文件，ID：', id);
  
  if (!id) {
    return {
      code: 400,
      message: '文件ID不能为空',
      data: null
    };
  }
  
  // 查找文件
  const file = files.find(file => file.id === id);
  if (!file) {
    return {
      code: 404,
      message: '文件不存在',
      data: null
    };
  }
  
  return {
    code: 200,
    message: '获取文件下载链接成功',
    data: {
      id: file.id,
      url: file.url,
      name: file.name,
      size: file.size
    }
  };
}

/**
 * 删除会议文件
 * @param {string} id - 文件ID
 * @returns {Object} 删除结果响应
 */
export function deleteFile(id) {
  console.log('删除会议文件，ID：', id);
  
  if (!id) {
    return {
      code: 400,
      message: '文件ID不能为空',
      data: null
    };
  }
  
  // 查找文件
  const index = files.findIndex(file => file.id === id);
  if (index === -1) {
    return {
      code: 404,
      message: '文件不存在',
      data: null
    };
  }
  
  // 删除文件
  files.splice(index, 1);
  
  // 保存数据
  saveFilesData();
  
  return {
    code: 200,
    message: '删除文件成功',
    data: { id }
  };
}

/**
 * 根据会议ID获取文件
 * @param {string} meetingId 会议ID
 * @returns {Array} 文件数组
 */
export function getFilesByMeetingId(meetingId) {
  console.log('根据会议ID获取文件:', meetingId);
  
  if (!meetingId) {
    console.error('会议ID不能为空');
    return [];
  }
  
  try {
    // 从本地JSON文件获取文件
    const files = loadedFilesData.files || [];
    
    if (!Array.isArray(files)) {
      console.error('文件数据格式不正确');
      return [];
    }
    
    // 过滤指定会议的文件
    const meetingFiles = files.filter(file => file.meetingId === meetingId);
    
    // 按上传时间排序（从新到旧）
    meetingFiles.sort((a, b) => {
      const timeA = a.uploadTime ? new Date(a.uploadTime) : 0;
      const timeB = b.uploadTime ? new Date(b.uploadTime) : 0;
      return timeB - timeA;
    });
    
    console.log(`会议${meetingId}的文件数:`, meetingFiles.length);
    return meetingFiles;
  } catch (error) {
    console.error('获取文件异常:', error);
    return [];
  }
}

export default {
  getFileList,
  uploadFile,
  downloadFile,
  deleteFile,
  getFilesByMeetingId
}; 