// 模拟用户数据
export const users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    avatar: '/static/images/avatar/admin.png',
    email: 'admin@example.com',
    phone: '13800000000',
    department: '管理部',
    position: '系统管理员',
    role: 'admin',
    status: 'active',
    lastLoginTime: '2023-04-01 08:30:00'
  },
  {
    id: '2',
    username: 'user1',
    password: 'user123',
    name: '张三',
    avatar: '/static/images/avatar/user1.png',
    email: 'zhangsan@example.com',
    phone: '13800000001',
    department: '技术部',
    position: '前端开发工程师',
    role: 'user',
    status: 'active',
    lastLoginTime: '2023-04-02 09:15:00'
  },
  {
    id: '3',
    username: 'user2',
    password: 'user123',
    name: '李四',
    avatar: '/static/images/avatar/user2.png',
    email: 'lisi@example.com',
    phone: '13800000002',
    department: '产品部',
    position: '产品经理',
    role: 'user',
    status: 'active',
    lastLoginTime: '2023-04-02 10:20:00'
  },
  {
    id: '4',
    username: 'user3',
    password: 'user123',
    name: '王五',
    avatar: '/static/images/avatar/user3.png',
    email: 'wangwu@example.com',
    phone: '13800000003',
    department: '市场部',
    position: '市场总监',
    role: 'user',
    status: 'active',
    lastLoginTime: '2023-04-01 16:45:00'
  }
];

// 生成部门数据
export const departments = [
  { id: '1', name: '管理部', count: 1 },
  { id: '2', name: '研发部', count: 10 },
  { id: '3', name: '产品部', count: 5 },
  { id: '4', name: '设计部', count: 3 },
  { id: '5', name: '市场部', count: 4 },
  { id: '6', name: '销售部', count: 6 }
];

// 模拟登录功能
export function login(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: `mock-token-${user.id}-${Date.now()}`,
        userInfo: {
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      }
    };
  }
  
  return {
    code: 401,
    message: '用户名或密码错误',
    data: null
  };
}

// 根据ID获取用户信息
export function getUserById(id) {
  const user = users.find(u => u.id === id);
  if (user) {
    const { password, ...userInfo } = user;
    return {
      code: 200,
      message: '获取成功',
      data: userInfo
    };
  }
  
  return {
    code: 404,
    message: '用户不存在',
    data: null
  };
}

// 获取当前用户信息
export function getUserInfo() {
  // 假设当前登录用户是 ID 2 的用户
  const currentUser = users.find(u => u.id === '2');
  
  if (!currentUser) {
    return {
      code: 401,
      message: '未登录或登录已过期',
      data: null
    };
  }
  
  // 排除密码字段
  const { password, ...userInfo } = currentUser;
  
  return {
    code: 200,
    message: '获取成功',
    data: userInfo
  };
}

// 更新用户信息
export function updateUserInfo(data) {
  // 假设当前登录用户是 ID 2 的用户
  const currentUser = users.find(u => u.id === '2');
  
  if (!currentUser) {
    return {
      code: 401,
      message: '未登录或登录已过期',
      data: null
    };
  }
  
  // 更新用户信息，但不更新敏感字段
  const { password, username, role, ...updateFields } = data;
  
  // 更新用户信息
  Object.assign(currentUser, updateFields);
  
  return {
    code: 200,
    message: '更新成功',
    data: { ...currentUser, password: undefined }
  };
}

// 修改密码
export function changePassword(data) {
  // 假设当前登录用户是 ID 2 的用户
  const currentUser = users.find(u => u.id === '2');
  
  if (!currentUser) {
    return {
      code: 401,
      message: '未登录或登录已过期',
      data: null
    };
  }
  
  // 验证原密码
  if (data.oldPassword !== currentUser.password) {
    return {
      code: 400,
      message: '原密码不正确',
      data: null
    };
  }
  
  // 更新密码
  currentUser.password = data.newPassword;
  
  return {
    code: 200,
    message: '密码修改成功',
    data: { success: true }
  };
}

// 修改密码 (Mock)
export function changePasswordMock(data) {
  // 假设当前登录用户是 ID 2 的用户
  const currentUser = users.find(u => u.id === '2');
  
  if (!currentUser) {
    return {
      code: 401,
      message: '未登录或登录已过期',
      data: null
    };
  }
  
  // 验证原密码
  if (data.oldPassword !== currentUser.password) {
    return {
      code: 400,
      message: '原密码不正确',
      data: null
    };
  }
  
  // 更新密码
  currentUser.password = data.newPassword;
  
  return {
    code: 200,
    message: '密码修改成功',
    data: { success: true }
  };
}

// 获取用户列表
export function getUserList(params = {}) {
  const { page = 1, limit = 10, keyword, status } = params;
  
  let filteredUsers = [...users];
  
  // 根据关键词过滤
  if (keyword) {
    filteredUsers = filteredUsers.filter(u => 
      u.name.includes(keyword) || 
      u.username.includes(keyword) ||
      u.email.includes(keyword) ||
      u.phone.includes(keyword)
    );
  }
  
  // 根据状态过滤
  if (status) {
    filteredUsers = filteredUsers.filter(u => u.status === status);
  }
  
  // 分页
  const start = (page - 1) * limit;
  const end = start + Number(limit);
  const paginatedUsers = filteredUsers.slice(start, end);
  
  // 移除密码字段
  const safeUsers = paginatedUsers.map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      total: filteredUsers.length,
      list: safeUsers
    }
  };
} 