<template>
  <admin-layout 
    title="管理员控制台" 
    description="会议系统管理后台的核心功能与数据概览"
    active-path="/pages/admin/home">
    <div class="dashboard-content">
    <!-- 顶部统计卡片 -->
      <div class="statistics-cards">
        <div class="stat-card" @click="navigateToMeetingList">
          <div class="stat-icon">
            <i class="icon-meetings"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{statistics.meetings}}</div>
            <div class="stat-label">今日会议</div>
          </div>
        </div>
        
        <div class="stat-card" @click="navigateToApprovedMeetings">
          <div class="stat-icon approved">
            <i class="icon-approved"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value approved">{{statistics.approved}}</div>
            <div class="stat-label">今日已通过</div>
          </div>
        </div>
        
        <div class="stat-card" @click="navigateToPendingMeetings">
          <div class="stat-icon pending">
            <i class="icon-pending"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value pending">{{statistics.pending}}</div>
            <div class="stat-label">今日待审批</div>
          </div>
        </div>
        
        <div class="stat-card" @click="navigateToRoomList">
          <div class="stat-icon rooms">
            <i class="icon-rooms"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value rooms">{{statistics.rooms}}</div>
            <div class="stat-label">会议室数量</div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-row">
        <!-- 即将开始的会议 -->
        <div class="dashboard-card upcoming-meetings">
          <div class="card-header">
            <h3 class="card-title">即将开始的会议</h3>
            <a href="javascript:;" @click="navigateToMeetingList" class="card-more">查看全部</a>
          </div>
          
          <div class="meeting-list">
            <div class="meeting-item" v-for="(item, index) in upcomingMeetings" :key="index">
              <div class="meeting-content" @click="navigateToMeetingDetail(item.id)">
                <div class="meeting-title">{{item.title}}</div>
                <div class="meeting-info">
                  <span class="meeting-time"><i class="icon-time"></i> {{item.time}}</span>
                  <span class="meeting-room"><i class="icon-room"></i> {{item.room}}</span>
                </div>
              </div>
              <div class="meeting-status">
                <span class="badge" :class="getStatusClass(item.status)">{{item.statusText}}</span>
                <button class="btn-detail" @click.stop="navigateToMeetingDetail(item.id)">
                  <i class="icon-detail"></i>详情
                </button>
              </div>
            </div>
            
            <div class="no-data" v-if="upcomingMeetings.length === 0">
              <div class="no-data-icon">
                <i class="icon-empty"></i>
              </div>
              <div class="no-data-text">暂无即将开始的会议</div>
            </div>
          </div>
        </div>
        
        <!-- 待审批会议 -->
        <div class="dashboard-card pending-approvals">
          <div class="card-header">
            <h3 class="card-title">今日待审批会议</h3>
            <a href="javascript:;" @click="navigateToPendingMeetings" class="card-more">查看全部</a>
          </div>
          
          <div class="approval-list">
            <!-- 加载中显示加载指示器 -->
            <div class="loading-container" v-if="loading">
              <div class="loading-spinner"></div>
              <div class="loading-text">加载中...</div>
            </div>
            
            <!-- 有数据时显示列表 -->
            <template v-else>
            <div class="approval-item" v-for="(item, index) in pendingApprovals" :key="index">
              <div class="approval-content" @click="navigateToMeetingDetail(item.id)">
                <div class="approval-title">{{item.title}}</div>
                <div class="approval-info">
                  <span class="approval-applicant"><i class="icon-user"></i> {{item.organizer}}</span>
                  <span class="approval-time"><i class="icon-calendar"></i> {{item.date}}</span>
                </div>
              </div>
              <div class="approval-actions">
                <button class="btn-detail" @click.stop="navigateToMeetingDetail(item.id)">
                  <i class="icon-detail"></i>详情
                </button>
                <button class="btn-approve" @click.stop="handleApprove(item.id)">批准</button>
                <button class="btn-reject" @click.stop="handleReject(item.id)">拒绝</button>
              </div>
            </div>
            
              <!-- 无数据时显示提示 -->
            <div class="no-data" v-if="pendingApprovals.length === 0">
              <div class="no-data-icon">
                <i class="icon-empty"></i>
              </div>
              <div class="no-data-text">暂无待审批会议</div>
              </div>
            </template>
            
            <!-- 分页控制器 -->
            <div class="pagination" v-show="!loading && (total > 0)">
              <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage">
                上一页
              </button>
              
              <div class="pagination-info">
                <span>第 {{ currentPage }} 页/共 {{ totalPages || 1 }} 页</span>
                <span class="pagination-total">总计 {{ total }} 条记录</span>
              </div>
              
              <button class="pagination-btn" :disabled="currentPage === totalPages || totalPages === 0" @click="nextPage">
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import api from '../../api/index'
import AdminLayout from '../../components/admin/AdminLayout.vue'

