<template>
	<!-- 移除 router-view，uni-app会自动处理页面切换 -->
</template>

<script>
	import { pageLoggerMixin } from './utils/page-logger.js'
	import { debugPageState } from './utils/helper.js'
	import config from './config'
	
	export default {
		name: 'App',
		mixins: [pageLoggerMixin],
		setup() {
			// 禁用启动日志
			// console.log('应用启动')
			
			// 添加全局错误处理
			if (typeof window !== 'undefined') {
				window.addEventListener('error', (event) => {
					console.error('[错误]', event.error)
				})
				
				window.addEventListener('unhandledrejection', (event) => {
					console.error('[Promise错误]', event.reason)
				})
				
				// 暴露调试工具到全局(便于控制台使用)
				window.debugPageState = debugPageState
			}
			
			return {}
		},
		data() {
			return {
				networkStatus: 'unknown',
				lastNetworkCheck: null
			}
		},
		onLaunch() {
			// 在应用启动时检查网络状态
			this.checkNetworkStatus()
		},
		mounted() {
			// 全局页面事件监听
			this.setupPageMonitor()
			
			// 设置网络状态监控
			this.setupNetworkMonitor()
		},
		methods: {
			// 设置全局页面监控
			setupPageMonitor() {
				// 监听路由变化，但不输出日志
				try {
					uni.addInterceptor('navigateTo', {
						invoke(params) {
							// 不再输出路由日志
							return params
						}
					})
					uni.addInterceptor('redirectTo', {
						invoke(params) {
							// 不再输出路由日志
							return params
						}
					})
					uni.addInterceptor('reLaunch', {
						invoke(params) {
							// 不再输出路由日志
							return params
						}
					})
					uni.addInterceptor('switchTab', {
						invoke(params) {
							// 不再输出路由日志
							return params
						}
					})
					uni.addInterceptor('navigateBack', {
						invoke(params) {
							// 不再输出路由日志
							return params
						}
					})
				} catch (e) {
					console.error('页面监控初始化失败:', e)
				}
			},
			
			// 设置网络状态监控
			setupNetworkMonitor() {
				try {
					// 监听网络状态变化
					uni.onNetworkStatusChange((res) => {
						this.networkStatus = res.networkType
						this.lastNetworkCheck = new Date().toISOString()
						
						if (!res.isConnected) {
							uni.showToast({
								title: '网络连接已断开',
								icon: 'none',
								duration: 2000
							})
						} else if (this.lastNetworkType === 'none' && res.isConnected) {
							uni.showToast({
								title: '网络已恢复',
								icon: 'success',
								duration: 2000
							})
						}
						
						this.lastNetworkType = res.networkType
					})
				} catch (e) {
					console.error('网络监控初始化失败:', e)
				}
			},
			
			// 检查网络状态
			checkNetworkStatus() {
				try {
					uni.getNetworkType({
						success: (res) => {
							this.networkStatus = res.networkType
							this.lastNetworkCheck = new Date().toISOString()
							this.lastNetworkType = res.networkType
							
							if (res.networkType === 'none') {
								uni.showToast({
									title: '当前无网络连接',
									icon: 'none',
									duration: 2000
								})
							}
						}
					})
				} catch (e) {
					console.error('获取网络状态失败:', e)
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url('/static/tabbar/tabbar.css');
	@import url('/static/fonts/iconfont.css');

	body {
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', Arial, sans-serif;
		background-color: #f5f7fa;
		padding-bottom: 70px; /* 为底部导航栏留出空间 */
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		letter-spacing: normal;
		font-weight: 400;
		text-shadow: none;
	}

	/* emoji 图标样式 */
	.emoji-icon {
		font-size: 24px;
		display: inline-block;
		line-height: 1;
		text-align: center;
	}

	/* tabbar 图标的 emoji 版本 */
	.tab-emoji-calendar:before {
		content: '📅';
	}

	.tab-emoji-meeting:before {
		content: '🏢';
	}

	.tab-emoji-notification:before {
		content: '🔔';
	}

	.tab-emoji-user:before {
		content: '👤';
	}
	
	/* 安全区域适配 */
	.safe-area-bottom {
		padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
		padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
	}
</style>
