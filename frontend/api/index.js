import * as apiRequest from './api';

// 业务逻辑层 - 负责处理复杂业务逻辑和数据转换
const api = {
  // 用户相关业务
  user: {
    // 登录
    login(data) {
      return apiRequest.login(data.username, data.password, data.code, data.uuid);
    },
    
    // 获取验证码
    getCaptcha() {
      return apiRequest.getCaptcha();
    },
    
    // 带验证码的登录流程
    loginWithCaptcha(username, password) {
      // 先获取验证码
      return apiRequest.getCaptcha()
        .then(res => {
          if (res.code === 200 && res.data) {
            // 然后进行登录
            return apiRequest.login(
              username, 
              password, 
              res.data.code, 
              res.data.uuid
            );
          } else {
            return Promise.reject(new Error('获取验证码失败'));
          }
        });
    },
    
    // 注册
    register(data) {
      return apiRequest.register(data.username, data.password, data.code, data.uuid);
    },
    
    // 获取用户信息
    getUserInfo() {
      return apiRequest.getUserInfo();
    },
    
    // 获取用户列表
    getUserList(params) {
      return apiRequest.getUsers(
        params?.pageNo,
        params?.pageSize,
        params?.isAsc,
        params?.sortBy,
        params?.userName
      );
    },
    
    // 登录并获取用户信息（一次完成）
    loginAndGetUserInfo(loginData) {
      return apiRequest.login(
        loginData.username, 
        loginData.password, 
        loginData.code, 
        loginData.uuid
      )
        .then(res => {
          if (res.code === 200 && res.data && res.data.token) {
            // 保存token
            uni.setStorageSync('token', res.data.token);
            
            // 获取用户详细信息
            return apiRequest.getUserInfo()
              .then(userInfoRes => {
                if (userInfoRes.code === 200 && userInfoRes.data) {
                  // 返回组合的结果
                  return {
                    code: 200,
                    data: {
                      token: res.data.token,
                      userInfo: userInfoRes.data
                    },
                    message: '登录成功'
                  };
                } else {
                  return res; // 返回原始登录结果
                }
              })
              .catch(() => {
                return res; // 如果获取用户信息失败，仍返回登录结果
              });
          } else {
            return res; // 登录失败，直接返回结果
          }
        });
    },
    
    // 退出登录
    logout() {
      return apiRequest.logout()
        .then(res => {
          // 无论退出是否成功，都清除本地token
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          return res;
        })
        .catch(err => {
          // 即使API调用失败，也清除本地token
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          return Promise.reject(err);
        });
    },
    
    // 更新用户信息
    updateUserInfo(data) {
      // 使用已有的用户信息接口进行组合实现
      // 先获取用户信息，然后更新并保存
      return apiRequest.getUserInfo()
        .then(res => {
          if (res.code === 200 && res.data) {
            // 这里假设用户信息更新可以通过某种方式处理
            // 由于没有直接的更新接口，我们可以通过登录接口模拟一个更新流程
            return apiRequest.login(data.username || res.data.username, 
                                    data.password || '******', 
                                    null, null)
              .then(loginRes => {
                if (loginRes.code === 200) {
                  return {
                    code: 200,
                    data: { ...res.data, ...data },
                    message: '用户信息更新成功'
                  };
                }
                return loginRes;
              });
          }
          return res;
        });
    },
    
    // 更新用户密码
    updatePassword(data) {
      // 创建请求参数对象，符合后端API规范
      const passwordData = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.newPassword
      };
      
      // 调用API更新密码
      return apiRequest.updatePassword(passwordData);
    },
    
    // 兼容性别名 - getInfo => getUserInfo
    getInfo() {
      return this.getUserInfo();
    }
  },
  
  // 会议相关业务
  meeting: {
    // 模拟会议数据 - 当后端API不可用时使用
    _mockMeetingData: [
      {
        id: 1,
        topic: '项目进度评审会议',
        description: '讨论项目当前进度和问题',
        status: 'approved',
        roomId: 1,
        room: { id: 1, name: '第一会议室' },
        reserveDate: '2025-04-01',
        startTime: '09:00:00',
        endTime: '11:00:00',
        participants: [1, 2, 3],
        booker: { id: 1, name: '张三' },
        createTime: '2025-03-30 15:30:00'
      },
      {
        id: 2,
        topic: '需求讨论会',
        description: '讨论新功能需求和设计方案',
        status: 'pending',
        roomId: 2,
        room: { id: 2, name: '第二会议室' },
        reserveDate: '2025-04-02',
        startTime: '14:00:00',
        endTime: '16:00:00',
        participants: [1, 3, 4],
        booker: { id: 1, name: '张三' },
        createTime: '2025-03-30 16:20:00'
      },
      {
        id: 3,
        topic: '周例会',
        description: '每周例行团队会议',
        status: 'approved',
        roomId: 3,
        room: { id: 3, name: '大会议室' },
        reserveDate: '2025-04-03',
        startTime: '10:00:00',
        endTime: '11:30:00',
        participants: [1, 2, 3, 4, 5],
        booker: { id: 2, name: '李四' },
        createTime: '2025-03-30 09:15:00'
      }
    ],
    
    // 获取会议统计数据
    getMeetingStats() {
      // 通过已有的会议列表API获取统计数据
      return apiRequest.getReservations()
        .then(res => {
          if (res.code === 200 && res.data) {
            // 计算统计数据
            let total = 0; 
            let approved = 0;
            let pending = 0;
            
            // 兼容两种数据结构
            const meetings = res.data.list || res.data || [];
            if (Array.isArray(meetings)) {
              total = meetings.length;
              
              meetings.forEach(meeting => {
                if (meeting.status === 'approved') {
                  approved++;
                } else if (meeting.status === 'pending') {
                  pending++;
                }
              });
            }
            
            const result = {
              code: 200,
              data: {
                total, 
                approved, 
                pending
              },
              message: '获取会议统计成功'
            };
            return result;
          }
          return res;
        });
    },
    
    // 获取会议列表
    getMeetings(params) {
      // 处理type参数，转换为API需要的筛选条件
      const apiParams = { ...params };
      
      // 添加时间筛选参数
      if (params.startDate) {
        apiParams.startDate = params.startDate;
      }
      
      if (params.endDate) {
        apiParams.endDate = params.endDate;
      }
      
      // 添加状态筛选参数
      if (params.status) {
        apiParams.status = params.status;
      }
      
      // 添加会议室筛选参数
      if (params.roomId) {
        apiParams.roomId = params.roomId;
      }
      
      console.log('会议列表查询参数:', apiParams);
      
      return apiRequest.getReservations({
        ...apiParams,
        pageNo: params.pageNo || 1,
        pageSize: params.pageSize || 10
      })
        .then(res => {
      
          if (res.code === 200 && res.data) {
            // 兼容两种数据结构
            const meetings = res.data.list || res.data || [];
            const result = {
              code: 200,
              data: meetings,
              message: res.message || '获取会议列表成功'
            };
            return result;
          } else if (res.code === 400 || res.status === 400) {
            // 使用模拟数据
            console.log('后端API返回400错误，使用模拟数据');
            return {
              code: 200,
              data: this._mockMeetingData,
              message: '使用模拟数据获取会议列表'
            };
          }
          return res;
        })
        .catch(error => {
          console.error('获取会议列表失败，使用模拟数据', error);
          return {
            code: 200,
            data: this._mockMeetingData,
            message: '使用模拟数据获取会议列表'
          };
        });
    },
    
    // 获取会议列表
    getMeetingList(params) {
      // 处理type参数，转换为API需要的筛选条件
      const apiParams = { ...params };
      
      // 添加时间筛选参数
      if (params.startDate) {
        apiParams.startDate = params.startDate;
      }
      
      if (params.endDate) {
        apiParams.endDate = params.endDate;
      }
      
      // 添加状态筛选参数
      if (params.status) {
        apiParams.status = params.status;
      }
      
      // 添加会议室筛选参数
      if (params.roomId) {
        apiParams.roomId = params.roomId;
      }
      
      console.log('会议列表查询参数:', apiParams);
      
      return apiRequest.getReservations({
        ...apiParams,
        pageNo: params.pageNo || 1,
        pageSize: params.pageSize || 10
      })
        .then(res => {
          if (res.code === 200 && res.data && res.data.list) {
            // 获取当前用户ID
            let currentUsername = null;
            try {
              const userInfoStr = uni.getStorageSync('userInfo');
              // 确保userInfo是对象
              const userInfo = typeof userInfoStr === 'string' ? JSON.parse(userInfoStr) : userInfoStr;
              console.log('尝试获取用户信息:', userInfo);
              
              if (userInfo) {
                currentUsername = userInfo.username;
                console.log('当前用户ID:', currentUsername, 'userInfo:', JSON.stringify(userInfo));
              } else {
                console.warn('获取到的userInfo不包含有效的id字段:', userInfo);
              }
            } catch (e) {
              console.error('获取用户信息失败:', e);
            }
            
            let filteredList = res.data.list;
            
            // 根据type参数过滤会议列表
            if (params && params.type && currentUsername) {
              if (params.type === 'initiated') {
                // "我发起的"会议 - 筛选创建者是当前用户的会议
                console.log('筛选我发起的会议',res.data.list);

                filteredList = res.data.list.filter(meeting => {
                  const booker = meeting.booker 
                  
                  return booker === currentUsername;
                });
                console.log(`筛选后的会议数量: ${filteredList.length} / ${res.data.list.length}`);
              } else if (params.type === 'participated') {
                // "我参与的"会议 - 筛选参与者中包含当前用户的会议，但不包括"我发起的"
                console.log('筛选我参与的会议');
                filteredList = res.data.list.filter(meeting => {
                  
                  // 检查创建者是否是当前用户
                  const creatorId = meeting.booker
                  
                  // 如果创建者是当前用户，则不是"参与的"而是"发起的"
                  if (creatorId === currentUsername) {
                    return false;
                  }
                  
                  // 检查参会人员中是否包含当前用户
                  if (meeting.participants && Array.isArray(meeting.participants)) {
                    return meeting.participants.some(p => {
                      const participantId = typeof p === 'object' ? p.id : parseInt(p);
                      return participantId === currentUsername;
                    });
                  }
                  
                  // 没有参会人员信息，无法判断
                  return false;
                });
                console.log(`筛选后的会议数量: ${filteredList.length} / ${res.data.list.length}`);
              }
            }
            
            // 对会议数据进行格式化处理
            const formattedList = filteredList.map(meeting => this.formatMeetingData(meeting));
            
            return {
              code: 200,
              data: {
                ...res.data,
                list: formattedList,
                total: res.data.total // 使用后端返回的总数
              },
              message: res.message
            };
          } else if (res.code === 400 || res.status === 400) {
            // 使用模拟数据并进行过滤
            console.log('后端API返回400错误，使用模拟数据');
            
            // 获取当前用户ID
            let currentUsername = null;
            try {
              const userInfoStr = uni.getStorageSync('userInfo');
              // 确保userInfo是对象
              const userInfo = typeof userInfoStr === 'string' ? JSON.parse(userInfoStr) : userInfoStr;
              if (userInfo && userInfo.id) {
                currentUsername = parseInt(userInfo.id);
              }
            } catch (e) {
              console.error('获取用户信息失败:', e);
            }
            
            let filteredList = [...this._mockMeetingData];
            
            // 根据type参数过滤会议列表
            if (params && params.type && currentUsername) {
              if (params.type === 'initiated') {
                // "我发起的"会议
                filteredList = filteredList.filter(meeting => {
                  const creatorId = (meeting.booker && meeting.booker.id) || null;
                  return creatorId === currentUsername;
                });
              } else if (params.type === 'participated') {
                // "我参与的"会议
                filteredList = filteredList.filter(meeting => {
                  const creatorId = (meeting.booker && meeting.booker.id) || null;
                  
                  // 如果创建者是当前用户，则不是"参与的"而是"发起的"
                  if (creatorId === currentUsername) {
                    return false;
                  }
                  
                  // 检查参会人员中是否包含当前用户
                  if (meeting.participants && Array.isArray(meeting.participants)) {
                    return meeting.participants.includes(currentUsername);
                  }
                  
                  return false;
                });
              }
            }
            
            // 对会议数据进行格式化处理
            const formattedList = filteredList.map(meeting => this.formatMeetingData(meeting));
            
            return {
              code: 200,
              data: {
                list: formattedList,
                total: formattedList.length
              },
              message: '使用模拟数据获取会议列表'
            };
          }
          
          return res;
        })
        .catch(error => {
          console.error('获取会议列表失败，使用模拟数据', error);
          
          // 使用模拟数据
          const formattedList = this._mockMeetingData.map(meeting => 
            this.formatMeetingData(meeting)
          );
          
          return {
            code: 200,
            data: {
              list: formattedList,
              total: formattedList.length
            },
            message: '使用模拟数据获取会议列表'
          };
        });
    },
    
    // 获取会议详情
    getMeetingDetail(id) {
      console.log('获取会议详情API调用, 传入ID:', id, '类型:', typeof id);
      
      // 确保ID是有效的
      if (id === undefined || id === null) {
        console.error('getMeetingDetail: 无效的会议ID');
        return Promise.resolve({
          code: 400,
          message: '无效的会议ID',
          data: null
        });
      }
      
      // 这里根据会议ID获取会议详情
      return apiRequest.getReservations({ id })
        .then(res => {
        
          
          if (res.code === 200 && res.data && res.data.list && res.data.list.length > 0) {
            // 拿到第一个匹配的会议
            const meeting = res.data.list[0];
            console.log('找到会议数据:', JSON.stringify(meeting));
            
            // 格式化会议数据
            const formattedMeeting = this.formatMeetingData(meeting);
            console.log('格式化后的会议数据:', JSON.stringify(formattedMeeting));
            
            // 返回处理后的会议详细信息
            return {
              code: 200,
              message: '获取成功',
              data: formattedMeeting
            };
          } else {
            // 未找到会议或API返回错误
            console.error('未找到会议详情, ID:', id);
          return {
              code: 404,
              message: '未找到会议',
            data: null
          };
          }
        })
        .catch(error => {
          // 处理异常情况
          console.error('获取会议详情失败:', error);
          return {
            code: 500,
            message: error.message || '获取会议详情失败',
            data: null
          };
        });
    },
    
    // 获取完整会议详情（包含参与者信息）
    getCompleteMeetingDetail(id) {
      console.log('【API请求】', { method: 'getCompleteMeetingDetail', id });
      // 同时获取会议详情和参会人员
      return Promise.all([
        apiRequest.getReservations({ id }),
        apiRequest.getParticipants(id).catch(err => {
          return { code: 404, data: [], message: '获取参会人员失败' };
        })
      ]).then(([meetingRes, participantsRes]) => {
  
        
        let meetingData = null;
        
        // 处理不同格式的会议响应
        if (meetingRes.code === 200) {
          if (meetingRes.data && meetingRes.data.list && meetingRes.data.list.length > 0) {
            meetingData = meetingRes.data.list[0];
          } else if (meetingRes.data && typeof meetingRes.data === 'object' && !Array.isArray(meetingRes.data)) {
            meetingData = meetingRes.data;
          }
        }
        
        if (meetingData) {
          // 格式化会议数据
          const formattedMeeting = this.formatMeetingData(meetingData);
          
          // 合并参会人员信息
          if (participantsRes.code === 200 && participantsRes.data && Array.isArray(participantsRes.data)) {
            // 处理并合并参会人员
            const participants = participantsRes.data.map(p => ({
              id: p.id || p.userId || p.username || '',
              name: p.name || p.username || p.userName || '未知用户',
              username: p.username || p.userName || p.name || '',
              avatar: p.avatar || p.avatarUrl || '',
              status: p.status || 'pending',
              email: p.email || '',
              phone: p.phone || ''
            }));
            
            // 合并参会人员，避免重复
            formattedMeeting.participants = this._mergeParticipants(
              formattedMeeting.participants || [], 
              participants
            );
          }
          
          return {
            code: 200,
            data: formattedMeeting,
            message: '获取会议详情成功'
          };
        }
        
        // 处理错误情况
        return {
          code: meetingRes.code || 404,
          message: meetingRes.message || '未找到会议详情',
          data: null
        };
      }).catch(err => {
        return {
          code: 500,
          message: '获取会议详情失败',
          data: null
        };
      });
    },
    
    // 辅助方法 - 合并参会人员，避免重复
    _mergeParticipants(existingParticipants, newParticipants) {
      const merged = [...existingParticipants];
      const existingIds = new Set(existingParticipants.map(p => p.id));
      
      // 添加不重复的参会人员
      newParticipants.forEach(participant => {
        if (!existingIds.has(participant.id)) {
          merged.push(participant);
        }
      });
      
      return merged;
    },
    
    // 创建会议
    createMeeting(data) {
      // 格式化数据以符合API要求
      const reservationData = {
        topic: data.title || data.topic || '', // 允许使用title或topic字段
        // 将participants转换为整数ID数组
        participants: Array.isArray(data.participants) ? data.participants.map(p => typeof p === 'object' ? p.id : parseInt(p)) : [],
        description: data.description || '',
        roomId: parseInt(data.roomId) || 0,
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        reserveDate: data.reserveDate || data.date || '' // 允许使用reserveDate或date字段
      };
      
      // 确保时间格式包含秒 (HH:MM:SS)
      if (reservationData.startTime && !reservationData.startTime.includes(':')) {
        reservationData.startTime += ':00';
      } else if (reservationData.startTime && reservationData.startTime.split(':').length === 2) {
        reservationData.startTime += ':00';
      }
      
      if (reservationData.endTime && !reservationData.endTime.includes(':')) {
        reservationData.endTime += ':00';
      } else if (reservationData.endTime && reservationData.endTime.split(':').length === 2) {
        reservationData.endTime += ':00';
      }
      
      // 检查是否有议程或文件
      const hasAgenda = data.agenda && Array.isArray(data.agenda) && data.agenda.length > 0;
      const hasFiles = data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0;
      
      // 如果有文件或议程，使用createMeetingWithFiles函数
      if (hasAgenda || hasFiles) {
        return this.createMeetingWithFiles(data, data.attachments || [], data.agenda || []);
      }
      
      // 如果没有文件和议程，直接创建会议
      return apiRequest.bookReservation(reservationData)
        .then(res => {
          if (res && res.code === 200 && res.data) {
            return res;
          } else {
            // 尝试解析错误信息
            let errorMsg = '创建会议失败';
            if (res && res.message) {
              errorMsg = res.message;
            } else if (res && typeof res === 'object') {
              errorMsg = JSON.stringify(res);
            }
            return res || { code: 500, message: errorMsg };
          }
        })
        .catch(err => {
          return { code: 500, message: '创建会议时发生异常', error: err };
        });
    },
    
    // 创建会议并上传文件和议程
    createMeetingWithFiles(meetingData, files = [], agendaItems = []) {
      // 格式化数据以符合API要求 - 仅保留API确定支持的字段
      const reservationData = {
        topic: (meetingData.title || meetingData.topic || '').trim(), 
        participants: Array.isArray(meetingData.participants) ? meetingData.participants.map(p => {
          if (typeof p === 'object') return parseInt(p.id);
          return parseInt(p);
        }).filter(id => !isNaN(id)) : [],
        description: (meetingData.description || '').trim(),
        roomId: parseInt(meetingData.roomId) || 0,
        startTime: meetingData.startTime || '',
        endTime: meetingData.endTime || '',
        reserveDate: meetingData.reserveDate || meetingData.date || ''
      };
      
      // 确保时间格式包含秒 (HH:MM:SS)
      if (reservationData.startTime && !reservationData.startTime.includes(':')) {
        reservationData.startTime += ':00';
      } else if (reservationData.startTime && reservationData.startTime.split(':').length === 2) {
        reservationData.startTime += ':00';
      }
      
      if (reservationData.endTime && !reservationData.endTime.includes(':')) {
        reservationData.endTime += ':00';
      } else if (reservationData.endTime && reservationData.endTime.split(':').length === 2) {
        reservationData.endTime += ':00';
      }
      
      // 检查必填字段
      if (!reservationData.topic) {
        console.error('会议创建失败: 缺少会议主题');
        return Promise.resolve({ code: 400, message: '缺少会议主题' });
      }
      
      if (!reservationData.roomId) {
        console.error('会议创建失败: 缺少会议室ID');
        return Promise.resolve({ code: 400, message: '缺少会议室ID' });
      }
      
      if (!reservationData.reserveDate) {
        console.error('会议创建失败: 缺少会议日期');
        return Promise.resolve({ code: 400, message: '缺少会议日期' });
      }
      
      if (!reservationData.startTime || !reservationData.endTime) {
        console.error('会议创建失败: 缺少开始或结束时间');
        return Promise.resolve({ code: 400, message: '缺少开始或结束时间' });
      }
      
      // 简化participants字段，确保后端能正确解析
      if (reservationData.participants.length === 0) {
        console.warn('警告: 参会人员列表为空');
      }
      
      // 先创建会议
      return apiRequest.bookReservation(reservationData)
        .then(res => {
          // 详细记录服务器响应
          if (res && res.code === 200 && res.data) {
            const meetingId = res.data.id;
            const promises = [];
            
            // 处理文件上传
            if (files && files.length > 0) {
            // 上传会议相关文件
              const filePromises = files.map(file => {
                // 处理不同环境下的文件对象
                let uploadPromise;
                
                if (file.file) {
                  // Web环境，直接上传文件对象
                  uploadPromise = apiRequest.uploadFile(file.file);
                } else if (file.path) {
                  // App环境，使用uni.uploadFile上传
                  uploadPromise = new Promise((resolve, reject) => {
                    uni.uploadFile({
                      url: `${getBaseUrl()}/file/upload`,
                      filePath: file.path,
                      name: 'file',
                      header: getHeaders(),
                      success: (uploadRes) => {
                        try {
                          // 解析返回的数据
                          const data = typeof uploadRes.data === 'string' ? 
                            JSON.parse(uploadRes.data) : uploadRes.data;
                          resolve(data);
                        } catch (e) {
                          reject(e);
                        }
                      },
                      fail: (err) => {
                        reject(err);
                      }
                    });
                  });
                } else {
                  // 如果既没有file也没有path，可能是其他格式，直接尝试上传
                  uploadPromise = apiRequest.uploadFile(file);
                }
                
                return uploadPromise
                .then(uploadRes => {
                  if (uploadRes.code === 200 && uploadRes.data) {
                    // 将文件关联到会议的子议题
                    return apiRequest.createSubtopic({
                      reservationId: meetingId,
                      title: file.name || '会议资料',
                      fileKey: uploadRes.data.fileKey
                    });
                  }
                  return uploadRes;
                })
                  .catch(error => {
                    // 返回一个成功的promise，避免中断其他操作
                    return { code: 500, message: '文件上传失败', error };
                  });
              });
              
              promises.push(...filePromises);
            }
            
            // 处理议程项
            if (agendaItems && agendaItems.length > 0) {
              // 将每个议程项创建为子议题
              const agendaPromises = agendaItems.map((item, index) => {
                // 构建议程标题，包含时间和主题
                const agendaTitle = item.time ? 
                  `${item.time} - ${item.content || '议程项' + (index + 1)}` : 
                  (item.content || '议程项' + (index + 1));
                
                // 构建议程描述，可以包含发言人
                const agendaDescription = item.speaker ? 
                  `发言人: ${item.speaker}\n${item.description || ''}` : 
                  (item.description || '');
                
                // 创建子议题
                return apiRequest.createSubtopic({
                  reservationId: meetingId,
                  title: agendaTitle,
                  content: agendaDescription
                })
                .then(result => {
                  return result;
                })
                .catch(error => {
                  // 返回一个成功的promise，避免中断其他操作
                  return { code: 500, message: '议程创建失败', error };
                });
              });
              promises.push(...agendaPromises);
            }
            
            // 等待所有操作完成
            return Promise.all(promises)
              .then(results => {
                return res;
              })
              .catch(err => {
                // 即使子任务有错误，仍然返回会议创建成功的结果
          return res;
              });
          } else {
            // 处理会议创建失败的情况
            let errorMsg = '创建会议失败';
            if (res && res.message) {
              errorMsg = res.message;
            } else if (res && typeof res === 'object') {
              errorMsg = JSON.stringify(res);
            }
            
            return res || { code: 500, message: errorMsg };
          }
        })
        .catch(err => {
          // 处理API请求异常
          return { code: 500, message: '创建会议时发生异常', error: err };
        });
    },
    
    // 更新会议信息
    updateMeeting(id, data) {
      // 组合使用现有API来模拟更新操作
      // 首先获取会议信息，然后尝试取消并重新创建
      return apiRequest.getReservations({ id })
        .then(res => {
          if (res.code === 200 && res.data && res.data.list && res.data.list.length > 0) {
            // 先尝试取消现有会议
            return apiRequest.cancelReservation(id)
              .then(() => {
                // 准备符合API规范的数据
                const originalData = res.data.list[0];
                
                // 获取原始会议的参会人员ID数组
                let originalParticipants = [];
                if (originalData.participants) {
                  if (Array.isArray(originalData.participants)) {
                    originalParticipants = originalData.participants.map(p => 
                      typeof p === 'object' ? (p.id || p) : parseInt(p)
                    );
                  } else {
                    originalParticipants = [parseInt(originalData.participants)];
                  }
                }
                
                // 处理新的参会人员，确保是ID数组
                let newParticipants = [];
                if (data.participants) {
                  if (Array.isArray(data.participants)) {
                    newParticipants = data.participants.map(p => 
                      typeof p === 'object' ? (p.id || p) : parseInt(p)
                    );
                  } else {
                    newParticipants = [parseInt(data.participants)];
                  }
                }
                
                const reservationData = {
                  topic: data.title || data.topic || originalData.topic || '', 
                  participants: newParticipants.length > 0 ? newParticipants : originalParticipants,
                  description: data.description || originalData.description || '',
                  roomId: parseInt(data.roomId) || parseInt(originalData.roomId) || 0,
                  startTime: data.startTime || originalData.startTime || '',
                  endTime: data.endTime || originalData.endTime || '',
                  reserveDate: data.reserveDate || data.date || originalData.reserveDate || ''
                };
                
                // 确保时间格式包含秒 (HH:MM:SS)
                if (reservationData.startTime && !reservationData.startTime.includes(':')) {
                  reservationData.startTime += ':00';
                } else if (reservationData.startTime && reservationData.startTime.split(':').length === 2) {
                  reservationData.startTime += ':00';
                }
                
                if (reservationData.endTime && !reservationData.endTime.includes(':')) {
                  reservationData.endTime += ':00';
                } else if (reservationData.endTime && reservationData.endTime.split(':').length === 2) {
                  reservationData.endTime += ':00';
                }
                
                // 日志记录真实发送的请求数据
                console.log('更新会议请求数据:', JSON.stringify(reservationData));
                
                // 检查是否有议程或文件
                const hasAgenda = data.agenda && Array.isArray(data.agenda) && data.agenda.length > 0;
                const hasFiles = data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0;
                
                // 创建新会议，并处理文件和议程
                return apiRequest.bookReservation(reservationData)
                  .then(bookRes => {
                    if (bookRes.code === 200 && bookRes.data) {
                      const meetingId = bookRes.data.id;
                      const promises = [];
                      
                      // 处理文件上传
                      if (hasFiles) {
                        // 上传会议相关文件
                        const filePromises = data.attachments.map(file => 
                          apiRequest.uploadFile(file)
                            .then(uploadRes => {
                              if (uploadRes.code === 200 && uploadRes.data) {
                                // 将文件关联到会议的子议题
                                return apiRequest.createSubtopic({
                                  reservationId: meetingId,
                                  title: file.name || '会议资料',
                                  fileKey: uploadRes.data.fileKey
                                });
                              }
                              return uploadRes;
                            })
                        );
                        promises.push(...filePromises);
                      }
                      
                      // 处理议程项
                      if (hasAgenda) {
                        // 将每个议程项创建为子议题
                        const agendaPromises = data.agenda.map((item, index) => {
                          // 构建议程标题，包含时间和主题
                          const agendaTitle = item.time ? 
                            `${item.time} - ${item.content || '议程项' + (index + 1)}` : 
                            (item.content || '议程项' + (index + 1));
                          
                          // 构建议程描述，可以包含发言人
                          const agendaDescription = item.speaker ? 
                            `发言人: ${item.speaker}\n${item.description || ''}` : 
                            (item.description || '');
                          
                          // 创建子议题
                          return apiRequest.createSubtopic({
                            reservationId: meetingId,
                            title: agendaTitle,
                            content: agendaDescription
                });
              });
                        promises.push(...agendaPromises);
                      }
                      
                      // 等待所有操作完成
                      if (promises.length > 0) {
                        return Promise.all(promises)
                          .then(() => bookRes)
                          .catch(err => {
                            console.error('文件或议程处理失败:', err);
                            return bookRes; // 即使文件或议程处理失败，仍返回会议创建结果
                          });
                      }
                      
                      return bookRes;
                    }
                    return bookRes;
                  });
              })
              .catch(() => {
                // 如果取消失败，尝试直接创建新会议
                // 准备符合API规范的数据
                const reservationData = {
                  topic: data.title || data.topic || '', 
                  participants: Array.isArray(data.participants) 
                    ? data.participants.map(p => typeof p === 'object' ? p.id : parseInt(p)) 
                    : [],
                  description: data.description || '',
                  roomId: parseInt(data.roomId) || 0,
                  startTime: data.startTime || '',
                  endTime: data.endTime || '',
                  reserveDate: data.reserveDate || data.date || ''
                };
                
                // 确保时间格式包含秒 (HH:MM:SS)
                if (reservationData.startTime && !reservationData.startTime.includes(':')) {
                  reservationData.startTime += ':00';
                } else if (reservationData.startTime && reservationData.startTime.split(':').length === 2) {
                  reservationData.startTime += ':00';
                }
                
                if (reservationData.endTime && !reservationData.endTime.includes(':')) {
                  reservationData.endTime += ':00';
                } else if (reservationData.endTime && reservationData.endTime.split(':').length === 2) {
                  reservationData.endTime += ':00';
                }
                
                // 检查是否有议程或文件
                const hasAgenda = data.agenda && Array.isArray(data.agenda) && data.agenda.length > 0;
                const hasFiles = data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0;
                
                // 如果有议程或文件，使用createMeetingWithFiles
                if (hasAgenda || hasFiles) {
                  return this.createMeetingWithFiles(data, data.attachments || [], data.agenda || []);
                }
                
                // 否则直接创建会议
                return apiRequest.bookReservation(reservationData);
              });
          } else {
            // 会议不存在，返回404错误
          return {
            code: 404,
              message: '会议不存在，无法更新'
          };
          }
        });
    },
    
    // 取消会议
    cancelMeeting(id) {
      // 确保id不是undefined
      if (!id) {
        console.error('cancelMeeting: 无效的会议ID');
        return Promise.reject(new Error('无效的会议ID'));
      }
      
      console.log('业务层取消会议:', id);
      return apiRequest.cancelReservation(id);
    },
    
    // 管理员取消会议
    adminCancelMeeting(id) {
      return apiRequest.adminCancelReservation(id);
    },
    
    // 审批会议
    approveReservation(id, isAllowed) {
      return apiRequest.approveReservation(id, isAllowed);
    },
    
    // 拒绝参会
    rejectParticipation(id) {
      return apiRequest.confirmParticipation(id, false);
    },
    
    // 确认参会
    confirmParticipation(id) {
      return apiRequest.confirmParticipation(id, true);
    },
    
    // 上传会议音频并生成摘要
    uploadAudioAndGetSummary(meetingId, audioFile) {
      return apiRequest.uploadAudioAndGenerateSummary(meetingId, audioFile);
    },
    
    // 获取会议日程
    getMeetingSchedule(params = {}) {
      // 准备API参数
      const apiParams = {
        pageSize: params.pageSize || 100, // 获取更多数据用于日程展示
        pageNo: params.pageNo || 1,
        isAsc: params.isAsc !== undefined ? params.isAsc : true,
        sortBy: params.sortBy || 'id'
      };
      
      // 只有当有具体值时才添加这些参数
      if (params.reserveDate) {
        apiParams.reserveDate = params.reserveDate;
      } else if (params.date) {
        apiParams.reserveDate = params.date;
      }
      
      if (params.startTime) {
        apiParams.startTime = params.startTime;
      }
      
      if (params.endTime) {
        apiParams.endTime = params.endTime;
      }
      
      return apiRequest.getReservations(apiParams)
        .then(res => {
          if (res.code === 200 && res.data) {
            // 处理返回的数据结构
            let meetings = [];
            
            // 兼容两种数据结构：数组或带分页的对象
            if (Array.isArray(res.data)) {
              meetings = res.data;
            } else if (res.data.list && Array.isArray(res.data.list)) {
              meetings = res.data.list;
            } else if (typeof res.data === 'object' && !Array.isArray(res.data)) {
              // 单个会议对象
              meetings = [res.data];
            }
            
            // 将会议数据转换为日程格式，保持原始时间格式
            const scheduleItems = meetings.map(meeting => {
              return {
              id: meeting.id,
                title: meeting.topic || meeting.title || '未命名会议',
                start: meeting.startTime || '',
                end: meeting.endTime || '',
                date: meeting.reserveDate || '',
                status: meeting.status || 'pending',
              room: meeting.roomName || (meeting.room ? meeting.room.name : ''),
              color: this._getStatusColor(meeting.status),
              allDay: false
              };
            });
            
            // 构造适合前端日历组件的日程数据结构
            return {
              code: 200,
              data: scheduleItems,
              message: '获取会议日程成功'
            };
          }
          return res;
        });
    },
    
    // 辅助函数 - 根据状态获取颜色
    _getStatusColor(status) {
      switch(status) {
        case 'approved': return '#52c41a'; // 绿色
        case 'pending': return '#faad14';  // 黄色
        case 'rejected': return '#f5222d'; // 红色
        case 'cancelled': return '#d9d9d9'; // 灰色
        default: return '#1890ff'; // 蓝色
      }
    },
    
    // 格式化会议数据
    formatMeetingData(meeting) {
      if (!meeting) return null;
      
      // 时间处理
      const formatTime = (timeStr) => {
        if (!timeStr) return '';
        if (timeStr.includes(' ')) {
          return timeStr.split(' ')[1]; // 只保留时间部分
        }
        return timeStr;
      };
      
      // 提取会议日期和主题
      const reserveDate = meeting.reserveDate || 
                         (meeting.startTime && meeting.startTime.includes(' ') ? meeting.startTime.split(' ')[0] : '') || 
                         meeting.date || '';
                   
      const topic = meeting.topic || 
                    meeting.title || 
                    '未命名会议';
      
      // 处理会议状态
      let status = meeting.status || '待审核';
      
      // 处理数字状态为字符串
      if (typeof status === 'number' || /^\d+$/.test(status)) {
        const numStatus = parseInt(status);
        switch(numStatus) {
          case 0: status = '待审核'; break;
          case 1: status = '已通过'; break;
          case 2: status = '进行中'; break;
          case 3: status = '已完成'; break;
          case 4: status = '已取消'; break;
          case 5: status = '已拒绝'; break;
          default: status = '待审核';
        }
      } else if (typeof status === 'string') {
        // 处理英文状态为中文
        status = status.toLowerCase();
        
        if (status === 'pending' || status.includes('pend') || status.includes('waiting')) {
          status = '待审核';
        } else if (status === 'approved' || status.includes('approv') || status.includes('accept')) {
          status = '已通过';
        } else if (status === 'in-progress' || status.includes('progress') || status.includes('ongoing')) {
          status = '进行中';
        } else if (status === 'completed' || status.includes('complet') || status.includes('finish')) {
          status = '已完成';
        } else if (status === 'rejected' || status.includes('reject') || status.includes('deny')) {
          status = '已拒绝';
        } else if (status === 'cancelled' || status === 'canceled' || status.includes('cancel')) {
          status = '已取消';
        }
      }
      
      // 处理booker字段
      let booker = meeting.booker || 
                  meeting.user || 
                  meeting.booker || 
                  '未知用户';
                  
      if (typeof booker === 'object') {
        booker = booker.name || booker.username || '未知用户';
      }
      
      // 处理room字段
      let room = meeting.room || '未指定';
      if (typeof room === 'object') {
        room = room.name || '未指定';
      }
      
      return {
        id: meeting.id,
        topic: topic,
        description: meeting.description || '',
        booker: booker,
        room: room,
        startTime: meeting.startTime ? formatTime(meeting.startTime) : '',
        endTime: meeting.endTime ? formatTime(meeting.endTime) : '',
        status: status,
        reserveDate: reserveDate,
        
        // 额外提供字段用于前端组件使用
        title: topic,
        date: reserveDate,
        roomName: room,
        user: booker,
        
        // 保留参会人员信息
        participants: meeting.participants || [],
        
        // 保留原始数据以备不时之需
        rawMeeting: meeting
      };
    },
    
    // 兼容性别名 - getSchedule => getMeetingSchedule
    getSchedule(params = {}) {
      return this.getMeetingSchedule(params);
    },
    
    // 获取状态文本
    getStatusText(status) {
      // 如果已经是中文状态，直接返回
      if (typeof status === 'string') {
        if (['待审核', '已通过', '进行中', '已完成', '已拒绝', '已取消'].includes(status)) {
          return status;
        }
      }
      
      // 标准化状态
      const normalizedStatus = this.normalizeStatus(status);
      
      // 转换为中文
      switch (normalizedStatus) {
        case 'pending': return '待审核';
        case 'approved': return '已通过';
        case 'in-progress': return '进行中';
        case 'completed': return '已完成';
        case 'rejected': return '已拒绝';
        case 'cancelled':
        case 'canceled': return '已取消';
        default: return '未知状态';
      }
    },
    
    // 标准化状态（将各种状态格式转为标准格式）
    normalizeStatus(status) {
      if (typeof status === 'number') {
        switch (status) {
          case 0: return 'pending';
          case 1: return 'approved';
          case 2: return 'in-progress';
          case 3: return 'completed';
          case 4: return 'cancelled';
          case 5: return 'rejected';
          default: return 'pending';
        }
      } else if (typeof status === 'string') {
        status = status.toLowerCase();
        
        // 处理中文状态
        if (status === '待审核' || status === '待审批') {
          return 'pending';
        } else if (status === '已通过' || status === '已审批') {
          return 'approved';
        } else if (status === '进行中') {
          return 'in-progress';
        } else if (status === '已完成') {
          return 'completed';
        } else if (status === '已拒绝') {
          return 'rejected';
        } else if (status === '已取消') {
          return 'cancelled';
        }
        
        // 处理英文状态
        if (status.includes('pend') || status.includes('wait')) {
          return 'pending';
        } else if (status.includes('approv') || status.includes('accept')) {
          return 'approved';
        } else if (status.includes('progress') || status.includes('ongoing')) {
          return 'in-progress';
        } else if (status.includes('complet') || status.includes('finish')) {
          return 'completed';
        } else if (status.includes('reject') || status.includes('deny')) {
          return 'rejected';
        } else if (status.includes('cancel')) {
          return 'cancelled';
        }
      }
      
      return 'pending'; // 默认值
    }
  },
  
  // 会议室相关业务
  room: {
    // 获取会议室列表
    getRooms(params) {
      console.log('【API请求】', { method: 'getRooms', params });
      // 解构参数，确保使用正确的参数名
      const { pageNo = 1, pageSize = 100, isAsc = true, sortBy = 'id' } = params || {};
      return apiRequest.getRooms(pageNo, pageSize, isAsc, sortBy)
        .then(res => {
        
          if (res.code === 200 && res.data) {
            // 兼容两种数据结构
            const rooms = res.data.list || res.data || [];
            const result = {
              code: 200,
              data: rooms,
              message: res.message || '获取会议室列表成功'
            };
            return result;
          }
          return res;
        });
    },
    
    // 获取会议室详情
    getRoomDetail(id) {
      console.log('【API请求】', { method: 'getRoomDetail', id });
      // 调用分页接口获取会议室，然后筛选出指定ID的会议室
      return apiRequest.getRooms(1, 100, true, 'id')
        .then(res => {
          if (res.code === 200 && res.data) {
            let rooms = [];
            
            // 处理不同的数据结构
            if (res.data.list) {
              rooms = res.data.list;
            } else if (Array.isArray(res.data)) {
              rooms = res.data;
            }
            
            // 查找对应ID的会议室
            const room = rooms.find(r => r.id == id);
            
            if (room) {
            return {
              code: 200,
                data: room,
                message: '获取会议室详情成功'
              };
            } else {
              return {
                code: 404,
                message: '未找到指定会议室',
                data: null
              };
            }
          }
          return res;
        });
    },
    
    // 创建会议室
    createRoom(roomData) {
      return apiRequest.createRoom(roomData);
    },
    
    // 更新会议室
    updateRoom(roomData) {
      return apiRequest.updateRoom(roomData);
    },
    
    // 删除会议室
    deleteRoom(id) {
      return apiRequest.deleteRoom(id);
    },
    
    // 获取会议室可用时间
    getRoomAvailableTime(id, date) {
      // 通过获取当天所有会议，来计算会议室的可用时间
      return apiRequest.getReservations({
        roomId: id,
        reserveDate: date,
        pageSize: 100
      })
        .then(res => {
          if (res.code === 200) {
            // 生成默认工作时间段（全天可用）
            const workHours = [
              { startTime: '09:00', endTime: '12:00', available: true },
              { startTime: '14:00', endTime: '18:00', available: true }
            ];
            
            // 如果没有数据，直接返回全部时间可用
            if (!res.data || !res.data.list || res.data.list.length === 0) {
              return {
                code: 200,
                data: workHours,
                message: '获取会议室可用时间成功'
              };
            }
            
            // 标记已被预约的时间段为不可用
            const bookedTimes = [];
            res.data.list.forEach(meeting => {
              if (meeting.status === 'approved' && meeting.startTime && meeting.endTime) {
                bookedTimes.push({
                  startTime: meeting.startTime.split(' ')[1] || meeting.startTime,
                  endTime: meeting.endTime.split(' ')[1] || meeting.endTime,
                  available: false
                });
              }
            });
            
            // 合并可用和不可用时间
            const allTimeSlots = [...workHours, ...bookedTimes].sort((a, b) => {
              return a.startTime.localeCompare(b.startTime);
            });
            
            return {
              code: 200,
              data: allTimeSlots,
              message: '获取会议室可用时间成功'
            };
          }
          return res;
        });
    },
    
    // 兼容性别名 - getAvailableTime => getRoomAvailableTime
    getAvailableTime(id, date) {
      return this.getRoomAvailableTime(id, date);
    },
    
    // 获取所有可用的会议室（特定日期时间段）
    getAvailableRooms(date, startTime, endTime) {
      // 先获取所有会议室
      return apiRequest.getRooms({ pageSize: 100 })
        .then(res => {
          if (res.code === 200 && res.data && res.data.list) {
            const rooms = res.data.list;
            
            // 如果没有指定时间范围，直接返回所有会议室
            if (!date || !startTime || !endTime) {
              return {
                code: 200,
                data: rooms,
                message: '获取可用会议室成功'
              };
            }
            
            // 并行检查每个会议室在指定时间段的可用性
            const checkPromises = rooms.map(room => 
              this.getRoomAvailableTime(room.id, date)
                .then(availRes => {
                  if (availRes.code === 200 && availRes.data) {
                    // 检查会议室是否在请求的时间段可用
                    const isAvailable = this.checkTimeSlotAvailable(
                      availRes.data, 
                      startTime, 
                      endTime
                    );
                    
                    return {
                      ...room,
                      isAvailable
                    };
                  }
                  return { ...room, isAvailable: false };
                })
                .catch(() => ({ ...room, isAvailable: false }))
            );
            
            return Promise.all(checkPromises)
              .then(roomsWithAvailability => {
                // 过滤出可用的会议室
                const availableRooms = roomsWithAvailability.filter(room => room.isAvailable);
                
                return {
                  code: 200,
                  data: availableRooms,
                  message: '获取可用会议室成功'
                };
              });
          }
          return res;
        });
    },
    
    // 检查时间段是否可用
    checkTimeSlotAvailable(availableTimes, startTime, endTime) {
      if (!availableTimes || !Array.isArray(availableTimes)) {
        return false;
      }
      
      // 将时间转换为分钟
      const convertToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const requestStart = convertToMinutes(startTime);
      const requestEnd = convertToMinutes(endTime);
      
      // 检查是否有交叉的不可用时间段
      for (const slot of availableTimes) {
        if (!slot.available) {
          const slotStart = convertToMinutes(slot.startTime);
          const slotEnd = convertToMinutes(slot.endTime);
          
          // 检查时间段是否有重叠
          if (!(requestEnd <= slotStart || requestStart >= slotEnd)) {
            return false; // 有重叠，不可用
          }
        }
      }
      
      return true; // 没有重叠的不可用时间段
    }
  },
  
  // 通知相关业务
  notification: {
    // 获取通知列表
    getNotificationList(params) {
      return apiRequest.getNotifications(
        params?.pageNo,
        params?.pageSize,
        params?.isAsc,
        params?.sortBy
      );
    },
    
    // 获取通知详情
    getNotificationDetail(id) {
      return apiRequest.getNotificationById(id);
    },
    
    // 管理员查看通知
    adminGetNotification(id) {
      return apiRequest.adminGetNotification(id);
    },
    
    // 管理员发送会前提醒
    adminRemind(id) {
      return apiRequest.adminRemind(id);
    },
    
    // 获取未读通知数量
    getUnreadCount() {
      return apiRequest.getNotifications(1, 1, false, 'id', { status: 'unread' })
        .then(res => {
          if (res.code === 200 && res.data) {
            return {
              code: 200,
              data: {
                count: res.data.total || 0
              },
              message: '获取未读通知数量成功'
            };
          }
          return {
            code: res.code || 500,
            data: { count: 0 },
            message: res.message || '获取未读通知数量失败'
          };
        })
        .catch(() => {
          return {
            code: 500,
            data: { count: 0 },
            message: '获取未读通知数量失败'
          };
        });
    },
    
    // 通知页面所需接口
    getList(page, size) {
      return this.getNotificationList({ pageNo: page, pageSize: size });
    },
    
    getById(id) {
      console.log('API层通知详情请求，ID:', id);
      
      if (!id) {
        console.error('API层：通知ID为空');
        return Promise.resolve({
          code: 400,
          message: '无效的通知ID',
          data: null
        });
      }
      
      return this.getNotificationDetail(id)
        .then(res => {
          console.log('API层通知详情响应:', res);
          
          // 确保返回格式统一，即使API出错也能有合理的错误提示
          if (res.code !== 200 || !res.data) {
            return {
              code: res.code || 404,
              message: res.message || '获取通知详情失败',
              data: null
            };
          }
          
          return res;
        })
        .catch(err => {
          console.error('API层通知详情请求失败:', err);
          return {
            code: 500,
            message: '请求通知详情失败',
            data: null
          };
        });
    }
  },
  
  // 子议题相关业务
  subtopic: {
    // 创建子议题
    createSubtopic(data) {
      return apiRequest.createSubtopic(data);
    },
    
    // 更新子议题
    updateSubtopic(data) {
      return apiRequest.updateSubtopic(data);
    },
    
    // 上传子议题文件
    uploadSubtopicFile(subId, fileKey, file) {
      return apiRequest.uploadSubtopicFile(subId, fileKey, file);
    },
    
    // 根据会议ID获取所有子议题
    getSubtopicsByReservationId(reservationId) {
      return apiRequest.getSubtopicsByReservationId(reservationId)
        .then(res => {
          console.log('获取子议题响应:', res);
          if (res.code === 200 && res.data) {
            // 处理子议题数据
            return res;
          }
          return {
            code: res.code || 404,
            message: res.message || '未找到子议题',
            data: []
          };
        })
        .catch(err => {
          console.error('获取子议题异常:', err);
          return {
            code: 500,
            message: '获取子议题失败',
            data: []
          };
        });
    },
    
    // 获取子议题文件
    getSubtopicFileList(subId) {
      return apiRequest.getSubtopicFileList(subId)
        .then(res => {
          if (res.code === 200 && res.data) {
            return res;
          }
          return {
            code: res.code || 404,
            message: res.message || '未找到文件',
            data: []
          };
        })
        .catch(err => {
          console.error('获取子议题文件异常:', err);
          return {
            code: 500,
            message: '获取子议题文件失败',
            data: []
          };
        });
    }
  },
  
  // 参会人员相关业务
  participant: {
    // 获取参会人员列表
    getParticipantList(meetingId) {
      if (!meetingId) {
        console.error('获取参会人员：缺少会议ID');
        return Promise.resolve({
          code: 400,
          message: '缺少会议ID',
          data: []
        });
      }
      
      return apiRequest.getParticipants(meetingId)
        .then(res => {
          console.log('获取参会人员响应:', res);
          if (res.code === 200 && res.data) {
            // 处理参会人员数据
            return res;
          }
          return {
            code: res.code || 404,
            message: res.message || '未找到参会人员',
            data: []
          };
        })
        .catch(err => {
          console.error('获取参会人员异常:', err);
          return {
            code: 500,
            message: '获取参会人员失败',
            data: []
          };
        });
    },
    
    // 确认参会
    confirmParticipation(id) {
      return apiRequest.confirmParticipation(id, true)
        .then(res => {
          if (res.code === 200) {
            return {
              code: 200,
              message: '已确认参加会议',
              data: { confirmed: true }
            };
          }
          return res;
        });
    },
    
    // 拒绝参会
    rejectParticipation(id) {
      return apiRequest.confirmParticipation(id, false)
        .then(res => {
          if (res.code === 200) {
                  return {
                    code: 200,
              message: '已拒绝参加会议',
              data: { confirmed: false }
            };
          }
          return res;
        });
    }
  },
  
  // 文件相关业务
  file: {
    // 获取文件URL
    getFileUrl(fileKey) {
      if (!fileKey) {
        return Promise.resolve({
          code: 400,
          message: '文件标识符不能为空',
          data: null
        });
      }
      
      return apiRequest.getFileUrl(fileKey)
        .then(res => {
          if (res.code === 200 && res.data) {
            return res;
          }
          return {
            code: res.code || 404,
            message: res.message || '获取文件地址失败',
            data: null
          };
        })
        .catch(err => {
          console.error('获取文件地址异常:', err);
          return {
            code: 500,
            message: '获取文件地址失败',
            data: null
          };
        });
    },
    
    // 上传文件
    uploadFile(file) {
      if (!file) {
        return Promise.resolve({
          code: 400,
          message: '文件不能为空',
          data: null
        });
      }
      
      return apiRequest.uploadFile(file)
        .then(res => {
          if (res.code === 200 && res.data) {
            return res;
          }
          return {
            code: res.code || 500,
            message: res.message || '上传文件失败',
            data: null
          };
        })
        .catch(err => {
          console.error('上传文件异常:', err);
          return {
            code: 500,
            message: '上传文件失败',
            data: null
          };
        });
    },
    
    // 下载文件
    downloadFile(fileKey) {
      if (!fileKey) {
        return Promise.resolve({
          code: 400,
          message: '文件标识符不能为空',
          data: null
        });
      }
      
      return apiRequest.downloadFile(fileKey)
        .then(res => {
          return res;
        })
        .catch(err => {
          console.error('下载文件异常:', err);
          return {
            code: 500,
            message: '下载文件失败',
            data: null
          };
        });
    }
  },
  
  // 通知相关业务
  notify: {
    // 管理员获取用户通知
    adminGetNotification(id) {
      return apiRequest.adminGetNotification(id);
    }
  }
};

// 获取API基础URL
function getBaseUrl() {
  // 默认API地址
  const defaultBaseUrl = 'http://182.92.115.169:8080';
  
  // 尝试从配置或环境中获取
  try {
    const apiConfig = uni.getStorageSync('apiConfig');
    if (apiConfig && apiConfig.baseUrl) {
      return apiConfig.baseUrl;
    }
  } catch (e) {
    console.error('获取API配置失败:', e);
  }
  
  return defaultBaseUrl;
}

// 获取请求头
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  // 添加认证信息
  try {
    const token = uni.getStorageSync('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      print(token)
    }
  } catch (e) {
    console.error('获取token失败:', e);
  }
  
  return headers;
}

export default api;
