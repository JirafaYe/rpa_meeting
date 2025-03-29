/**
 * JSON数据加载和处理工具
 * 用于从JSON文件加载数据并进行动态处理
 */

// 动态日期标记处理
const dynamicDatePatterns = {
  'dynamic_date_morning': () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 09:30`;
  },
  'dynamic_date_morning_end': () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 11:00`;
  },
  'dynamic_date_morning_upload': () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 08:45`;
  },
  'dynamic_date_afternoon': () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 14:00`;
  },
  'dynamic_date_afternoon_end': () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 15:30`;
  },
  'dynamic_date_evening': () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 16:30`;
  },
  'dynamic_date_evening_end': () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 18:00`;
  },
  'dynamic_date_yesterday': () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')} 16:00`;
  },
  'dynamic_date_yesterday_evening': () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')} 17:30`;
  },
  'dynamic_date_days_ago_2': () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 2);
    return `${daysAgo.getFullYear()}-${String(daysAgo.getMonth() + 1).padStart(2, '0')}-${String(daysAgo.getDate()).padStart(2, '0')} 10:00`;
  },
  'dynamic_date_days_ago_3': () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 3);
    return `${daysAgo.getFullYear()}-${String(daysAgo.getMonth() + 1).padStart(2, '0')}-${String(daysAgo.getDate()).padStart(2, '0')} 10:00`;
  }
};

/**
 * 处理动态日期标记，将标记转换为实际日期
 * @param {*} value - 需要处理的值
 * @returns {*} 处理后的值
 */
function processDynamicDates(value) {
  if (typeof value === 'string' && dynamicDatePatterns[value]) {
    return dynamicDatePatterns[value]();
  }
  
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return value.map(item => processDynamicDates(item));
    } else {
      const result = {};
      for (const key in value) {
        result[key] = processDynamicDates(value[key]);
      }
      return result;
    }
  }
  
  return value;
}

