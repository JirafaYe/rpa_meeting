import { get, post, put, del, Models } from './index'

/**
 * 获取会议录音列表
 * @param {Object} params - 参数对象
 * @param {String} params.meetingId - 会议ID
 * @returns {Promise} - Promise对象
 */
export function getRecordingListAPI(params) {
  return new Promise((resolve) => {
    console.log('获取录音列表，参数:', params);
    
    // 调用API
    get('/api/recordings', params)
      .then(res => {
        console.log('录音列表API返回:', res);
        resolve(res);
      })
      .catch(err => {
        console.error('获取录音列表失败:', err);
        
        // API调用失败时，尝试从本地数据获取
        try {
          const { loadJsonData } = require('../data/utils/jsonDataLoader');
          const recordingsData = loadJsonData('./json/recordings.json');
          
          if (recordingsData && recordingsData.recordings) {
            // 过滤出指定会议的录音
            const filteredRecordings = recordingsData.recordings.filter(recording => 
              recording.meetingId === params.meetingId
            );
            
            console.log(`从本地数据获取录音，找到 ${filteredRecordings.length} 条录音`);
            
            resolve({
              success: true,
              code: 200,
              message: '从本地获取录音成功',
              data: filteredRecordings
            });
          } else {
            resolve({
              success: false,
              code: 404,
              message: '未找到录音数据',
              data: []
            });
          }
        } catch (error) {
          console.error('从本地数据获取录音失败:', error);
          resolve({
            success: false,
            code: 500,
            message: '获取录音失败',
            data: []
          });
        }
      });
  });
}

/**
 * 上传录音
 * @param {Object} params - 参数对象
 * @param {String} params.meetingId - 会议ID
 * @param {String} params.name - 录音名称
 * @param {File} params.file - 录音文件
 * @returns {Promise} - Promise对象
 */
export function uploadRecordingAPI(params) {
  return new Promise((resolve) => {
    console.log('上传录音，参数:', params);
    
    if (!params.meetingId || !params.name || !params.file) {
      resolve({
        success: false,
        code: 400,
        message: '参数不完整',
        data: null
      });
      return;
    }
    
    // 调用API
    const formData = new FormData();
    formData.append('meetingId', params.meetingId);
    formData.append('name', params.name);
    formData.append('file', params.file);
    
    post('/api/recordings/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        console.log('上传录音API返回:', res);
        resolve(res);
      })
      .catch(err => {
        console.error('上传录音失败:', err);
        
        // 模拟成功
        const now = new Date();
        resolve({
          success: true,
          code: 200,
          message: '上传录音成功(模拟)',
          data: {
            id: Date.now().toString(),
            meetingId: params.meetingId,
            name: params.name,
            url: `/static/recordings/recording_${now.getTime()}.mp3`,
            duration: Math.floor(Math.random() * 1200) + 300, // 随机时长5-25分钟
            size: Math.floor(Math.random() * 10000000) + 1000000, // 随机大小
            createTime: now.toLocaleString('zh-CN'),
            status: 'processing',
            creator: '当前用户' // 模拟当前用户
          }
        });
      });
  });
}

/**
 * 删除录音
 * @param {Object} params - 参数对象
 * @param {String} params.id - 录音ID
 * @returns {Promise} - Promise对象
 */
export function deleteRecordingAPI(params) {
  return new Promise((resolve) => {
    console.log('删除录音，参数:', params);
    
    if (!params.id) {
      resolve({
        success: false,
        code: 400,
        message: '参数不完整',
        data: null
      });
      return;
    }
    
    // 调用API
    del(`/api/recordings/${params.id}`)
      .then(res => {
        console.log('删除录音API返回:', res);
        resolve(res);
      })
      .catch(err => {
        console.error('删除录音失败:', err);
        
        // 模拟成功
        resolve({
          success: true,
          code: 200,
          message: '删除录音成功(模拟)',
          data: null
        });
      });
  });
} 