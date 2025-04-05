/**
 * 应用程序常量定义
 * 集中管理所有硬编码常量，避免在代码中分散定义
 */

// 用户相关常量
export const USER_CONSTANTS = {
  // 用户角色
  ROLES: {
    SYS_ADMIN: {
      value: 'sys_admin',
      label: '系统管理员'
    },
    DEPT_ADMIN: {
      value: 'dept_admin',
      label: '部门管理员'
    },
    USER: {
      value: 'user',
      label: '普通用户'
    }
  },
  
  // 用户状态
  STATUS: {
    ACTIVE: {
      value: 'active',
      label: '正常'
    },
    DISABLED: {
      value: 'disabled',
      label: '禁用'
    }
  },
  
  // 默认密码
  DEFAULT_PASSWORD: '123456'
};

// 部门相关常量
export const DEPARTMENT_CONSTANTS = {
  // 部门列表
  DEPARTMENTS: [
    { id: 'dev', label: '研发部' },
    { id: 'product', label: '产品部' },
    { id: 'design', label: '设计部' },
    { id: 'qa', label: '测试部' },
    { id: 'market', label: '市场部' },
    { id: 'hr', label: '人事部' },
    { id: 'finance', label: '财务部' },
    { id: 'admin', label: '行政部' }
  ]
};

// 会议室相关常量
export const ROOM_CONSTANTS = {
  // 会议室状态
  STATUS: {
    AVAILABLE: {
      value: 'available',
      label: '可用'
    },
    OCCUPIED: {
      value: 'occupied',
      label: '占用中'
    },
    MAINTENANCE: {
      value: 'maintenance',
      label: '维护中'
    },
    CLOSED: {
      value: 'closed',
      label: '已关闭'
    }
  },
  
  // 会议室设备
  EQUIPMENT: [
    { id: 'projector', label: '投影仪' },
    { id: 'whiteboard', label: '白板' },
    { id: 'video_conf', label: '视频会议系统' },
    { id: 'audio_sys', label: '音响系统' },
    { id: 'display', label: '显示屏' },
    { id: 'computer', label: '电脑' },
    { id: 'network', label: '网络设备' }
  ]
};

// 会议相关常量
export const MEETING_CONSTANTS = {
  // 会议状态
  STATUS: {
    PENDING: {
      value: 'pending',
      label: '待审批'
    },
    APPROVED: {
      value: 'approved',
      label: '已批准'
    },
    REJECTED: {
      value: 'rejected',
      label: '已拒绝'
    },
    CANCELLED: {
      value: 'cancelled',
      label: '已取消'
    },
    COMPLETED: {
      value: 'completed',
      label: '已完成'
    }
  },
  
  // 会议类型
  TYPES: [
    { id: 'regular', label: '常规会议' },
    { id: 'project', label: '项目会议' },
    { id: 'training', label: '培训' },
    { id: 'workshop', label: '研讨会' },
    { id: 'interview', label: '面试' },
    { id: 'team_building', label: '团队建设' },
    { id: 'other', label: '其他' }
  ]
};

// 通知相关常量
export const NOTIFICATION_CONSTANTS = {
  // 通知类型
  TYPES: {
    MEETING: {
      value: 'meeting',
      label: '会议通知'
    },
    SYSTEM: {
      value: 'system',
      label: '系统通知'
    },
    APPROVAL: {
      value: 'approval',
      label: '审批通知'
    },
    REMINDER: {
      value: 'reminder',
      label: '提醒'
    },
    CANCEL: {
      value: 'cancel',
      label: '取消通知'
    }
  },
  
  // 通知状态
  STATUS: {
    READ: {
      value: 'read',
      label: '已读'
    },
    UNREAD: {
      value: 'unread',
      label: '未读'
    }
  }
};

// RPA相关常量
export const RPA_CONSTANTS = {
  // RPA任务状态
  TASK_STATUS: {
    RUNNING: {
      value: 'running',
      label: '运行中'
    },
    STOPPED: {
      value: 'stopped',
      label: '已停止'
    },
    SCHEDULED: {
      value: 'scheduled',
      label: '已计划'
    },
    ERROR: {
      value: 'error',
      label: '出错'
    }
  }
};

// 导出所有常量
export default {
  USER: USER_CONSTANTS,
  DEPARTMENT: DEPARTMENT_CONSTANTS,
  ROOM: ROOM_CONSTANTS,
  MEETING: MEETING_CONSTANTS,
  NOTIFICATION: NOTIFICATION_CONSTANTS,
  RPA: RPA_CONSTANTS
}; 