// JSON数据缓存
const jsonDataCache = {
  // 会议数据
  '/data/json/meetings.json': {
    meetings: {
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
        "attachments": [
          {
            "id": "1",
            "name": "项目进度报告.docx",
            "type": "document",
            "size": 2048,
            "url": "/static/files/project_report.docx",
            "uploadTime": "2023-05-14 15:30"
          }
        ],
        "createTime": "2023-05-10 10:00",
        "isRpa": true,
        "rpaConfig": {
          "meetingId": "3",
          "enabled": true,
          "recordAudio": true,
          "recordVideo": true,
          "autoTranscribe": true,
          "autoSummary": true,
          "settings": {
            "audioQuality": "high",
            "videoQuality": "720p",
            "language": "zh-CN",
            "speakerIdentification": true,
            "noiseReduction": true
          }
        }
      },
      "101": {
        "id": "101",
        "title": "产品需求评审会议",
        "description": "讨论新产品功能的需求细节和实现方案",
        "roomId": "1",
        "roomName": "大会议室",
        "startTime": "dynamic_date_morning",
        "endTime": "dynamic_date_morning_end",
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
          },
          {
            "id": "3",
            "name": "王五",
            "avatar": "/static/images/avatar/user3.png",
            "confirmed": true
          }
        ],
        "attachments": [
          {
            "id": "101-1",
            "name": "产品需求文档.pdf",
            "type": "document",
            "size": 3584,
            "url": "/static/files/requirements.pdf",
            "uploadTime": "dynamic_date_morning_upload"
          }
        ],
        "createTime": "dynamic_date_yesterday",
        "isRpa": true,
        "rpaConfig": {
          "meetingId": "101",
          "enabled": true,
          "recordAudio": true,
          "recordVideo": false,
          "autoTranscribe": true,
          "autoSummary": true,
          "settings": {
            "audioQuality": "high",
            "language": "zh-CN",
            "speakerIdentification": true,
            "noiseReduction": true
          }
        }
      }
    }
  },
  
  // 用户数据
  '/data/json/users.json': {
    users: [
      {
        "id": "1",
        "name": "张三",
        "avatar": "/static/images/avatar/user1.png",
        "email": "zhangsan@example.com",
        "phone": "13800001111",
        "department": "技术部",
        "role": "admin",
        "position": "技术经理",
        "status": "active",
        "lastLoginTime": "2023-05-14 09:23:45"
      },
      {
        "id": "2",
        "name": "李四",
        "avatar": "/static/images/avatar/user2.png",
        "email": "lisi@example.com",
        "phone": "13800002222",
        "department": "产品部",
        "role": "user",
        "position": "产品经理",
        "status": "active",
        "lastLoginTime": "2023-05-14 10:15:30"
      },
      {
        "id": "3",
        "name": "王五",
        "avatar": "/static/images/avatar/user3.png",
        "email": "wangwu@example.com",
        "phone": "13800003333",
        "department": "技术部",
        "role": "user",
        "position": "前端开发",
        "status": "active",
        "lastLoginTime": "2023-05-13 16:42:10"
      }
    ],
    departments: [
      {
        "id": "1",
        "name": "技术部",
        "leaderId": "1",
        "parentId": null
      },
      {
        "id": "2",
        "name": "产品部",
        "leaderId": "2",
        "parentId": null
      },
      {
        "id": "3",
        "name": "设计部",
        "leaderId": "4",
        "parentId": null
      }
    ]
  },
  
  // 会议室数据
  '/data/json/rooms.json': {
    rooms: [
      {
        "id": "1",
        "name": "大会议室",
        "location": "总部1楼",
        "capacity": 20,
        "equipment": ["投影仪", "视频会议系统", "白板"],
        "status": "available",
        "description": "适合大型会议和培训",
        "bookable": true
      },
      {
        "id": "2",
        "name": "小会议室A",
        "location": "总部2楼",
        "capacity": 8,
        "equipment": ["电视", "视频会议系统"],
        "status": "available",
        "description": "适合小组讨论",
        "bookable": true
      }
    ],
    equipmentTypes: [
      {
        "id": "1",
        "name": "投影仪",
        "icon": "projector"
      },
      {
        "id": "2",
        "name": "视频会议系统",
        "icon": "video-conference"
      },
      {
        "id": "3",
        "name": "白板",
        "icon": "whiteboard"
      }
    ]
  },
  
  // 消息数据
  '/data/json/messages.json': {
    messages: [
      {
        "id": "1",
        "meetingId": "101",
        "senderId": "1",
        "senderName": "张三",
        "content": "请大家准时参加会议",
        "timestamp": "dynamic_date_yesterday",
        "isSystem": false
      },
      {
        "id": "2",
        "meetingId": "101",
        "senderId": "2",
        "senderName": "李四",
        "content": "收到，会准备相关材料",
        "timestamp": "dynamic_date_yesterday",
        "isSystem": false
      }
    ]
  },
  
  // 文件数据
  '/data/json/files.json': {
    files: [
      {
        "id": "1",
        "name": "项目进度报告.docx",
        "type": "document",
        "size": 2048,
        "url": "/static/files/project_report.docx",
        "uploadTime": "2023-05-14 15:30",
        "uploaderId": "1",
        "meetingId": "3"
      },
      {
        "id": "2",
        "name": "产品需求文档.pdf",
        "type": "document",
        "size": 3584,
        "url": "/static/files/requirements.pdf",
        "uploadTime": "dynamic_date_morning_upload",
        "uploaderId": "2",
        "meetingId": "101"
      }
    ]
  },
  
  // 议程数据
  '/data/json/agendas.json': {
    agendas: [
      {
        "id": "1",
        "meetingId": "101",
        "title": "产品需求讨论",
        "description": "讨论新功能的实现方案",
        "duration": 30,
        "order": 1,
        "presenter": "李四"
      },
      {
        "id": "2",
        "meetingId": "101",
        "title": "技术方案评审",
        "description": "评审技术实现方案",
        "duration": 20,
        "order": 2,
        "presenter": "王五"
      }
    ]
  },
  
  // 录音数据
  '/data/json/recordings.json': {
    recordings: [
      {
        "id": "1",
        "meetingId": "3",
        "name": "项目进度例会录音",
        "url": "/static/recordings/meeting_3.mp3",
        "duration": 3600,
        "size": 10240,
        "createTime": "2023-05-15 10:05"
      }
    ]
  },
  
  // 通知数据
  '/data/json/notifications.json': {
    notifications: [
      {
        "id": "1",
        "userId": "1",
        "title": "会议邀请",
        "content": "您被邀请参加产品需求评审会议",
        "type": "meeting_invite",
        "relatedId": "101",
        "createTime": "dynamic_date_yesterday",
        "isRead": false
      },
      {
        "id": "2",
        "userId": "1",
        "title": "会议提醒",
        "content": "项目进度例会将在15分钟后开始",
        "type": "meeting_reminder",
        "relatedId": "3",
        "createTime": "2023-05-15 08:45",
        "isRead": true
      }
    ]
  },
  
  // RPA数据
  '/data/json/rpa.json': {
    rpaConfigs: [
      {
        "id": "1",
        "meetingId": "3",
        "enabled": true,
        "recordAudio": true,
        "recordVideo": true,
        "autoTranscribe": true,
        "autoSummary": true
      },
      {
        "id": "2",
        "meetingId": "101",
        "enabled": true,
        "recordAudio": true,
        "recordVideo": false,
        "autoTranscribe": true,
        "autoSummary": true
      }
    ],
    rpaStatus: {
      "isRunning": true,
      "lastRunTime": "dynamic_date_morning",
      "currentMeetingId": "101",
      "currentStatus": "recording"
    }
  }
};

