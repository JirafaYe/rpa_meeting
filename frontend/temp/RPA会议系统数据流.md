# RPA会议系统与后端交互数据流

## 一、整体架构

RPA会议系统采用前后端分离的架构，前端使用uni-app开发，后端提供RESTful API接口。数据流向可以概括为：

```
前端视图组件 <-> API封装层 <-> 请求/响应处理层 <-> 模拟数据/后端服务
```

## 二、数据流向详解

### 1. 请求流程

1. **用户界面触发请求**：用户在前端页面进行操作，如创建会议、查看会议列表等。
2. **API封装层**：页面组件调用`api`对象中的相关模块（如`api.meeting.getMeetingList`）。
3. **请求/响应处理层**：API封装层调用`api/index.js`中的基础请求方法（`get`、`post`等）。
4. **拦截与处理**：请求经过`requestInterceptor`处理，添加token等认证信息。
5. **模拟数据处理**：
   - 开发环境：`processMockRequest`函数检查是否使用模拟数据，若使用则返回模拟数据。
   - 生产环境：请求发送至真实后端API。
6. **网络请求**：通过`uni.request`发送网络请求。
7. **响应处理**：响应数据经过`responseInterceptor`处理，如处理认证失效等统一逻辑。

### 2. 响应流程

1. **接收响应**：接收后端或模拟数据的响应。
2. **数据格式化**：使用`api/models.js`中定义的模型创建函数来格式化响应数据。
3. **返回处理后的数据**：以Promise形式返回给调用方。
4. **视图更新**：前端组件接收数据后更新视图。

## 三、核心模块与职责

### 1. API模块化结构

```
api/
├── index.js           # 基础请求方法与拦截器
├── types.js           # 数据类型定义
├── models.js          # 数据模型创建函数
├── meeting.js         # 会议相关API
├── room.js            # 会议室相关API
├── room-mock.js       # 会议室模拟数据
├── user.js            # 用户相关API
└── ...                # 其他API模块
```

### 2. 模拟数据层

```
data/
├── index.js           # 模拟数据汇总与导出
├── meetings.js        # 会议模拟数据
├── rooms.js           # 会议室模拟数据
├── users.js           # 用户模拟数据
└── ...                # 其他模拟数据
```

### 3. 统一API调用入口

```
utils/
└── api.js             # 统一API调用入口
```

## 四、关键数据接口说明

### 1. 会议管理

#### 1.1 获取会议列表

```javascript
// 调用方式
api.meeting.getMeetingList(params)

// 请求参数
{
  page: 1,            // 页码
  limit: 10,          // 每页数量
  keyword: '',        // 关键词搜索
  status: '',         // 会议状态筛选
  startDate: '',      // 开始日期
  endDate: ''         // 结束日期
}

// 响应数据
{
  code: 200,          // 状态码
  message: '获取成功',  // 提示信息
  data: {
    total: 100,       // 总数
    list: [           // 会议列表
      {
        id: '1',
        title: '项目启动会议',
        // ... 其他会议字段
      }
    ],
    page: 1,          // 当前页码
    limit: 10         // 每页数量
  }
}
```

#### 1.2 获取会议详情

```javascript
// 调用方式
api.meeting.getDetail(meetingId)

// 响应数据
{
  code: 200,
  message: '获取成功',
  data: {
    id: '1',
    title: '项目启动会议',
    description: '',
    roomId: 'room001',
    roomName: '大会议室A',
    startTime: '2023-05-10 14:00',
    endTime: '2023-05-10 14:30',
    organizer: {
      id: '1001',
      name: '张三'
    },
    type: 'project',
    status: 5,                // 会议状态
    approvalStatus: 1,        // 审批状态
    priority: 2,              // 优先级
    department: '技术部',      // 所属部门
    participants: [...],      // 参会人员
    attachments: [...],       // 附件
    agenda: [...],            // 议程
    createTime: '2023-05-08 10:00'
  }
}
```

#### 1.3 创建会议