export default {
  components: {
    AdminLayout
  },
  data() {
    return {
      statistics: {
        meetings: 0,
        approved: 0,
        pending: 0,
        rooms: 0
      },
      upcomingMeetings: [],
      pendingApprovals: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      totalPages: 0,
      loading: false
    }
  },
  created() {
    this.fetchDashboardData();
  },
  onShow() {
    // 页面每次显示时刷新数据
    this.fetchDashboardData();
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.currentPage = 1; // 重置到第一页
    this.fetchDashboardData();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    fetchDashboardData() {
      // 获取统计数据
      this.loading = true;
      uni.showLoading({
        title: '加载中'
      });
      
      // 获取当前日期
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0]; // 格式如 2023-07-20
      
      // 获取会议总数和状态统计
      api.meeting.getMeetingStats().then(res => {
        console.log('会议统计响应数据:', res);
        if (res && res.code === 200 && res.data) {
          // 当getMeetingStats接口返回的状态数据可信时使用
          if (res.data.hasOwnProperty('approved') && res.data.hasOwnProperty('pending')) {
          this.statistics.approved = res.data.approved || 0;
          this.statistics.pending = res.data.pending || 0;
            console.log('会议统计API直接返回的审批/待审批数据:', this.statistics);
          } else {
            // 接口没有直接返回状态统计，需要手动设置为0，后续单独查询
            this.statistics.approved = 0;
            this.statistics.pending = 0;
          }
        } else {
          console.warn('会议统计数据格式不正确:', res);
        }
      }).catch(err => {
        console.error('获取会议统计失败:', err);
      });
      
      // 单独获取已审批会议数量（今日）
      api.meeting.getMeetings({
        status: '已通过',
        reserveDate: todayStr,  // 添加今日日期筛选
        pageSize: 100,
        pageNo: 1
      }).then(res => {
        if (res && res.code === 200 && res.data) {
          // 判断数据结构
          if (res.data.hasOwnProperty('total')) {
            // 标准分页格式
            this.statistics.approved = res.data.total || 0;
          } else if (Array.isArray(res.data)) {
            // 数组格式
            this.statistics.approved = res.data.length;
          }
          console.log('今日已审批会议数量更新为:', this.statistics.approved);
        }
      }).catch(err => {
        console.error('获取今日已审批会议数量失败:', err);
      });
      
      // 单独获取待审核会议数量（今日）
      api.meeting.getMeetings({
        status: '待审核',
        reserveDate: todayStr,  // 添加今日日期筛选
        pageSize: 100,
        pageNo: 1
      }).then(res => {
        if (res && res.code === 200 && res.data) {
          // 判断数据结构
          if (res.data.hasOwnProperty('total')) {
            // 标准分页格式
            this.statistics.pending = res.data.total || 0;
          } else if (Array.isArray(res.data)) {
            // 数组格式
            this.statistics.pending = res.data.length;
          }
          console.log('今日待审核会议数量更新为:', this.statistics.pending);
        }
      }).catch(err => {
        console.error('获取今日待审核会议数量失败:', err);
      });
      
      // 专门获取今日会议数量
      api.meeting.getMeetings({
        reserveDate: todayStr, // 使用今天的日期作为查询参数
        pageSize: 100 // 设置较大的页面大小以获取所有今日会议
      }).then(res => {
        if (res && res.code === 200 && res.data) {
          // 判断数据结构
          if (res.data.list) {
            // 标准分页格式
            this.statistics.meetings = res.data.list.length;
          } else if (Array.isArray(res.data)) {
            // 数组格式
            this.statistics.meetings = res.data.length;
          } else {
            this.statistics.meetings = 0;
          }
          console.log('今日会议数量更新为:', this.statistics.meetings);
        } else {
          console.warn('获取今日会议数据失败:', res);
          this.statistics.meetings = 0;
        }
      }).catch(err => {
        console.error('获取今日会议数量失败:', err);
        this.statistics.meetings = 0;
      });
      
      // 获取会议室总数
      api.room.getRooms().then(res => {
        console.log('会议室响应数据:', res);
        if (res && res.code === 200 && res.data) {
          // 兼容数组和对象两种情况
          const roomData = Array.isArray(res.data) ? res.data : (res.data.list || []);
          this.statistics.rooms = roomData.length;
          console.log('会议室数量更新后:', this.statistics.rooms);
        } else {
          console.warn('会议室数据格式不正确:', res);
        }
      }).catch(err => {
        console.error('获取会议室数量失败:', err);
      });
      
      // 获取即将到来的会议
      api.meeting.getMeetings({
        reserveDate: todayStr,
        status: '已通过'  // 使用正确的状态值
      }).then(res => {
        if (res && res.code === 200 && res.data) {
          let meetingData = Array.isArray(res.data) ? res.data : [];
          
          // 筛选出今天的且当前时间之后的会议
          const currentTime = new Date();
          meetingData = meetingData.filter(meeting => {
            // 创建会议的日期时间对象
            const meetingTime = new Date(`${meeting.reserveDate} ${meeting.startTime}`);
            // 比较会议时间是否在当前时间之后
            return meetingTime > currentTime;
          });
          
          this.upcomingMeetings = meetingData.map(meeting => {
            return {
              id: meeting.id,
              title: meeting.topic,
              reserveDate: meeting.reserveDate,
              time: `${meeting.reserveDate}  ${meeting.startTime || ''} - ${meeting.endTime || ''}`,
              room: meeting.room || '未知会议室',
              status: meeting.status,
              statusText: this.getStatusText(meeting.status)
            };
          });
          console.log('即将到来的会议更新后:', this.upcomingMeetings);
        } else {
          console.warn('即将到来的会议数据格式不正确:', res);
        }
      }).catch(err => {
        console.error('获取即将到来的会议失败:', err);
      });
      
      // 获取待审批会议
      api.meeting.getMeetings({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        status: '待审核',  // 明确指定状态参数
        reserveDate: todayStr // 添加今日日期筛选
      }).then(res => {
        if (res && res.code === 200 && res.data) {
          // 判断数据结构
          if (res.data.list) {
            // 标准分页格式
            const pendingData = res.data.list || [];
            this.total = res.data.total || 0;
            this.totalPages = res.data.pages || Math.ceil(this.total / this.pageSize) || 1;
            
            this.pendingApprovals = pendingData.map(meeting => {
              return {
                id: meeting.id,
                title: meeting.topic,
                date: `${meeting.reserveDate}  ${meeting.startTime || ''} - ${meeting.endTime || ''}`,
                room: meeting.room || '未知会议室',
                organizer: meeting.booker || '未知预约人'
              };
            });
          } else {
            // 数组格式
          const pendingData = Array.isArray(res.data) ? res.data : [];
            //筛选出"待审核"
            const filteredData = pendingData.filter(meeting => meeting.status === '待审核');
            this.total = filteredData.length;
            this.totalPages = Math.ceil(this.total / this.pageSize) || 1;
            // 用reserveDate和startTime进行排序
            filteredData.sort((a, b) => {
              const dateA = new Date(`${a.reserveDate} ${a.startTime}`);
              const dateB = new Date(`${b.reserveDate} ${b.startTime}`);
              return dateA - dateB;
            });
            this.pendingApprovals = filteredData.slice(0, this.pageSize).map(meeting => {
            return {
              id: meeting.id,
              title: meeting.topic,
              date: `${meeting.reserveDate}  ${meeting.startTime || ''} - ${meeting.endTime || ''}`,
                room: meeting.room || '未知会议室',
                organizer: meeting.booker || '未知预约人'
            };
          });
          }
          
          console.log('待审批会议更新后:', this.pendingApprovals);
          console.log('分页信息:', { 当前页: this.currentPage, 总页数: this.totalPages, 总记录数: this.total });
        } else {
          console.warn('待审批会议数据格式不正确:', res);
        }
      }).catch(err => {
        console.error('获取待审批会议失败:', err);
      }).finally(() => {
        uni.hideLoading();
        this.loading = false;
      });
    },
    navigateToMeetingList() {
      uni.navigateTo({
        url: '/pages/admin/meeting/list'
      });
    },
    navigateToApprovedMeetings() {
      uni.navigateTo({
        url: '/pages/admin/meeting/list?status=approved'
      });
    },
    navigateToPendingMeetings() {
      uni.navigateTo({
        url: '/pages/admin/meeting/list?status=pending'
      });
    },
    navigateToRoomList() {
      uni.navigateTo({
        url: '/pages/admin/room/list'
      });
    },
    navigateToMeetingDetail(id) {
      uni.navigateTo({
        url: `/pages/admin/meeting/detail?id=${id}`
      });
    },
    getStatusText(status) {
      const statusTextMap = {
        '已通过': '已通过',
        '待审核': '待审核',
        '已拒绝': '已拒绝'
      };
      return statusTextMap[status] || status;
    },
    getStatusClass(status) {
      const statusMap = {
        '已通过': 'badge-success',
        '待审核': 'badge-warning',
        '已拒绝': 'badge-danger'
      };
      return statusMap[status] || 'badge-secondary';
    },
    handleApprove(id) {
      uni.showModal({
        title: '确认审批',
        content: '确定批准该会议申请吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '处理中...' });
            // 使用API审批会议
            api.meeting.approveReservation(id, true)
              .then(res => {
                if (res && res.code === 200) {
                  uni.showToast({
                    title: '已批准',
                    icon: 'success'
                  });
                  // 更新列表
                  this.fetchDashboardData();
                } else {
                  uni.showToast({
                    title: res.message || '操作失败',
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
                console.error('审批失败:', err);
                uni.showToast({
                  title: '审批失败，请稍后重试',
                  icon: 'none'
                });
              })
              .finally(() => {
                uni.hideLoading();
              });
          }
        }
      });
    },
    handleReject(id) {
      uni.showModal({
        title: '确认拒绝',
        content: '确定拒绝该会议申请吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '处理中...' });
            
            // 使用API拒绝会议
            api.meeting.approveReservation(id, false)
              .then(res => {
                if (res && res.code === 200) {
                  uni.showToast({
                    title: '已拒绝',
                    icon: 'success'
                  });
                  // 更新列表
                  this.fetchDashboardData();
                } else {
                  uni.showToast({
                    title: res.message || '操作失败',
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
                console.error('拒绝失败:', err);
                uni.showToast({
                  title: '拒绝失败，请稍后重试',
                  icon: 'none'
                });
              })
              .finally(() => {
                uni.hideLoading();
            });
          }
        }
      });
    },
    handlePageChange(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) {
        return;
      }
      
      this.currentPage = page;
      this.fetchDashboardData();
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.handlePageChange(this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.handlePageChange(this.currentPage + 1);
      }
    }
  }
}
</script>

