/**
 * 会议数据加载测试
 */
import { getMeetingById, getMeetingsByType } from './meetings.js';
import { getMessagesByMeetingId } from './messages.js';
import { getRecordingsByMeetingId } from './recordings.js';

/**
 * 测试加载会议数据
 */
function testLoadMeetingData() {
  console.log('===== 测试加载会议数据 =====');
  
  // 测试获取所有会议
  const allMeetings = getMeetingsByType();
  console.log('所有会议数量:', allMeetings.total);
  console.log('第一页会议:', allMeetings.list);
  
  // 测试获取会议详情
  if (allMeetings.list && allMeetings.list.length > 0) {
    const firstMeetingId = allMeetings.list[0].id;
    console.log('获取会议详情, ID:', firstMeetingId);
    
    const meetingDetail = getMeetingById(firstMeetingId);
    console.log('会议详情:', meetingDetail);
    
    // 测试获取会议消息
    console.log('获取会议消息, ID:', firstMeetingId);
    const messages = getMessagesByMeetingId(firstMeetingId);
    console.log('会议消息数量:', messages.length);
    console.log('会议消息示例:', messages[0]);
    
    // 测试获取会议录音
    console.log('获取会议录音, ID:', firstMeetingId);
    const recordings = getRecordingsByMeetingId(firstMeetingId);
    console.log('会议录音数量:', recordings.length);
    if (recordings.length > 0) {
      console.log('会议录音示例:', recordings[0]);
    }
  }
  
  console.log('===== 测试完成 =====');
}

// 执行测试
testLoadMeetingData(); 