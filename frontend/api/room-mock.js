// 模拟会议室API

// 获取会议室列表
const getRoomList = (params = {}) => {
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredRooms = [...roomMock.list];
      
      // 根据参数过滤会议室
      if (params.capacity) {
        filteredRooms = filteredRooms.filter(room => room.capacity >= params.capacity);
      }
      
      if (params.facilities && params.facilities.length) {
        filteredRooms = filteredRooms.filter(room => {
          return params.facilities.every(facility => room.facilities.includes(facility));
        });
      }
      
      if (params.status) {
        filteredRooms = filteredRooms.filter(room => room.status === params.status);
      }
      
      resolve({
        code: 200,
        message: '获取会议室列表成功',
        data: filteredRooms
      });
    }, 300);
  });
};

// 获取会议室详情
const getRoomDetail = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const room = roomMock.list.find(room => room.id === id);
      
      if (room) {
        // 获取该会议室的预订信息
        const bookings = roomMock.bookings.filter(booking => booking.roomId === id);
        
        resolve({
          code: 200,
          message: '获取会议室详情成功',
          data: {
            ...room,
            bookings
          }
        });
      } else {
        resolve({
          code: 404,
          message: '会议室不存在',
          data: null
        });
      }
    }, 300);
  });
};

// 检查会议室是否可用
const checkRoomAvailable = (roomId, date, startTime, endTime) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 查找会议室
      const room = roomMock.list.find(room => room.id === roomId);
      
      if (!room) {
        resolve({
          code: 404,
          message: '会议室不存在',
          data: { available: false }
        });
        return;
      }
      
      // 检查会议室状态
      if (room.status !== 'available') {
        resolve({
          code: 200,
          message: '会议室不可用',
          data: { available: false, reason: '会议室已停用' }
        });
        return;
      }
      
      // 查找该会议室的所有预订
      const conflictBookings = roomMock.bookings.filter(booking => {
        return booking.roomId === roomId && hasTimeConflict(booking, date, startTime, endTime);
      });
      
      const available = conflictBookings.length === 0;
      
      resolve({
        code: 200,
        message: available ? '会议室可用' : '会议室已被预订',
        data: { 
          available,
          conflictBookings: available ? [] : conflictBookings
        }
      });
    }, 300);
  });
};

// 获取可用会议室列表
const getAvailableList = (params = {}) => {
  const { date, startTime, endTime, capacity, facilities } = params;
  
  // 验证参数
  if (!date || !startTime || !endTime) {
    return Promise.resolve({
      code: 400,
      message: '缺少必要参数',
      data: null
    });
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // 筛选出状态为可用的会议室
      let availableRooms = roomMock.list.filter(room => room.status === 'available');
      
      // 根据容量过滤
      if (capacity) {
        availableRooms = availableRooms.filter(room => room.capacity >= capacity);
      }
      
      // 根据设备需求过滤
      if (facilities && facilities.length) {
        availableRooms = availableRooms.filter(room => {
          return facilities.every(facility => room.facilities.includes(facility));
        });
      }
      
      // 过滤出在指定时间段可用的会议室
      const availableRoomIds = availableRooms.map(room => room.id);
      const conflictRoomIds = new Set();
      
      // 查找有冲突的会议室
      roomMock.bookings.forEach(booking => {
        if (
          availableRoomIds.includes(booking.roomId) && 
          hasTimeConflict(booking, date, startTime, endTime)
        ) {
          conflictRoomIds.add(booking.roomId);
        }
      });
      
      // 过滤掉有冲突的会议室
      const finalAvailableRooms = availableRooms.filter(room => !conflictRoomIds.has(room.id));
      
      resolve({
        code: 200,
        message: '获取可用会议室列表成功',
        data: finalAvailableRooms
      });
    }, 300);
  });
};