<style scoped>
.dashboard-content {
  padding: 20px 0;
}

.statistics-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(240, 240, 240, 0.8);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.1;
  background: radial-gradient(circle, currentColor 0%, transparent 70%);
  z-index: 0;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background-color: rgba(24, 144, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
  color: #1890ff;
  font-size: 28px;
  z-index: 1;
  position: relative;
}

.stat-icon.approved {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.stat-icon.pending {
  background-color: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
}

.stat-icon.rooms {
  background-color: rgba(114, 46, 209, 0.1);
  color: #722ed1;
}

.stat-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1890ff;
  line-height: 1.2;
  margin-bottom: 6px;
  background: linear-gradient(90deg, #1890ff, #096dd9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-value.approved {
  background: linear-gradient(90deg, #52c41a, #389e0d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-value.pending {
  background: linear-gradient(90deg, #fa8c16, #d46b08);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-value.rooms {
  background: linear-gradient(90deg, #722ed1, #531dab);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 15px;
  color: #595959;
  font-weight: 500;
}

.dashboard-row {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.dashboard-card {
  flex: 1;
  min-width: 320px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(240, 240, 240, 0.8);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(to right, rgba(240, 247, 255, 0.5), rgba(245, 245, 250, 0.5));
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  position: relative;
  padding-left: 14px;
}

.card-title:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: linear-gradient(to bottom, #1890ff, #096dd9);
  border-radius: 2px;
}

.card-more {
  font-size: 14px;
  color: #1890ff;
  text-decoration: none;
  transition: all 0.3s;
  padding: 6px 12px;
  border-radius: 6px;
}

.card-more:hover {
  color: #40a9ff;
  background-color: rgba(24, 144, 255, 0.1);
}

.meeting-list,
.approval-list {
  padding: 0 24px;
  max-height: 460px;
  overflow-y: auto;
}

.meeting-item,
.approval-item {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.meeting-item:last-child,
.approval-item:last-child {
  border-bottom: none;
}

.meeting-item:hover,
.approval-item:hover {
  background-color: #f5f7fa;
}

.meeting-content,
.approval-content {
  flex: 1;
  cursor: pointer;
}

.meeting-title,
.approval-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meeting-info,
.approval-info {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #8c8c8c;
  flex-wrap: wrap;
}

.meeting-time,
.meeting-room,
.approval-applicant,
.approval-time {
  display: flex;
  align-items: center;
}

.meeting-time i,
.meeting-room i,
.approval-applicant i,
.approval-time i {
  margin-right: 6px;
  font-size: 15px;
}

.meeting-status,
.approval-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
  min-width: 120px;
}

.badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.badge-pending {
  background-color: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
}

.badge-approved {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.badge-rejected {
  background-color: rgba(245, 34, 45, 0.1);
  color: #f5222d;
}

.btn-detail,
.btn-approve,
.btn-reject {
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.btn-detail {
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.btn-detail:hover {
  background-color: rgba(24, 144, 255, 0.2);
}

.btn-approve {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.btn-approve:hover {
  background-color: rgba(82, 196, 26, 0.2);
}

.btn-reject {
  background-color: rgba(245, 34, 45, 0.1);
  color: #f5222d;
}

.btn-reject:hover {
  background-color: rgba(245, 34, 45, 0.2);
}

.btn-detail i,
.btn-approve i,
.btn-reject i {
  margin-right: 4px;
  font-size: 13px;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #8c8c8c;
}

.no-data-icon {
  font-size: 60px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.no-data-text {
  font-size: 15px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(24, 144, 255, 0.1);
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 15px;
  color: #8c8c8c;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  background: linear-gradient(to right, rgba(240, 247, 255, 0.5), rgba(245, 245, 250, 0.5));
}

.pagination-btn {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: #fff;
  color: #262626;
  padding: 6px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.pagination-btn:not([disabled]):hover {
  color: #1890ff;
  border-color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
}

.pagination-btn[disabled] {
  color: #d9d9d9;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.pagination-info {
  font-size: 14px;
  color: #8c8c8c;
  display: flex;
  gap: 8px;
}

.pagination-total {
  color: #595959;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .statistics-cards {
    flex-wrap: wrap;
  }
  
  .stat-card {
    min-width: calc(50% - 20px);
    margin-bottom: 20px;
}

  .dashboard-row {
    flex-direction: column;
  }
  
  .dashboard-card {
    margin-bottom: 24px;
  }

  .meeting-status,
  .approval-actions {
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    min-width: 100%;
  }
  
  .meeting-info,
  .approval-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
  
  .pagination-info {
    order: -1;
  }

  .meeting-status,
  .approval-actions {
    min-width: 80px;
  }
}
</style> 