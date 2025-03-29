/**
 * RPA相关模拟数据
 */

// RPA配置数据
export const rpaConfigData = {
  // 会议ID对应的RPA配置
  '1': {
    meetingId: '1',
    enabled: true,
    recordAudio: true,
    recordVideo: false,
    autoTranscribe: true,
    autoSummary: true,
    settings: {
      audioQuality: 'high',
      language: 'zh-CN',
      speakerIdentification: true,
      noiseReduction: true
    }
  },
  '3': {
    meetingId: '3',
    enabled: true,
    recordAudio: true,
    recordVideo: true,
    autoTranscribe: true,
    autoSummary: true,
    settings: {
      audioQuality: 'high',
      videoQuality: '720p',
      language: 'zh-CN',
      speakerIdentification: true,
      noiseReduction: true
    }
  },
  '5': {
    meetingId: '5',
    enabled: true,
    recordAudio: true,
    recordVideo: true,
    autoTranscribe: false,
    autoSummary: false,
    settings: {
      audioQuality: 'medium',
      videoQuality: '480p',
      language: 'zh-CN',
      speakerIdentification: false,
      noiseReduction: true
    }
  },
  '6': {
    meetingId: '6',
    enabled: true,
    recordAudio: true,
    recordVideo: false,
    autoTranscribe: true,
    autoSummary: true,
    settings: {
      audioQuality: 'high',
      language: 'zh-CN',
      speakerIdentification: true,
      noiseReduction: true
    }
  }
};

// RPA状态数据
export const rpaStatusData = {
  // 会议ID对应的RPA状态
  '1': {
    meetingId: '1',
    status: 'completed',
    recordingTime: 1800, // 30分钟，单位秒
    progress: 100,
    error: null
  },
  '3': {
    meetingId: '3',
    status: 'recording',
    recordingTime: 2400, // 40分钟，单位秒
    progress: 0,
    error: null
  },
  '5': {
    meetingId: '5',
    status: 'idle',
    recordingTime: 0,
    progress: 0,
    error: null
  },
  '6': {
    meetingId: '6',
    status: 'processing',
    recordingTime: 7200, // 2小时，单位秒
    progress: 65,
    error: null
  }
};

// 获取RPA配置
export function getRpaConfig(meetingId) {
  if (!rpaConfigData[meetingId]) {
    return {
      code: 404,
      message: '不存在此会议的RPA配置',
      data: null
    };
  }
  
  return {
    code: 200,
    message: '获取成功',
    data: rpaConfigData[meetingId]
  };
}

// 更新RPA配置
export function updateRpaConfig(meetingId, config) {
  // 如果不存在，则创建新配置
  if (!rpaConfigData[meetingId]) {
    rpaConfigData[meetingId] = {
      meetingId,
      enabled: false,
      recordAudio: false,
      recordVideo: false,
      autoTranscribe: false,
      autoSummary: false,
      settings: {}
    };
  }
  
  // 更新配置
  Object.assign(rpaConfigData[meetingId], config);
  
  return {
    code: 200,
    message: '更新成功',
    data: rpaConfigData[meetingId]
  };
}

// 获取RPA状态
export function getRpaStatus(meetingId) {
  if (!rpaStatusData[meetingId]) {
    return {
      code: 404,
      message: '不存在此会议的RPA状态',
      data: null
    };
  }
  
  return {
    code: 200,
    message: '获取成功',
    data: rpaStatusData[meetingId]
  };
}

// 启动RPA
export function startRpa(meetingId) {
  if (!rpaConfigData[meetingId] || !rpaConfigData[meetingId].enabled) {
    return {
      code: 400,
      message: 'RPA未启用',
      data: null
    };
  }
  
  // 创建或更新状态
  if (!rpaStatusData[meetingId]) {
    rpaStatusData[meetingId] = {
      meetingId,
      status: 'idle',
      recordingTime: 0,
      progress: 0,
      error: null
    };
  }
  
  // 更新状态为recording
  rpaStatusData[meetingId].status = 'recording';
  
  return {
    code: 200,
    message: 'RPA已启动',
    data: rpaStatusData[meetingId]
  };
}

// 停止RPA
export function stopRpa(meetingId) {
  if (!rpaStatusData[meetingId]) {
    return {
      code: 404,
      message: '不存在此会议的RPA状态',
      data: null
    };
  }
  
  // 更新状态为processing（停止录制，开始处理）
  if (rpaStatusData[meetingId].status === 'recording') {
    rpaStatusData[meetingId].status = 'processing';
    rpaStatusData[meetingId].progress = 0;
  }
  
  return {
    code: 200,
    message: 'RPA已停止',
    data: rpaStatusData[meetingId]
  };
}

// 导出API
export default {
  getRpaConfig,
  updateRpaConfig,
  getRpaStatus,
  startRpa,
  stopRpa
}; 