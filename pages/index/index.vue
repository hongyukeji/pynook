<template>
	<view class="page-wrap">
		<view class="page-hedaer">
			<!-- <uni-nav-bar left-text="logo" right-text="language" :title="title" :border="false"></uni-nav-bar> -->
			<view class="page-hedaer-left">
				<!-- <view class="btn-icon btn-scan" @click="scan">
					<uni-icons type="scan" size="24" color="$uni-color-master"></uni-icons>
				</view> -->
			</view>
			<view class="page-hedaer-center">
				<view class="page-hedaer-logo" style="">
					<image class="logo-image" :src="appLogo" :mode="'heightFix'" style="height: 100%;">
					</image>
				</view>
				<span class="page-hedaer-name">{{ appName }}</span>
			</view>
			<view class="page-hedaer-right">
				<view class="btn-icon btn-scan" @click="scan">
					<uni-icons type="scan" size="24" color="$uni-color-master"></uni-icons>
				</view>
				<view class="btn-icon btn-locale" @click="onLocale">
					<uni-icons class="page-hedaer-icon" custom-prefix="iconfont" type="icon-global" size="24"
						color="$uni-color-master"></uni-icons>
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
	import businessMap from '@/components/business/map.vue';
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions,
	} from 'vuex';
	export default {
		components: {
			businessMap,
		},
		data() {
			return {
				appName: getApp().globalData.app.name || '',
				appLogo: getApp().globalData.app.logo || '',
				languageList: [],
			}
		},
		//登录状态
		computed: {
			...mapState({
				appInfo: state => state.app,
			}),
			...mapState({
				userInfo: state => state.user.userInfo,
				isLogin: state => state.user.isLogin,
				// token: state => state.user.token,
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
			/* uni.setNavigationBarTitle({
				title: 'PyNook 派诺客',
			}) */
			this.getAppData();
			// this.getData();
		},
		onShow() {
			// TODO：生产环境注释掉debug方法调用
			this.debug();
		},
		methods: {
			// ...mapMutations(['login', 'logout']),
			...mapMutations('user', ['login', 'logout']),
			...mapActions('app', ['getAppData']),
			...mapActions('common', ['getCommonConfig']),
			debug() {
				const globalData = getApp().globalData;
				console.log('---> globalData :', JSON.stringify(globalData, null, 2));
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
		background-color: $uni-background-color;
	}

	.page-wrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.page-hedaer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;

		color: rgb(51, 51, 51);
		font-size: 22px;
		background-color: #ffffff;
		line-height: 24px;
	}

	.page-hedaer-left {
		display: flex;
		align-items: center;
	}

	.page-hedaer-center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		// line-height: 50px;
		justify-content: normal;
	}

	.page-hedaer-right {
		display: flex;
		align-items: center;
	}

	.page-hedaer-name {
		font-weight: bold;
		font-size: 18px;
		// color: rgb(51, 51, 51);
		color: $uni-color-master;
	}

	.page-hedaer-logo {
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

	.page-hedaer-icon {
		/* font-size: 22px; */
		/* color: rgb(51, 51, 51); */
		color: $uni-color-master;
	}

	.page-body {
		position: relative;
	}

	.page-footer {}
</style>