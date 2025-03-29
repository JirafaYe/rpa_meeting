/**
 * 模拟API系统启动脚本
 * 用于初始化数据和验证系统正常运行
 */
import { loadJsonData, initializeData } from './utils/jsonDataLoader.js';
import { getMeetingById, getMeetingList, getScheduleData } from './meetings.js';

// 测试读取各种JSON数据
function testDataLoading() {
  console.log('开始测试数据加载功能...');
  
  try {
    // 初始化所有数据
    initializeData();
    
    // 加载会议数据
    const meetingsData = loadJsonData('/data/json/meetings.json');
    console.log(`会议数据加载成功，共有 ${Object.keys(meetingsData.meetings || {}).length} 个会议`);
    
    // 加载用户数据
    const usersData = loadJsonData('/data/json/users.json');
    console.log(`用户数据加载成功，共有 ${(usersData.users || []).length} 个用户`);
    
    // 加载会议室数据
    const roomsData = loadJsonData('/data/json/rooms.json');
    console.log(`会议室数据加载成功，共有 ${(roomsData.rooms || []).length} 个会议室`);
    
    // 加载其他数据
    const messagesData = loadJsonData('/data/json/messages.json');
    const filesData = loadJsonData('/data/json/files.json');
    const agendasData = loadJsonData('/data/json/agendas.json');
    
    console.log('数据加载测试完成，所有数据加载正常');
    return true;
  } catch (error) {
    console.error('数据加载测试失败:', error);
    return false;
  }
}

// 测试API调用
function testApiCalls() {
  console.log('开始测试API调用功能...');
  
  try {
    // 使用已导入的函数，无需再导入
    
    // 测试获取会议详情
    const meetingDetail = getMeetingById('3');
    console.log(`会议详情API调用成功，返回会议: ${meetingDetail.data?.title || '未知会议'}`);
    
    // 测试获取会议列表
    const meetingList = getMeetingList();
    console.log(`会议列表API调用成功，返回列表长度: ${meetingList.data?.total || 0}`);
    
    // 测试获取日程数据
    const scheduleData = getScheduleData();
    console.log(`日程数据API调用成功，返回日程数量: ${scheduleData.data?.length || 0}`);
    
    console.log('API调用测试完成，所有API调用正常');
    return true;
  } catch (error) {
    console.error('API调用测试失败:', error);
    return false;
  }
}

// 主函数，测试所有功能
function main() {
  console.log('----- 系统启动 -----');
  console.log('开始初始化数据和测试API...');
  
  const dataLoadingSuccess = testDataLoading();
  if (!dataLoadingSuccess) {
    console.error('数据加载失败，系统无法正常运行');
    return;
  }
  
  const apiCallsSuccess = testApiCalls();
  if (!apiCallsSuccess) {
    console.error('API调用失败，系统可能无法正常运行');
    return;
  }
  
  console.log('----- 系统启动完成 -----');
  console.log('数据模拟系统运行正常，可以开始调试应用');
}

// 启动测试
main(); 