// 模拟获取数据的方法，仅用于浏览器环境测试
function _getFakeData(path) {
  console.log('获取模拟数据：', path);
  
  // 如果缓存中有数据，直接返回
  if (jsonDataCache[path]) {
    return JSON.stringify(jsonDataCache[path]);
  }
  
  // 未找到数据，返回空对象
  console.warn('未找到模拟数据:', path);
  return '{}';
}

/**
 * 从JSON文件加载数据
 * @param {string} filePath - JSON文件路径
 * @returns {Object} 处理后的数据对象
 */
export function loadJsonData(filePath) {
  console.log('加载数据:', filePath);
  
  // 处理相对路径，在当前项目根目录下查找
  const processedPath = filePath.startsWith('./') ? '/data' + filePath.substring(1) : filePath;
  console.log('处理后的路径:', processedPath);
  
  // 检查数据缓存
  if (jsonDataCache[processedPath]) {
    console.log('从缓存加载数据:', processedPath);
    return processDynamicDates(JSON.parse(JSON.stringify(jsonDataCache[processedPath])));
  }
  
  try {
    // 使用fs模块读取JSON文件
    // 这里应该是真实环境中的实现，但在浏览器中会被模拟
    const rawData = _getFakeData(processedPath);
    const data = JSON.parse(rawData);
    
    // 将数据保存到缓存
    jsonDataCache[processedPath] = data;
    
    console.log('已成功加载数据:', processedPath);
    return processDynamicDates(data);
  } catch (error) {
    console.error('加载数据文件失败:', processedPath, error);
    return {};
  }
}

/**
 * 保存数据到JSON文件
 * @param {string} filePath - JSON文件路径
 * @param {Object} data - 要保存的数据
 * @returns {boolean} 是否保存成功
 */
export function saveJsonData(filePath, data) {
  try {
    console.log(`保存数据: ${filePath}`);
    
    // 处理路径格式，将相对路径转换为绝对路径
    let absolutePath = filePath;
    if (filePath.startsWith('./json/')) {
      // 如果路径是./json/xxx.json格式，转换为/data/json/xxx.json
      absolutePath = `/data/json/${filePath.substring(7)}`;
    } else if (filePath.startsWith('./')) {
      // 如果路径是./xxx.json格式，转换为/data/json/xxx.json
      absolutePath = `/data/json/${filePath.substring(2)}`;
    } else if (!filePath.startsWith('/data/')) {
      // 如果路径不是以/data/开头，添加/data/json/前缀
      absolutePath = filePath.startsWith('/') ? `/data/json${filePath}` : `/data/json/${filePath}`;
    }
    
    console.log(`处理后的路径: ${absolutePath}`);
    
    // 更新缓存
    jsonDataCache[absolutePath] = JSON.parse(JSON.stringify(data));
    
    // 持久化数据（实际环境中会保存到文件或发送到服务器）
    // 这里仅模拟保存成功
    console.log(`数据已保存到缓存: ${absolutePath}`);
    
    return true;
  } catch (error) {
    console.error(`保存JSON数据失败: ${error.message}`);
    return false;
  }
}

/**
 * 初始化所有数据
 * 确保所有必要的数据都已加载到缓存中
 */
export function initializeData() {
  console.log('初始化数据...');
  
  // 获取缓存中所有数据的路径
  const cachedPaths = Object.keys(jsonDataCache);
  console.log(`当前缓存中已有 ${cachedPaths.length} 个数据文件`);
  
  // 检查并初始化必要的数据文件
  const requiredPaths = [
    '/data/json/meetings.json',
    '/data/json/users.json',
    '/data/json/rooms.json',
    '/data/json/messages.json',
    '/data/json/files.json',
    '/data/json/agendas.json',
    '/data/json/recordings.json',
    '/data/json/notifications.json',
    '/data/json/rpa.json'
  ];
  
  // 测试加载每个数据文件
  for (const path of requiredPaths) {
    try {
      const data = loadJsonData(path);
      console.log(`已成功加载数据: ${path}`);
    } catch (error) {
      console.error(`加载数据失败: ${path}`, error);
    }
  }
  
  console.log('数据初始化完成');
}

// 兼容CommonJS模块导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadJsonData,
    saveJsonData
  };
} 