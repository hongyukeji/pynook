<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<map-plus ref="map" @markertap="onClickMarkertap">
				<template v-slot:map-header>
					<cover-view class="map-header-wrap">
						<view class="map-header">
							<view class="page-header">
								<view class="page-header-left"></view>
								<view class="page-header-center">
									<view class="page-header-logo" style="">
										<image class="logo-image" :src="globalConfig?.app?.logo" :mode="'heightFix'"
											style="height: 100%;">
										</image>
									</view>
									<span class="page-header-name">{{ globalConfig?.app?.name }}</span>
								</view>
								<view class="page-header-right">
									<view class="btn-icon btn-scan" @click="onClickScan">
										<uni-icons type="scan" size="24" color="var(--app-color-master)"></uni-icons>
									</view>
									<view class="btn-icon btn-locale" @click="onClickLocale">
										<uni-icons class="page-header-icon" custom-prefix="iconfont" type="icon-global"
											size="24" color="var(--app-color-master)"></uni-icons>
									</view>
								</view>
							</view>
							<view class="map-header-search-wrap">
								<!-- 搜索框 -->
								<uni-search-bar class="map-header-search" clearButton="auto" cancelButton="none"
									bgColor="#FFFFFF" textColor="var(--app-color-slave)"
									:placeholder="$t('business.placeholder.search-business')" @confirm="onClickSearch"
									v-model="searchValue" @blur="searchBlur" @focus="searchFocus" @input="searchInput"
									@cancel="searchCancel" @clear="searchClear">
								</uni-search-bar>
							</view>
						</view>
					</cover-view>
				</template>
				<template v-slot:map-control-extend>
					<view class="map-control-btn block" @click="onToMyBusiness()" v-if="isLogin && isMerchant">
						<uni-icons class="map-control-icon" type="gear" color="var(--app-color-slave)"
							size="30"></uni-icons>
						<view class="map-control-text">{{$t('business.button.manage-my-business')}}</view>
					</view>
					<view class="map-control-btn block" @click="onAddMyBusiness()" v-else>
						<uni-icons class="map-control-icon" type="plus" color="var(--app-color-slave)"
							size="30"></uni-icons>
						<view class="map-control-text">{{$t('business.button.add-my-business')}}</view>
					</view>
				</template>
			</map-plus>
			<!-- 压屏窗 -->
			<view class="landscape-wrap">
				<fui-landscape :show="isShowLandscape" :closable="true" :position="3" @close="closeLandscape">
					<view class="fui-ani__box">
						<image class="fui-hd__img" src="/static/images/member/light/img_layer_3x.png" mode="widthFix">
						</image>
						<view class="fui-flex__center fui-flex__column">
							<view class="fui-ani__title">{{notice?.title}}</view>
							<view class="fui-desc" v-html="notice?.content"></view>
							<fui-button btn-size="medium" radius="100rpx"
								background="linear-gradient(180deg, #E3BF82 0%, #997B4A 100%)" borderColor="rgba(0,0,0,0)"
								border-width="0" @click="onClickLandscape">{{$t('welcome.button-text')}}</fui-button>
						</view>
					</view>
				</fui-landscape>
			</view>
		</view>
		<view class="page-footer"></view>
	</view>
</template>

