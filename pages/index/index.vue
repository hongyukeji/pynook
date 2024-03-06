<template>
	<view class="page-wrap">
		<view class="page-header">
			<!-- <uni-nav-bar left-text="logo" right-text="language" :title="title" :border="false"></uni-nav-bar> -->
			<view class="page-header-left">
				<!-- <view class="btn-icon btn-scan" @click="scan">
					<uni-icons type="scan" size="24" color="var(--app-color-master)"></uni-icons>
				</view> -->
			</view>
			<view class="page-header-center">
				<view class="page-header-logo" style="">
					<image class="logo-image" :src="globalConfig.app.logo" :mode="'heightFix'" style="height: 100%;">
					</image>
				</view>
				<span class="page-header-name">{{ globalConfig.app.name }}</span>
			</view>
			<view class="page-header-right">
				<view class="btn-icon btn-scan" @click="scan">
					<uni-icons type="scan" size="24" color="var(--app-color-master)"></uni-icons>
				</view>
				<view class="btn-icon btn-locale" @click="onLocale">
					<uni-icons class="page-header-icon" custom-prefix="iconfont" type="icon-global" size="24"
						color="var(--app-color-master)"></uni-icons>
				</view>
			</view>
		</view>
		<view class="page-body" style="flex: 1;">
			<business-map></business-map>
		</view>
		<view class="page-footer">
		</view>
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
			return {
				languageList: [],
			}
		},
		//登录状态
		computed: {
			...mapState({
				appInfo: state => state.app,
			}),
			...mapState({
				// token: state => state.user.token,
				userInfo: state => state.user.userInfo,
				isLogin: state => state.user.isLogin,
				isMerchant: state => state.user.isMerchant,
			}),
			...mapGetters('common', ['commonData']), // 将 common 模块的数据映射到 computed 中
			// ...mapState({
			// 	commonConfig: state => state.common.config,
			// }),
			// ...mapState(['isLogin']),
			// ...mapState({appName: state => state.app.name,}),
			// ...mapGetters('app', ['appInfo']),
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.globalConfig.app.name,
			})
			this.getAppData();
			// this.getData();
		},
		onShow() {
			if (process.env.NODE_ENV !== 'production') {
				// TODO：生产环境注释掉debug方法调用
				this.debug();
			}
		},
		methods: {
			// ...mapMutations(['login', 'logout']),
			...mapMutations('user', ['login', 'logout']),
			...mapActions('app', ['getAppData']),
			...mapActions('common', ['getCommonConfig']),
			...mapActions('user', ['syncUserBusinessInfo']),
			debug() {
				const globalData = getApp().globalData;
				console.log('---> globalData :', JSON.stringify(globalData, null, 2));
				console.log('---> isLogin :', this.isLogin);
				console.log('---> isMerchant :', this.isMerchant);
			},
			getData() {
				let that = this;
				// console.log('---> isLogin :', that.$store.state.user.isLogin);
				this.$api.app.getAppData().then((res) => {
					console.log('---> res :', res);
					if (res.data.code == 200) {
						let title = res.data.data.name;
						// console.log('---> title :', title);
						that.title = title;
						uni.setNavigationBarTitle({
							title: title,
						})
					}
				})
			},
			scan() {
				uni.showToast({
					title: this.$t('common.developing'),
					icon: 'none'
				})
			},
			search(e) {
				//输入框值
				console.log(e.detail.value)
				//搜索逻辑自行处理
				const key = e.detail.value;
				uni.showToast({
					title: '搜索：' + key,
					icon: 'none'
				})
			},
			onLocale() {
				uni.navigateTo({
					url: '/pages/locale/locale'
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		min-height: 100%;
		font-weight: normal;
		background-color: var(--app-bg-color, #F1F7FF);
		box-sizing: border-box;
	}

	.page-wrap {
		width: 100%;
		height: 100%;
		min-height: 100%;
		background-color: var(--app-bg-color);
		display: flex;
		flex-direction: column;
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;

		color: rgb(51, 51, 51);
		font-size: 22px;
		background-color: #ffffff;
		line-height: 24px;
	}

	.page-header-left {
		display: flex;
		align-items: center;
	}

	.page-header-center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		// line-height: 50px;
		justify-content: normal;
	}

	.page-header-right {
		display: flex;
		align-items: center;
	}

	.page-header-name {
		font-weight: bold;
		font-size: 18px;
		// color: rgb(51, 51, 51);
		color: var(--app-color-master);
	}

	.page-header-logo {
		width: auto;
		height: 40px;
		max-width: 120px;
		box-sizing: border-box;
		margin: 5px 5px;
		margin-left: 15px;
	}

	.btn-icon {
		padding: 10px 15px;
	}

	.page-header-icon {
		/* font-size: 22px; */
		/* color: rgb(51, 51, 51); */
		color: var(--app-color-master);
	}

	.page-body {
		position: relative;
	}

	.page-footer {}
</style>