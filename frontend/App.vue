<template>
	<router-view></router-view>
</template>

<script>
	export default {
		name: 'App',
		setup() {
			console.log('App Launch')
			
			return {}
		},
		mounted() {
			console.log('App Mounted')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url('/static/tabbar/tabbar.css');

	body {
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
		background-color: #f5f7fa;
		padding-bottom: 70px; /* 为底部导航栏留出空间 */
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
