# 应用从后端获取的变量名与数据流

## 用户相关变量

### 认证数据
- **登录响应**：
  - `token` - 用户认证令牌
  - `userInfo.id` - 用户ID
  - `userInfo.name` - 用户姓名
  - `userInfo.role` - 用户角色
  - `userInfo.avatar` - 用户头像

### 用户信息
- **用户详情**：
  - `id` - 用户ID
  - `username` - 登录用户名
  - `name` - 真实姓名
  - `avatar` - 头像URL
  - `email` - 邮箱
  - `phone` - 电话
  - `department` - 部门
  - `position` - 职位
  - `role` - 角色(user/admin)
  - `status` - 状态(active/inactive)
  - `lastLoginTime` - 最后登录时间

### 用户列表
- **分页数据**：
  - `total` - 总记录数
  - `list` - 用户列表
  - `page` - 当前页码
  - `limit` - 每页记录数

### 部门信息
- `id` - 部门ID
- `name` - 部门名称
- `count` - 部门人数

## 会议相关变量

### 会议列表/详情
- `id` - 会议ID
- `title` - 会议标题
- `description` - 会议描述
- `roomId` - 会议室ID
- `roomName` - 会议室名称
- `startTime` - 开始时间
- `endTime` - 结束时间
- `organizer.id` - 组织者ID
- `organizer.name` - 组织者姓名
- `type` - 会议类型
- `status` - 会议状态(pending/approved/canceled/completed)
- `participants` - 参会人员列表
- `attachments` - 附件列表
- `createTime` - 创建时间
- `isRpa` - 是否启用RPA
- `rpaConfig` - RPA配置信息

### 会议纪要
- `id` - 纪要ID
- `meetingId` - 会议ID
- `content` - 纪要内容
- `creator.id` - 创建者ID
- `creator.name` - 创建者姓名
- `createTime` - 创建时间
- `updateTime` - 更新时间

### 会议聊天
- `id` - 消息ID
- `meetingId` - 会议ID
- `senderId` - 发送者ID
- `senderName` - 发送者姓名
- `senderAvatar` - 发送者头像
- `content` - 消息内容
- `createTime` - 发送时间

## 会议室相关变量

### 会议室信息
- `id` - 会议室ID
- `name` - 会议室名称
- `location` - 位置
- `capacity` - 容量
- `description` - 描述
- `status` - 状态(available/maintenance)
- `equipments` - 设备列表
- `imageUrl` - 图片URL
- `createTime` - 创建时间

### 会议室日程
- `roomId` - 会议室ID
- `date` - 日期
- `schedules` - 日程安排列表

## 通知相关变量

### 通知信息
- `id` - 通知ID
- `title` - 标题
- `content` - 内容
- `type` - 类型(system/meeting)
- `status` - 状态(read/unread)
- `createTime` - 创建时间
- `data` - 关联数据

## RPA相关变量

### RPA配置
- `meetingId` - 会议ID
- `enabled` - 是否启用
- `recordAudio` - 是否录制音频
- `recordVideo` - 是否录制视频
- `autoTranscribe` - 是否自动转写
- `autoSummary` - 是否自动生成摘要
- `settings` - 其他设置

### RPA状态
- `meetingId` - 会议ID
- `status` - 状态(idle/recording/processing/completed/error)
- `recordingTime` - 录制时间
- `progress` - 处理进度
- `error` - 错误信息

## 存储在Vuex中的主要状态变量

### 用户模块(user)
- `token` - 认证令牌
- `userInfo` - 用户信息对象
- `isLoggedIn` - 登录状态

### 会议模块(meeting)
- `meetingList` - 会议列表
- `currentMeeting` - 当前会议详情
- `meetingRooms` - 会议室列表
- `meetingForm` - 会议表单数据

## 数据流向
1. **API请求流**:
   - 组件/页面 → `store actions`(`login`/`getMeetingList`等) → API服务(`api.user.login`) → 后端接口

2. **响应数据流**:
   - 后端接口 → API响应处理(`responseInterceptor`) → 数据模型转换(`Models.createUserInfo`等) → `store mutations`(`SET_USER_INFO`等) → 组件渲染

3. **本地存储**:
   - `token`和`userInfo`保存在`uni.storage`中，实现页面刷新后的状态保持

4. **错误处理流**:
   - 请求错误 → 错误拦截 → 提示用户(`uni.showToast`) → 登录失效时跳转登录页 