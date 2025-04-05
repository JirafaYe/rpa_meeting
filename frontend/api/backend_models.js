/**
 * rpa会议的数据模型定义
 * 根据API文档实现的数据模型
 */

// 通用结果对象
export class ResultObject {
  constructor(code = 0, msg = '', data = null) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}

// 通用泛型结果
export class Result {
  constructor(code = 0, msg = '', data = null) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}

// 字符串结果
export class ResultString extends Result {
  constructor(code = 0, msg = '', data = '') {
    super(code, msg, data);
  }
}

// 空结果
export class ResultVoid extends Result {
  constructor(code = 0, msg = '') {
    super(code, msg, null);
  }
}

// 用户模型
export class User {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.username = data.username || '';
    this.avatarUrl = data.avatarUrl || '';
    this.isActive = data.isActive || 0;
    this.createTime = data.createTime || '';
    this.updateTime = data.updateTime || '';
  }
}

// 角色模型
export class Role {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.roleCode = data.roleCode || '';
    this.name = data.name || '';
    this.description = data.description || '';
  }
}

// 登录用户信息
export class LoginUser {
  constructor(data = {}) {
    this.token = data.token || '';
    this.expireTime = data.expireTime || 0;
    this.loginTime = data.loginTime || 0;
    this.user = data.user ? new User(data.user) : new User();
    this.username = data.username || '';
    this.id = data.id || 0;
    this.roles = (data.roles || []).map(role => new Role(role));
  }
}

// 登录用户结果
export class ResultLoginUser extends Result {
  constructor(code = 0, msg = '', data = {}) {
    super(code, msg, new LoginUser(data));
  }
}

// 登录请求体
export class LoginBody {
  constructor(username = '', password = '', code = '', uuid = '') {
    this.username = username;
    this.password = password;
    this.code = code;
    this.uuid = uuid;
  }
}

// 注册请求体
export class RegisterBody {
  constructor(username = '', password = '', code = '', uuid = '') {
    this.username = username;
    this.password = password;
    this.code = code;
    this.uuid = uuid;
  }
}

// 会议室模型
export class MeetingRoom {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.location = data.location || '';
    this.capacity = data.capacity || 0;
    this.equipment = data.equipment || '';
    this.userId = data.userId || 0;
    this.createTime = data.createTime || '';
  }
}

// 会议室请求体
export class MeetingRoomBody {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.location = data.location || '';
    this.capacity = data.capacity || 0;
    this.equipment = data.equipment || '';
  }
}

// 会议预约DTO
export class ReservationDTO {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.topic = data.topic || '';
    this.description = data.description || '';
    this.booker = data.booker || '';
    this.room = data.room || '';
    this.startTime = data.startTime || '';
    this.endTime = data.endTime || '';
    this.status = data.status || '';
    this.reserveDate = data.reserveDate || '';
  }
}

// 会议预约请求体
export class ReservationBody {
  constructor(data = {}) {
    this.topic = data.topic || '';
    this.participants = data.participants || [];
    this.description = data.description || '';
    this.roomId = data.roomId || 0;
    this.startTime = data.startTime || '';
    this.endTime = data.endTime || '';
    this.reserveDate = data.reserveDate || '';
  }
}

// 通知DTO
export class NotificationDTO {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.notifyType = data.notifyType || 0;
    this.title = data.title || '';
  }
}

// 通知详情DTO
export class NotificationDetailsDTO {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.notifyType = data.notifyType || 0;
    this.title = data.title || '';
    this.content = data.content || '';
    this.sender = data.sender || '';
    this.createTime = data.createTime || '';
  }
}

// 参会人员DTO
export class ParticipantDTO {
  constructor(data = {}) {
    this.username = data.username || '';
    this.avatarUrl = data.avatarUrl || '';
    this.status = data.status || 0;
  }
}

// 参会人员结果集
export class ResultListParticipantDTO extends Result {
  constructor(code = 0, msg = '', data = []) {
    super(code, msg, (data || []).map(item => new ParticipantDTO(item)));
  }
}

// 子议题请求体
export class SubtopicsBody {
  constructor(data = {}) {
    this.reservationId = data.reservationId || 0;
    this.subtopics = data.subtopics || '';
    this.description = data.description || '';
  }
}

// 子议题更新请求体
export class SubtopicsUpdateBody {
  constructor(data = {}) {
    this.reservationId = data.reservationId || 0;
    this.subtopics = data.subtopics || '';
    this.description = data.description || '';
    this.id = data.id || 0;
  }
}

// 分页DTO通用
export class PageDTO {
  constructor(total = 0, pages = 0, list = []) {
    this.total = total;
    this.pages = pages;
    this.list = list;
  }
}

// 会议预约分页DTO
export class PageDTOReservationDTO extends PageDTO {
  constructor(data = {}) {
    super(
      data.total || 0,
      data.pages || 0,
      (data.list || []).map(item => new ReservationDTO(item))
    );
  }
}

// 会议预约分页结果
export class ResultPageDTOReservationDTO extends Result {
  constructor(code = 0, msg = '', data = {}) {
    super(code, msg, new PageDTOReservationDTO(data));
  }
}

// 通知分页DTO
export class PageDTONotificationDTO extends PageDTO {
  constructor(data = {}) {
    super(
      data.total || 0,
      data.pages || 0,
      (data.list || []).map(item => new NotificationDTO(item))
    );
  }
}

// 通知分页结果
export class ResultPageDTONotificationDTO extends Result {
  constructor(code = 0, msg = '', data = {}) {
    super(code, msg, new PageDTONotificationDTO(data));
  }
}

// 会议室分页DTO
export class PageDTOMeetingRoom extends PageDTO {
  constructor(data = {}) {
    super(
      data.total || 0,
      data.pages || 0,
      (data.list || []).map(item => new MeetingRoom(item))
    );
  }
}

// 会议室分页结果
export class ResultPageDTOMeetingRoom extends Result {
  constructor(code = 0, msg = '', data = {}) {
    super(code, msg, new PageDTOMeetingRoom(data));
  }
}

// 通知详情结果
export class ResultNotificationDetailsDTO extends Result {
  constructor(code = 0, msg = '', data = {}) {
    super(code, msg, new NotificationDetailsDTO(data));
  }
}

// 所有数据模型导出
export default {
  ResultObject,
  Result,
  ResultString,
  ResultVoid,
  User,
  Role,
  LoginUser,
  ResultLoginUser,
  LoginBody,
  RegisterBody,
  MeetingRoom,
  MeetingRoomBody,
  ReservationDTO,
  ReservationBody,
  NotificationDTO,
  NotificationDetailsDTO,
  ParticipantDTO,
  ResultListParticipantDTO,
  SubtopicsBody,
  SubtopicsUpdateBody,
  PageDTO,
  PageDTOReservationDTO,
  ResultPageDTOReservationDTO,
  PageDTONotificationDTO,
  ResultPageDTONotificationDTO,
  PageDTOMeetingRoom,
  ResultPageDTOMeetingRoom,
  ResultNotificationDetailsDTO
}; 