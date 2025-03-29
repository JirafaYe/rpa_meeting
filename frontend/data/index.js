/**
 * 数据模块入口 - 统一导出各模块数据
 */

// 导入处理模块
import * as userMock from './users.js';
import * as meetingMock from './meetings.js';
import * as roomMock from './rooms.js';
import * as notificationMock from './notifications.js';
import * as rpaMock from './rpa.js';
import * as agendaMock from './agendas.js';
import * as messageMock from './messages.js';
import * as recordingMock from './recordings.js';
import * as fileMock from './files.js';

// 导出静态数据
export const { meetings } = meetingMock;
export const { users, departments } = userMock;
export const { rooms, equipmentTypes } = roomMock;
export const { notifications } = notificationMock;
export const { rpaConfigs, rpaStatus } = rpaMock;
export const { agendas } = agendaMock;
export const { messages } = messageMock;
export const { recordings } = recordingMock;
export const { files } = fileMock;

// 导出用户相关函数
export const userAPI = {
  login: userMock.login,
  getUserById: userMock.getUserById,
  getUserList: userMock.getUserList,
  getUserInfo: userMock.getUserInfo,
  updateUserInfo: userMock.updateUserInfo,
  changePassword: userMock.changePassword
};

// 导出会议相关函数
export const meetingAPI = {
  getMeetingList: meetingMock.getMeetingList,
  getMeetingById: meetingMock.getMeetingById,
  generateMeetingMinutes: meetingMock.generateMeetingMinutes,
  getScheduleData: meetingMock.getScheduleData,
  createMeeting: meetingMock.createMeeting,
  updateMeeting: meetingMock.updateMeeting,
  cancelMeeting: meetingMock.cancelMeeting,
  rejectParticipation: meetingMock.rejectParticipation
};

// 导出会议室相关函数
export const roomAPI = {
  getRoomList: roomMock.getRoomList,
  getRoomById: roomMock.getRoomById,
  getRoomAvailableTime: roomMock.getRoomAvailableTime,
  generateRoomSchedule: roomMock.generateRoomSchedule
};

// 导出通知相关函数
export const notificationAPI = {
  getNotificationList: notificationMock.getNotificationList,
  markAsRead: notificationMock.markAsRead,
  markAllAsRead: notificationMock.markAllAsRead
};

// 导出RPA相关函数
export const rpaAPI = {
  getRpaConfig: rpaMock.getRpaConfig,
  updateRpaConfig: rpaMock.updateRpaConfig,
  getRpaStatus: rpaMock.getRpaStatus,
  startRpa: rpaMock.startRpa,
  stopRpa: rpaMock.stopRpa
};

// 导出会议议程相关函数
export const agendaAPI = {
  getAgendaList: agendaMock.getAgendaList,
  createAgenda: agendaMock.createAgenda,
  updateAgenda: agendaMock.updateAgenda,
  deleteAgenda: agendaMock.deleteAgenda
};

// 导出会议消息相关函数
export const messageAPI = {
  getMessageList: messageMock.getMessageList,
  sendMessage: messageMock.sendMessage
};

// 导出录音相关函数
export const recordingAPI = {
  getRecordingList: recordingMock.getRecordingList,
  uploadRecording: recordingMock.uploadRecording,
  downloadRecording: recordingMock.downloadRecording
};

// 导出文件相关函数
export const fileAPI = {
  getFileList: fileMock.getFileList,
  uploadFile: fileMock.uploadFile,
  downloadFile: fileMock.downloadFile,
  deleteFile: fileMock.deleteFile
};

// 默认导出所有API和数据
export default {
  // 数据
  users,
  departments,
  meetings,
  rooms,
  equipmentTypes,
  notifications,
  rpaConfigs,
  rpaStatus,
  agendas,
  messages,
  recordings,
  files,
  
  // API
  userAPI,
  meetingAPI,
  roomAPI,
  notificationAPI,
  rpaAPI,
  agendaAPI,
  messageAPI,
  recordingAPI,
  fileAPI
}; 