<script>
	/* 地图文档 https://zh.uniapp.dcloud.io/component/map.html */
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
				distance: 1, // 距离
				searchValue: '',
				params: {
					current: 0, // 初始页码
					size: 10, // 每页条数
					keyword: "", // 关键字
				},
				items: [], // 列表数据数组
				loading: 0, // 加载状态: 0-加载前more，1-加载中loading，2-没有更多数据noMore
				isShowLandscape: false, // 是否显示压屏窗
				notice: {
					title: this.$t('welcome.title'),
					content: this.$t('welcome.content', {param: this.globalConfig?.app?.name}),
				},
			};
		},
		computed: {
			...mapState({
				isLogin: state => state.user.isLogin,
				isMerchant: state => state.user.isMerchant,
			}),
		},
		watch: {
			items: {
				handler(newVal, oldVal) {
					// console.log("---> items watch newVal: ", newVal);
					// console.log("---> items watch oldVal: ", oldVal);
					if (!newVal) {
						return;
					}

					let markers = [];
					newVal.forEach((v, i) => {
						// let latitude = v.latitude || (this.$refs.map.latitude + i / 1000);
						// let longitude = v.longitude || (this.$refs.map.longitude + i / 1000);
						let latitude = v.latitude;
						let longitude = v.longitude;
						let marker = {
							...v,
							joinCluster: true, // 指定了该参数才会参与聚合
							id: v.id,
							width: 32,
							height: 32,
							latitude: this.toNumber(latitude),
							longitude: this.toNumber(longitude),
							// iconPath: '/static/images/icon/map/store.png',
							// iconPath: v.image,
							iconPath: v.image || '/static/images/icon/map/store.png',
							title: v.name,
						}
						// console.log('---> marker :', marker);
						markers.push(marker);
					});

					// console.log('---> markers :', markers);
					// console.log('---> this.latitude :', this.latitude);
					// console.log('---> this.longitude :', this.longitude);

					// this.markers = markers;
					this.addMarkers(markers);

					if (markers && markers.length > 0) {
						// this.initMarkerCluster();
						// this.addMarkers(markers, true);
						// 自动移动到第一个标记点
						/* if (this.markers[0]) {
							this.moveToLocation({
								latitude: this.markers[0].latitude,
								longitude: this.markers[0].longitude,
							});
						} */
					}

				},
				immediate: true, // 初始化绑定时就会执行handler方法
				deep: true, // 对象中任一属性值发生变化，都会触发handler方法
			},
		},
		onLoad(options) {
			if (options.latitude) {
				this.latitude = options.latitude;
			}
			if (options.longitude) {
				this.longitude = options.longitude;
			}
			if (options.longitude && options.latitude) {
				// 自动移动到该位置
				this.moveToLocation({
					latitude: options.latitude,
					longitude: options.longitude,
				});
			}
		},
		onShow() {
			this.$nextTick(() => {
				// 地图点击定位
				// this.$refs.map.onClickLocation();
				// 获取数据
				this.getData();
			});
		},
		onReady() {},
		mounted() {
			// uni.hideTabBar(); // 隐藏tab 
			// uni.showTabBar(); //显示tab
			// this.initData();

			// 组件加载完成后执行
			this.$nextTick(() => {
				// 显示压屏窗
				this.showLandscape();
				// 地图点击定位
				this.$refs.map.onClickLocation();
			});
		},
		methods: {
			async initData() {
				await this.$nextTick(async () => {
					await this.getData();
					// await this.onClickLocation();
					// await this.getLocation();
				});
			},
			// 点击标记点时触发，e.detail = {markerId}
			onClickMarkertap(e) {
				console.log('---> onClickMarkertap :', e);
				const markerId = e.detail.markerId;
				const url = "/pages/merchant/detail?id=" + markerId;
				this.redirect(url);
			},
			onAddMyBusiness() {
				uni.navigateTo({
					url: '/pages/business/profile'
				});
			},
			onToMyBusiness() {
				uni.navigateTo({
					url: '/pages/business/dashbord'
				});
			},
			onClickScan() {
				uni.showToast({
					title: this.$t('common.developing'),
					icon: 'none'
				})
			},
			onClickLocale() {
				uni.navigateTo({
					url: '/pages/locale/locale'
				});
			},
			searchInput(res) {
				// 编辑框内容发生改变
				// console.log('----input:', res);
			},
			searchClear(res) {
				// console.log('----clear:', res);
				// 清除选择列表
				// uni.showToast({
				// 	title: 'clear事件，清除值为：' + res.value,
				// 	icon: 'none'
				// })
				this.searchValue = '';
				this.getData();
			},
			searchBlur(res) {
				// console.log('----blur:', res);
				// 打开选择列表
				// uni.showToast({
				// 	title: 'blur事件，输入值为：' + res.value,
				// 	icon: 'none'
				// })
			},
			searchFocus(e) {
				// console.log('----focus:', e);
				// todo: 关闭选择列表
				// uni.showToast({
				// 	title: 'focus事件，输出值为：' + e.value,
				// 	icon: 'none'
				// })
			},
			searchCancel(res) {
				// console.log('----cancel:', res);
				// uni.showToast({
				// 	title: '点击取消，输入值为：' + res.value,
				// 	icon: 'none'
				// })
			},
			onClickSearch(e) {
				console.log('---> onClickSearch :', e);
				//搜索逻辑自行处理
				const keyword = e.value;
				// uni.showToast({
				// 	title: this.$t('common.search') + keyword,
				// 	icon: 'none'
				// })
				this.getData();
			},
			async getCenterLocation() {
				// this.$refs.map.getCenterLocation();
				this.$refs.map.getCurrentLocation();
				// this.$refs.map.onClickLocation();
				// this.params.latitude = this.$refs.map.latitude;
				// this.params.longitude = this.$refs.map.longitude;
				this.params.distance = this.distance;
			},
			addMarkers(markers, clear = true) {
				this.$nextTick(() => {
					this.$refs.map.markers = markers;
					// this.$refs.map.addMarkers(markers);
				});
			},
			async getData() {
				await this.getCenterLocation();
				// this.params.latitude = this.latitude;
				// this.params.longitude = this.longitude;
				this.params.keyword = this.searchValue;
				this.params.size = 1000;
				// 默认参数
				this.params.current = 0;
				this.items = [];
				if (this.loading == 2) {
					this.loading = 0;
				}
				await this.loadData();
			},
			async loadData() {
				const that = this;
				if (this.loading >= 1) {
					return;
				}
				this.params.current++;
				this.loading = 1;
				// 发送请求获取数据
				await this.$api.merchant.getMerchantList(this.params).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					// console.log('---> data :', data);
					// 判断是否是最后一页
					if (data.current >= data.pages) {
						that.loading = 2;
					}
					let items = data.records;
					// 将数据追加到 items 数组中
					that.items = that.items.concat(items);
				});
				if (this.loading == 1) {
					this.loading = 0;
				}
			},
			showLandscape() {
				this.$nextTick(() => {
					this.isShowLandscape = true;
				});
			},
			closeLandscape() {
				this.$nextTick(() => {
					this.isShowLandscape = false;
				});
			},
			onClickLandscape() {
				this.closeLandscape();
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}

	.page-wrap {
		width: 100%;
		height: 100%;
	}

	.page-header {}

	.page-body {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	.page-footer {}

	@import '@/components/map-plus/map-plus.scss';

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		color: var(--app-color-master);
		font-size: 22px;
		background-color: #ffffff;
		line-height: 24px;

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
	}

	.map-header-search-wrap {
		margin: $uni-spacing-col-lg;
		padding: $uni-spacing-col-lg;
		margin-bottom: 0;

		.map-header-search {
			border: 1px solid var(--app-color-master);
			padding: 0;
			border-radius: 5px;
			color: var(--app-color-master) !important;

			::v-deep .uni-icons.uniui-search {
				color: var(--app-color-master) !important;
			}

			::v-deep .uni-input-input {
				color: var(--app-color-master) !important;
			}

			::v-deep .uni-input-placeholder {
				color: var(--app-color-master) !important;
			}

			::v-deep .uni-searchbar__text-placeholder {
				color: var(--app-color-master) !important;
			}
		}

	}

	.landscape-wrap {
		.fui-ani__box {
			width: 640rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			padding-bottom: 64rpx;
		}

		.fui-hd__img {
			width: 100%;
			height: 192rpx;
			display: block;
		}

		.fui-ani__title {
			font-size: 36rpx;
			font-weight: 600;
			padding: 54rpx 0 32rpx;
			text-align: center;
		}

		.fui-desc {
			padding: 0 54rpx 82rpx;
			font-size: 24rpx;
			line-height: 48rpx;
			font-weight: 400;
			color: #333333;
			box-sizing: border-box;
		}

		.fui-desc text {
			color: #FF2B2B;
		}
	}
</style>