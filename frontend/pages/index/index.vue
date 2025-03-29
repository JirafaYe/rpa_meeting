<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
			<view class="platform-info">
				<text>当前平台: {{platformInfo}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '会议系统',
				platformInfo: '检测中...'
			}
		},
		onLoad() {
			// 判断平台并跳转
			this.checkPlatformAndRedirect();
		},
		methods: {
			checkPlatformAndRedirect() {
				// 先检测平台
				let platform = '未知平台';
				
				// #ifdef H5
				platform = 'H5 Web端';
				console.log("当前平台: Web端，将跳转到管理员登录页面");
				// #endif
				
				// #ifdef APP-PLUS
				platform = 'APP移动端';
				console.log("当前平台: APP端，将跳转到用户登录页面");
				// #endif
				
				// #ifdef MP-WEIXIN
				platform = '微信小程序';
				console.log("当前平台: 微信小程序，将跳转到用户登录页面");
				// #endif
				
				// #ifdef MP-ALIPAY
				platform = '支付宝小程序';
				console.log("当前平台: 支付宝小程序，将跳转到用户登录页面");
				// #endif
				
				// #ifdef MP-BAIDU
				platform = '百度小程序';
				console.log("当前平台: 百度小程序，将跳转到用户登录页面");
				// #endif
				
				// #ifdef MP-TOUTIAO
				platform = '头条小程序';
				console.log("当前平台: 头条小程序，将跳转到用户登录页面");
				// #endif
				
				// #ifdef MP-QQ
				platform = 'QQ小程序';
				console.log("当前平台: QQ小程序，将跳转到用户登录页面");
				// #endif
				
				this.platformInfo = platform;
				
				// 检查是否已经登录
				const token = uni.getStorageSync('token');
				const userInfo = uni.getStorageSync('userInfo');
				
				// 如果已经登录，直接跳转到主页面
				if (token && userInfo) {
					try {
						const userObj = JSON.parse(userInfo);
						// 判断用户角色，决定跳转目标
						if (userObj.role === 'admin') {
							console.log('检测到管理员已登录，直接跳转到管理员首页');
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/admin/dashboard'
								});
							}, 500);
							return;
						} else {
							console.log('检测到用户已登录，直接跳转到用户首页');
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/user/schedule'
								});
							}, 500);
							return;
						}
					} catch (e) {
						console.error('解析用户信息失败', e);
						// 登录信息异常，清空并继续正常跳转流程
						uni.removeStorageSync('token');
						uni.removeStorageSync('userInfo');
					}
				}
				
				// 等待1秒后再跳转，方便查看平台信息
				setTimeout(() => {
					// #ifdef H5
					// Web端访问，跳转到管理员页面
					uni.reLaunch({
						url: '/pages/admin/login'
					});
					// #endif
					
					// #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
					// 移动端访问，跳转到用户页面
					uni.reLaunch({
						url: '/pages/user/login'
					});
					// #endif
				}, 2000);
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
		margin-bottom: 20rpx;
	}
	
	.platform-info {
		font-size: 28rpx;
		color: #3498db;
		padding: 10rpx 20rpx;
		background-color: #f0f8ff;
		border-radius: 10rpx;
		margin-top: 10rpx;
	}
</style>