```javascript
// 调用方式
api.meeting.create(meetingData)

// 请求参数
{
  title: '项目周会',
  description: '讨论本周项目进度',
  roomId: 'room001',
  startTime: '2023-06-01 10:00',
  endTime: '2023-06-01 11:00',
  type: 'regular',
  status: 0,                 // 待审批
  priority: 1,               // 重要
  department: '技术部',       // 所属部门
  participants: [...],       // 参会人员
  equipment: [...],          // 设备需求
  agenda: [...]              // 议程
}

// 响应数据
{
  code: 200,
  message: '创建成功',
  data: {
    id: '10',
    // ... 同会议详情
  }
}
```

### 2. 会议室管理

#### 2.1 获取会议室列表

```javascript
// 调用方式
api.room.getRoomList(params)

// 请求参数
{
  capacity: 10,        // 最低容量
  facilities: ['投影仪', '白板'],  // 设备需求
  status: 'available'  // 会议室状态
}

// 响应数据
{
  code: 200,
  message: '获取会议室列表成功',
  data: [
    {
      id: 'room001',
      name: '大会议室A',
      capacity: 30,
      location: '总部大楼1楼',
      facilities: ['投影仪', '视频会议设备', '白板', '话筒'],
      status: 'available',
      photo: '/static/images/meeting-room1.jpg'
    },
    // ... 其他会议室
  ]
}
```

#### 2.2 获取可用会议室

```javascript
// 调用方式
api.room.getAvailableList(params)

// 请求参数
{
  date: '2023-06-01',      // 日期
  startTime: '10:00',      // 开始时间
  endTime: '11:00',        // 结束时间
  capacity: 15,            // 最低容量
  facilities: ['投影仪']    // 设备需求
}

// 响应数据
{
  code: 200,
  message: '获取可用会议室列表成功',
  data: [
    // ... 符合条件的会议室列表
  ]
}
```

### 3. 用户管理

#### 3.1 用户登录

```javascript
// 调用方式
api.user.login(loginData)

// 请求参数
{
  username: 'admin',
  password: '123456'
}

// 响应数据
{
  code: 200,
  message: '登录成功',
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    userInfo: {
      id: '1001',
      name: '张三',
      role: 'admin',
      avatar: '/static/avatar1.png'
    }
  }
}
```

## 五、模拟数据与真实后端切换

系统设计支持在开发环境中使用模拟数据，在生产环境中连接真实后端API：

```javascript
// api/index.js
const USE_MOCK = process.env.NODE_ENV === 'development';

// 处理请求
const request = (options) => {
  // 处理模拟数据
  const mockResponse = processMockRequest(options.url, options.method, options.data);
  if (mockResponse) {
    return Promise.resolve(mockResponse);
  }
  
  // 发送真实请求
  // ...
}
```

## 六、数据模型格式化

系统使用统一的数据模型创建函数来格式化请求和响应数据，确保数据结构一致性：

```javascript
// 创建会议信息实例
export const createMeetingInfo = (data = {}) => {
  return {
    id: data.id || '',
    title: data.title || '',
    // ... 其他字段格式化
  };
};

// 使用方式
const formattedData = Models.createMeetingInfo(responseData);
```

## 七、数据流程图

```
┌─────────────┐      ┌──────────┐      ┌───────────────┐      ┌──────────────┐
│ 页面组件     │──────▶ API封装层 │──────▶ 请求/响应处理层 │──────▶ 模拟数据/后端 │
└─────────────┘      └──────────┘      └───────────────┘      └──────────────┘
       ▲                   │                   │                       │
       │                   │                   │                       │
       └───────────────────┴───────────────────┴───────────────────────┘
                              数据返回流向
```

## 八、总结

RPA会议系统采用了清晰的数据流架构，将前端UI、API调用、数据处理和后端交互分离，使系统具有良好的可维护性和扩展性。模拟数据机制使开发阶段能够脱离真实后端进行高效开发，同时保持了与生产环境的兼容性。 