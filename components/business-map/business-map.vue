<template>
	<map :id="mapId" :ref="mapId" class="map-wrap" :longitude="longitude" :latitude="latitude" show-location
		enable-rotate :scale="15" :markers="mapMarkers" :circles="mapCircles" :polyline="mapPolyline"
		:style="{width:mapWidth,height:mapHeight}">
		<cover-view class="map-header">
			<view class="map-header-search">
				<!-- 搜索框 -->
				<uni-search-bar class="map-header-search-bar" clearButton="auto" cancelButton="none" bgColor="#FFFFFF"
					textColor="var(--app-color-slave)" :placeholder="$t('business.placeholder.search-business')"
					@confirm="search" v-model="searchValue" @blur="blur" @focus="focus" @input="input" @cancel="cancel"
					@clear="clear">
				</uni-search-bar>
			</view>
		</cover-view>
		<cover-view class="map-toolbar">
			<view class="map-toolbar-group">
				<view class="map-toolbar-button-item">
					<uni-icons type="location" size="30" color="rgb(51, 51, 51)"></uni-icons>
				</view>
				<view class="map-toolbar-button-item">
					<view class="" style="font-size: 26px;font-weight: normal;color: rgb(51, 51, 51);">+
					</view>
				</view>
				<view class="map-toolbar-button-item">
					<view class="" style="font-size: 26px;font-weight: normal;color: rgb(51, 51, 51);">-
					</view>
				</view>
			</view>
		</cover-view>
		<cover-view class="map-footer">
			<!-- 地图底部按钮 -->
			<view class="map-footer-group" style="">
				<view v-if="!isMerchant" class="map-footer-button-item" style="flex: 1;margin-right: 15px;"
					@click="onAddMyBusiness()">
					<uni-icons class="map-footer-button-item-icon" type="plus" color="var(--app-color-slave)"
						size="32"></uni-icons><span>{{$t('business.button.add-my-business')}}</span>
				</view>
				<view v-if="isMerchant" class="map-footer-button-item" style="flex: 1;margin-right: 15px;"
					@click="onToMyBusiness()">
					<uni-icons class="map-footer-button-item-icon" type="gear" color="var(--app-color-slave)"
						size="32"></uni-icons><span>{{$t('business.button.manage-my-business')}}</span>
				</view>
				<view class="map-footer-button-item border-radius-circle" @click="moveToCurrentLocation()">
					<uni-icons class="map-footer-button-item-icon" type="location" color="var(--app-color-slave)"
						size="32"></uni-icons>
				</view>
			</view>
		</cover-view>
	</map>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions,
	} from 'vuex';
	export default {
		name: "business-map",
		data() {
			return {
				mapId: 'map',
				latitude: 39.907375, // 设置初始纬度
				longitude: 116.391349, // 设置初始经度
				// mapWidth: "100vw",
				// mapHeight: "100vh",
				mapWidth: "100%",
				// mapHeight: "100%",
				mapHeight: "calc(100% + 25px)",
				mapMarkers: [
					/*{
						id: 'map',
						latitude: 39.907375,
						longitude: 116.391349,
						iconPath: "/static/images/layout/img_rider_3x.png",
						width: 48,
						height: 48,
					},*/
				], // 标记点
				mapCircles: [], // 圆
				mapPolyline: [], // 路线
				distance: 0, // 距离
				searchValue: '',
				// isMerchant: false,
			};
		},
		computed: {
			...mapState({
				isLogin: state => state.user.isLogin,
				isMerchant: state => state.user.isMerchant,
			}),
		},
		created() {
			this.loadData();
			this.getCurrentLocation();
		},
		methods: {
			...mapActions('user', ['syncUserBusinessInfo']),
			loadData() {
				// console.log('---> isLogin :', this.$store.state.user.isLogin);
				// const isLogin = this.$store.state.user.isLogin;
				if (this.isLogin) {
					// 同步用户业务信息
					this.syncUserBusinessInfo();
				}
			},
			getCurrentLocation() {
				// 文档: https://uniapp.dcloud.net.cn/api/location/location.html
				let that = this;
				/*
				// 小程序获取位置需要授权
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.getLocation();
					}
				});
				*/
				// 获取经纬度
				uni.getLocation({
					// 谷歌地图使用 wgs84 坐标，其他地图使用 gcj02 坐标，用错坐标类型会显示偏移。
					// type: 'gcj02', // 国家测绘局坐标
					type: 'wgs84', // 谷歌地图
					altitude: true, // 高精度定位
					// 定位成功，更新定位结果
					success: function(res) {
						// console.log(res);
						const longitude = res.longitude;
						const latitude = res.latitude;
						console.log("当前位置的经度：", longitude);
						console.log("当前位置的纬度：", latitude);
						that.longitude = longitude
						that.latitude = latitude
						// that.covers[0].latitude = latitude;
						// that.covers[0].longitude = longitude;
					}
				});
			},
			moveToCurrentLocation() {
				let mapObjs = uni.createMapContext(this.mapId, this)
				mapObjs.moveToLocation({
					complete: res => {
						// console.log('移动完成:', res);
					}
				})
			},
			moveTolocation(longitude, latitude) {
				let mapObjs = uni.createMapContext(this.mapId, this)
				mapObjs.moveToLocation({
					longitude: longitude,
					latitude: latitude,
				}, {
					complete: res => {
						console.log('移动完成:', res)
					}
				})
				// this.onRegionChange('',true)
			},
			calcMapWidthHeight() {
				const sys = uni.getSystemInfoSync()
				console.log(sys);
				const width = sys.windowWidth;
				// const height = sys.windowHeight - uni.upx2px(50)
				const height = sys.windowHeight - sys.windowBottom - sys.windowTop;
				// const height = sys.windowHeight - 50 - 45;
				this.mapWidth = width + 'px';
				this.mapHeight = height + 'px';
			},
			chooseLocation() {
				uni.chooseLocation({
					success: function(res) {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					}
				});
			},
			openLocation(latitude, longitude) {
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					success: function() {
						console.log('success');
					}
				});
			},
			/*search(e) {
				//输入框值
				console.log(e.detail.value)
				//搜索逻辑自行处理
				const key = e.detail.value;
				uni.showToast({
					title: '搜索：' + key,
					icon: 'none'
				})
			},*/
			search(res) {
				const keyword = res.value;
				uni.showToast({
					title: '搜索：' + res.value,
					icon: 'none'
				})
			},
			input(res) {
				// 编辑框内容发生改变
				console.log('----input:', res);
			},
			clear(res) {
				console.log('----clear:', res);
				// 清除选择列表
				// uni.showToast({
				// 	title: 'clear事件，清除值为：' + res.value,
				// 	icon: 'none'
				// })
			},
			blur(res) {
				console.log('----blur:', res);
				// 打开选择列表
				// uni.showToast({
				// 	title: 'blur事件，输入值为：' + res.value,
				// 	icon: 'none'
				// })
			},
			focus(e) {
				console.log('----focus:', e);
				// todo: 关闭选择列表
				// uni.showToast({
				// 	title: 'focus事件，输出值为：' + e.value,
				// 	icon: 'none'
				// })
			},
			cancel(res) {
				console.log('----cancel:', res);
				// uni.showToast({
				// 	title: '点击取消，输入值为：' + res.value,
				// 	icon: 'none'
				// })
			},
			switchMapProvider(provider = 'google') {
				// amap 高德地图
				// baidu 百度地图
				// google 谷歌地图
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
		}
	}
