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
				platformInfo: '检测中...',
				isMobile: false
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
				// 检测H5是否为手机端
				const userAgent = navigator.userAgent.toLowerCase();
				this.isMobile = /iphone|ipad|ipod|android|mobile|phone/.test(userAgent);
				
				if (this.isMobile) {
					platform += '(手机)';
					console.log("当前平台: Web端(手机)，将跳转到用户登录页面");
				} else {
					console.log("当前平台: Web端(PC)，将跳转到管理员登录页面");
				}
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

				// 在 setTimeout 中执行跳转，确保平台检测完成
				setTimeout(() => {
					// #ifdef H5
					if (this.isMobile) {
						// 手机H5跳转到用户端
						console.log("执行跳转到用户登录页面");
						uni.reLaunch({
							url: '/pages/user/login'
						});
					} else {
						// PC端H5跳转到管理员端
						console.log("执行跳转到管理员登录页面");
						uni.reLaunch({
							url: '/pages/admin/login'
						});
					}
					// #endif

					// #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
					uni.reLaunch({
						url: '/pages/user/login'
					});
					// #endif
				}, 100);
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