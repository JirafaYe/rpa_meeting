/**
 * API接口数据类型定义
 * 此文件包含了所有与后端交互的数据结构定义
 */

// 通用响应格式
export const ApiResponse = {
  code: 200, // 状态码：200-成功，401-未授权，404-未找到，500-服务器错误
  message: '操作成功', // 提示信息
  data: null // 响应数据，根据接口不同而不同
};

// 分页数据格式
export const PaginationData = {
  total: 0, // 总记录数
  list: [], // 数据列表
  page: 1, // 当前页码
  limit: 10 // 每页条数
};

// =================== 用户相关 ===================

// 用户信息
export const UserInfo = {
  id: '', // 用户ID
  username: '', // 用户名
  name: '', // 姓名
  avatar: '', // 头像
  email: '', // 邮箱
  phone: '', // 手机号
  department: '', // 部门
  position: '', // 职位
  role: '', // 角色：admin-管理员，user-普通用户
  status: '', // 状态：active-活跃，inactive-禁用
  lastLoginTime: '' // 最后登录时间
};

// 用户登录请求
export const LoginRequest = {
  username: '', // 用户名
  password: '' // 密码
};

// 用户登录响应
export const LoginResponse = {
  token: '', // 令牌
  userInfo: {
    id: '', // 用户ID
    name: '', // 姓名
    role: '', // 角色
    avatar: '' // 头像
  }
};

// 用户列表请求参数
export const UserListRequest = {
  page: 1, // 页码
  limit: 10, // 每页条数
  keyword: '', // 关键词
  status: '' // 状态
};

// 用户创建/更新请求
export const UserModifyRequest = {
  username: '', // 用户名
  password: '', // 密码（创建时必填）
  name: '', // 姓名
  email: '', // 邮箱
  phone: '', // 手机号
  department: '', // 部门
  position: '', // 职位
  role: '', // 角色
  status: '' // 状态
};

// 部门信息
export const Department = {
  id: '', // 部门ID
  name: '', // 部门名称
  count: 0 // 部门人数
};

// =================== 会议相关 ===================

// 会议信息
export const MeetingInfo = {
  id: '', // 会议ID
  title: '', // 会议标题
  description: '', // 会议描述
  roomId: '', // 会议室ID
  roomName: '', // 会议室名称
  startTime: '', // 开始时间
  endTime: '', // 结束时间
  organizer: {
    id: '', // 组织者ID
    name: '' // 组织者姓名
  },
  type: '', // 会议类型：regular-例行会议，urgent-紧急会议，training-培训会议
  status: '', // 会议状态：pending-待审批，approved-已审批，rejected-已拒绝，canceled-已取消，completed-已完成，in-progress-进行中
  participants: [
    {
      id: '', // 参与者ID
      name: '', // 参与者姓名
      avatar: '', // 参与者头像
      confirmStatus: '' // 确认状态：pending-待确认，confirmed-已确认，declined-已拒绝
    }
  ],
  attachments: [
    {
      id: '', // 附件ID
      name: '', // 附件名称
      url: '', // 附件链接
      size: 0, // 附件大小
      type: '' // 附件类型
    }
  ],
  createTime: '', // 创建时间
  isRpa: false, // 是否为RPA会议
  rpaConfig: null // RPA配置
};

// 会议列表请求参数
export const MeetingListRequest = {
  page: 1, // 页码
  limit: 10, // 每页条数
  keyword: '', // 关键词
  status: '', // 状态
  startDate: '', // 开始日期
  endDate: '', // 结束日期
  organizerId: '', // 组织者ID
  participantId: '' // 参与者ID
};

// 会议创建/更新请求
export const MeetingModifyRequest = {
  title: '', // 会议标题
  description: '', // 会议描述
  roomId: '', // 会议室ID
  startTime: '', // 开始时间
  endTime: '', // 结束时间
  type: '', // 会议类型
  participants: [], // 参与者ID列表
  attachments: [], // 附件列表
  isRpa: false, // 是否为RPA会议
  rpaConfig: null // RPA配置
};

// 会议纪要
export const MeetingMinutes = {
  id: '', // 会议纪要ID
  meetingId: '', // 会议ID
  content: '', // 纪要内容
  creator: {
    id: '', // 创建者ID
    name: '' // 创建者姓名
  },
  createTime: '', // 创建时间
  updateTime: '' // 更新时间
};

// 会议聊天消息
export const MeetingChatMessage = {
  id: '', // 消息ID
  meetingId: '', // 会议ID
  senderId: '', // 发送者ID
  senderName: '', // 发送者姓名
  senderAvatar: '', // 发送者头像
  content: '', // 消息内容
  createTime: '' // 创建时间
};

// =================== 会议室相关 ===================

// 会议室信息
export const RoomInfo = {
  id: '', // 会议室ID
  name: '', // 会议室名称
  location: '', // 会议室位置
  capacity: 0, // 容纳人数
  description: '', // 描述
  status: '', // 状态：available-可用，unavailable-不可用，maintenance-维护中
  equipments: [
    {
      id: '', // 设备ID
      name: '', // 设备名称
      type: '' // 设备类型
    }
  ],
  imageUrl: '', // 会议室图片
  createTime: '' // 创建时间
};

// 会议室列表请求参数
export const RoomListRequest = {
  page: 1, // 页码
  limit: 10, // 每页条数
  keyword: '', // 关键词
  status: '', // 状态
  minCapacity: 0, // 最小容量
  maxCapacity: 0, // 最大容量
  equipmentIds: [] // 设备ID列表
};

// 会议室创建/更新请求
export const RoomModifyRequest = {
  name: '', // 会议室名称
  location: '', // 会议室位置
  capacity: 0, // 容纳人数
  description: '', // 描述
  status: '', // 状态
  equipments: [], // 设备ID列表
  imageUrl: '' // 会议室图片
};

// 会议室设备类型
export const EquipmentType = {
  id: '', // 设备类型ID
  name: '', // 设备类型名称
  icon: '' // 设备类型图标
};

// 会议室日程
export const RoomSchedule = {
  roomId: '', // 会议室ID
  date: '', // 日期
  schedules: [
    {
      meetingId: '', // 会议ID
      title: '', // 会议标题
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      status: '' // 会议状态
    }
  ]
};

// =================== 通知相关 ===================

// 通知信息
export const NotificationInfo = {
  id: '', // 通知ID
  title: '', // 通知标题
  content: '', // 通知内容
  type: '', // 通知类型：meeting-会议通知，system-系统通知
  status: '', // 状态：unread-未读，read-已读
  createTime: '', // 创建时间
  data: null // 额外数据，根据类型不同而不同
};

// 通知列表请求参数
export const NotificationListRequest = {
  page: 1, // 页码
  limit: 10, // 每页条数
  type: '', // 类型
  status: '' // 状态
};

// =================== RPA相关 ===================

// RPA配置信息
export const RpaConfig = {
  meetingId: '', // 会议ID
  enabled: false, // 是否启用
  recordAudio: false, // 是否录音
  recordVideo: false, // 是否录像
  autoTranscribe: false, // 是否自动转写
  autoSummary: false, // 是否自动生成纪要
  settings: null // 其他设置
};

// RPA状态信息
export const RpaStatus = {
  meetingId: '', // 会议ID
  status: '', // 状态：idle-空闲，recording-录制中，processing-处理中，completed-完成，failed-失败
  recordingTime: 0, // 录制时长（秒）
  progress: 0, // 处理进度（0-100）
  error: null // 错误信息
}; 