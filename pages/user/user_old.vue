
<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">

				<view class="userinfo-wrap" v-if="userData.isLogin">
					<view class="username">
						{{userData?.userInfo?.username}}
					</view>
					<view class="avatar" style="height: 120px;">
						<image class="avatar-image" :src="userData?.userInfo?.avatar" :mode="'heightFix'" style="height: 100%;"></image>
					</view>
				</view>

				<view class="login-wrap" v-if="!userData.isLogin">
					<navigator :url="'/pages/auth/login'">登陆</navigator>
					<navigator :url="'/pages/auth/register'">注册</navigator>
				</view>

				<view class="menu-wrap">

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
					<hr>

					<view class="btn-item" @click="logout" v-if="userData.isLogin">
						退出
					</view>
				</view>

			</view>
		</view>
		<view class="page-footer"></view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions,
	} from 'vuex';
	export default {
		components: {},
		data() {
			return {};
		},
		computed: {
			...mapState({
				userData: state => state.user,
			}),
		},
		onLoad() {},
		onShow() {
			console.log('userData:', this.userData)
			console.log('isLogin:', this.userData.isLogin)
		},
		onReady() {},
		methods: {
			...mapMutations('user', ['login', 'logout']),
		},
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