</script>

<style lang="scss" scoped>
	.map-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		//width: 100vw;
		//height: 100vh;
	}

	.map-header {}

	.map-header-search {
		margin: 30px;
		margin-bottom: 0;
	}

	.map-header-search-bar {
		border: 1px solid var(--app-color-master);
		padding: 0;
		border-radius: 5px;
		color: var(--app-color-master) !important;
	}

	.map-header-search-bar ::v-deep .uni-icons.uniui-search {
		color: var(--app-color-master) !important;
	}

	.map-header-search-bar ::v-deep .uni-input-input {
		color: var(--app-color-master) !important;
	}

	.map-header-search-bar ::v-deep .uni-input-placeholder {
		color: var(--app-color-master) !important;
	}

	.map-header-search-bar ::v-deep .uni-searchbar__text-placeholder {
		color: var(--app-color-master) !important;
	}

	.map-toolbar {
		display: none;
	}

	.map-toolbar-group {
		position: absolute;
		bottom: 5%;
		right: 5%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.map-toolbar-button-item {}

	.map-footer {}

	.map-footer-group {
		width: 100%;
		padding: 15px;
		padding-top: 0;
		padding-bottom: 25px;
		box-sizing: border-box;
		position: absolute;
		bottom: 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.map-footer-button-item {
		line-height: 45px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		background-color: var(--app-color-master);
		border-radius: 5px;
	}

	.map-footer-button-item-icon {
		color: var(--app-color-slave);
		font-size: 32px;
		width: 45px;
		height: 45px;
	}

	.border-radius-normal {}

	.border-radius-circle {
		border-radius: 50%;
	}
</style>