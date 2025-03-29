/**
 * 会议列表功能测试脚本
 * 用于验证会议列表数据的获取和格式化
 */

// 测试不同类型的会议列表获取
const { getMeetingList, meetings } = require('./data/meetings.js');

// 1. 打印原始会议数据
console.log('原始会议数据:');
console.log('会议总数:', Object.keys(meetings).length);
console.log('会议详情:', meetings);
console.log('----------------------------');

// 2. 测试获取所有会议
const allMeetings = getMeetingList({});
console.log('获取所有会议:');
console.log('会议列表长度:', allMeetings.data.list.length);
console.log('会议列表:', allMeetings.data.list);
console.log('----------------------------');

// 3. 测试获取我发起的会议
const initiatedMeetings = getMeetingList({ type: 'initiated' });
console.log('获取我发起的会议:');
console.log('会议列表长度:', initiatedMeetings.data.list.length);
console.log('会议列表:', initiatedMeetings.data.list);
console.log('----------------------------');

// 4. 测试获取我参与的会议
const participatedMeetings = getMeetingList({ type: 'participated' });
console.log('获取我参与的会议:');
console.log('会议列表长度:', participatedMeetings.data.list.length);
console.log('会议列表:', participatedMeetings.data.list);
console.log('----------------------------');

// 5. 测试格式化会议数据的函数
function formatMeetingData(meeting) {
  // 提取日期和时间
  let date = '', startTime = '', endTime = '';
  if (meeting.startTime) {
    const parts = meeting.startTime.split(' ');
    if (parts.length >= 2) {
      date = parts[0];
      startTime = parts[1];
    }
  }
  
  if (meeting.endTime) {
    const parts = meeting.endTime.split(' ');
    if (parts.length >= 2) {
      endTime = parts[1];
    }
  }
  
  // 返回格式化的会议信息
  return {
    id: meeting.id,
    title: meeting.title || '未命名会议',
    description: meeting.description || '',
    date: date,
    startTime: startTime,
    endTime: endTime,
    room: meeting.roomName || '未指定',
    status: meeting.status || 'pending',
    type: meeting.type || 'regular',
    organizer: meeting.organizer || {},
    participants: meeting.participants || [],
    attachments: meeting.attachments || []
  };
}

// 格式化所有会议
const formattedMeetings = allMeetings.data.list.map(formatMeetingData);
console.log('格式化后的会议:');
console.log('会议列表长度:', formattedMeetings.length);
console.log('格式化后的会议列表:', formattedMeetings);
console.log('----------------------------');

// 6. 测试按状态筛选会议
const inProgressMeetings = getMeetingList({ status: 'in-progress' });
console.log('获取进行中的会议:');
console.log('会议列表长度:', inProgressMeetings.data.list.length);
console.log('会议列表:', inProgressMeetings.data.list);
console.log('----------------------------');

console.log('测试完成!'); 