// 会议室模拟数据
const roomMock = {
  // 会议室列表
  list: [
    {
      id: 'room001',
      name: '大会议室A',
      capacity: 30,
      location: '总部大楼1楼',
      facilities: ['投影仪', '视频会议设备', '白板', '话筒'],
      status: 'available',
      photo: '/static/images/meeting-room1.jpg'
    },
    {
      id: 'room002',
      name: '中型会议室B',
      capacity: 20,
      location: '总部大楼2楼',
      facilities: ['投影仪', '白板', '电视'],
      status: 'available',
      photo: '/static/images/meeting-room2.jpg'
    },
    {
      id: 'room003',
      name: '小会议室C',
      capacity: 10,
      location: '总部大楼3楼',
      facilities: ['投影仪', '白板'],
      status: 'available',
      photo: '/static/images/meeting-room3.jpg'
    },
    {
      id: 'room004',
      name: '视频会议室',
      capacity: 16,
      location: '总部大楼4楼',
      facilities: ['投影仪', '视频会议设备', '话筒', '电视'],
      status: 'available',
      photo: '/static/images/meeting-room4.jpg'
    },
    {
      id: 'room005',
      name: '董事会议室',
      capacity: 24,
      location: '总部大楼5楼',
      facilities: ['投影仪', '视频会议设备', '白板', '话筒', '电视'],
      status: 'available',
      photo: '/static/images/meeting-room5.jpg'
    },
    {
      id: 'room006',
      name: '培训室',
      capacity: 40,
      location: '总部大楼6楼',
      facilities: ['投影仪', '白板', '话筒'],
      status: 'available',
      photo: '/static/images/meeting-room6.jpg'
    }
  ],
  
  // 会议室预订信息
  bookings: [
    {
      id: 'booking001',
      roomId: 'room001',
      date: '2023-06-20',
      startTime: '09:00',
      endTime: '11:00',
      title: '年度战略规划会议',
      organizer: {
        id: 'user001',
        name: '张三'
      }
    },
    {
      id: 'booking002',
      roomId: 'room002',
      date: '2023-06-20',
      startTime: '14:00',
      endTime: '16:00',
      title: '产品设计评审',
      organizer: {
        id: 'user002',
        name: '李四'
      }
    },
    {
      id: 'booking003',
      roomId: 'room003',
      date: '2023-06-21',
      startTime: '10:00',
      endTime: '12:00',
      title: '团队周会',
      organizer: {
        id: 'user003',
        name: '王五'
      }
    },
    {
      id: 'booking004',
      roomId: 'room004',
      date: '2023-06-21',
      startTime: '13:00',
      endTime: '15:00',
      title: '客户视频会议',
      organizer: {
        id: 'user004',
        name: '赵六'
      }
    },
    {
      id: 'booking005',
      roomId: 'room005',
      date: '2023-06-22',
      startTime: '09:30',
      endTime: '11:30',
      title: '董事会议',
      organizer: {
        id: 'user005',
        name: '钱七'
      }
    }
  ]
};

// 辅助函数：检查时间是否有冲突
const hasTimeConflict = (booking, date, startTime, endTime) => {
  // 如果日期不同，则没有冲突
  if (booking.date !== date) return false;
  
  // 转换时间为分钟，方便比较
  const bookingStart = timeToMinutes(booking.startTime);
  const bookingEnd = timeToMinutes(booking.endTime);
  const requestStart = timeToMinutes(startTime);
  const requestEnd = timeToMinutes(endTime);
  
  // 检查时间段是否重叠
  return (
    (requestStart >= bookingStart && requestStart < bookingEnd) || // 开始时间在已预订时间段内
    (requestEnd > bookingStart && requestEnd <= bookingEnd) || // 结束时间在已预订时间段内
    (requestStart <= bookingStart && requestEnd >= bookingEnd) // 包含已预订时间段
  );
};

// 辅助函数：将时间字符串转换为分钟
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export {
  roomMock,
  getRoomList,
  getRoomDetail,
  checkRoomAvailable,
  getAvailableList
}; 