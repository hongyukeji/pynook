<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">
				<navigator :url="'/pages/auth/login'">登陆</navigator>
				<navigator :url="'/pages/auth/register'">注册</navigator>
				<hr>
				<navigator :url="'/pages/user/balance/balance'">余额</navigator>
				<navigator :url="'/pages/user/integral/integral'">积分</navigator>
				<navigator :url="'/pages/user/token/token'">通证</navigator>
				<hr>
				<navigator :url="'/pages/user/bill/bill'">账单</navigator>
				<navigator :url="'/pages/user/order/order'">订单</navigator>
				<navigator :url="'/pages/user/message/message'">消息</navigator>
				<hr>
				<navigator :url="'/pages/user/sign/sign'">签到</navigator>
				<navigator :url="'/pages/user/invite/invite'">邀请</navigator>
			</view>
		</view>
		<view class="page-footer"></view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {};
		},
		onLoad() {},
		onShow() {},
		onReady() {},
		methods: {},
	}
</script>

<style lang="scss" scoped>
	page {}

	.page-wrap {}

	.page-hedaer {}

	.page-body {}

	.page-footer {}

	.container {}
</style>