<template>
	<view class="map-wrap">
		<map v-bind="$attrs" class="map" :id="mapId" :style="{width:mapWidth,height:mapHeight}" :latitude="latitude"
			:longitude="longitude" :markers="markers" :circles="circles" :scale="scale" show-location show-compass
			enable-rotate @markertap="onClickMarkertap" @poitap="onClickMapPoitap" @tap="onClickMapTap"
			@anchorpointtap="onClickMapAnchorpointtap" @updated="onMapUpdated" @regionchange="onMapRegionchange">

			<slot name="map">
				<slot name="map-header">
					<cover-view class="map-header-wrap">
						<view class="map-header"></view>
					</cover-view>
				</slot>

				<slot name="map-center">
					<cover-view class="map-center-wrap"></cover-view>
				</slot>
				<slot name="map-control">
					<cover-view class="map-control-wrap">
						<view class="map-control">
							<slot name="map-control-extend">
							</slot>
							<view class="map-control-btn circle" @click="onClickCenterLocation()" v-if="isDebug">
								<uni-icons class="map-control-icon" type="map" color="var(--app-color-slave)"
									size="30"></uni-icons>
							</view>
							<view class="map-control-btn circle" @click="onClickLocation()">
								<uni-icons class="map-control-icon" type="location" color="var(--app-color-slave)"
									size="30"></uni-icons>
							</view>
						</view>
					</cover-view>
				</slot>
			</slot>
		</map>
	</view>
</template>

<script>
	/* 地图文档 https://zh.uniapp.dcloud.io/component/map.html */
	const defaultLocation = {
		latitude: 38.888808,
		longitude: -77.050179,
	};
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions,
	} from 'vuex';
	export default {
		name: "map-plus",
		data() {
			return {
				mapId: 'map', // 使用 marker点击事件 需要填写id
				mapWidth: "100%", // 100vw
				// mapHeight: "100%", // 100vh
				mapHeight: "calc(100% + 24px)",
				// latitude: 39.909,
				// longitude: 116.39742,
				// 38.888808, -77.050179
				latitude: defaultLocation.latitude, // 纬度
				longitude: defaultLocation.longitude, // 经度
				scale: 16,
				markerId: 0,
				// 标记点
				markers: [
					/* {
						id: 1,
						width: 32,
						height: 32,
						latitude: defaultLocation.latitude + 0.0028,
						longitude: defaultLocation.longitude + 0.0048,
						iconPath: '/static/images/icon/map/store.png',
						// 自定义气泡
						callout: {
							"content": "自定义table",
							"borderRadius": 5,
							"padding": 10,
							"bgColor": "#E3E3E3",
							"borderColor": "#fff",
							"borderWidth": 2,
							"anchorX": 12,
							"anchorY": 1,
							"display": 'ALWAYS'
						},
						joinCluster: true // 坐标聚合
					}, */
				],
				// 圆
				circles: [
					/* {
						latitude: 39.909,
						longitude: 116.39742,
						color: '#00AE8F11',
						fillColor: '#00AE8F30',
						radius: 200
					}, {
						latitude: 39.909,
						longitude: 116.39742,
						color: '#FFFFFF',
						fillColor: '#FFFFFF',
						radius: 48
					}, {
						latitude: 39.909,
						longitude: 116.39742,
						color: '#00AE8F',
						fillColor: '#00AE8F',
						radius: 24
					}, */
				],
			};
		},
		methods: {
			// 在地图渲染更新完成时触发
			onMapUpdated(e) {
				console.log('---> onMapUpdated :', e);
			},
			// 点击定位标时触发，e.detail = {longitude, latitude}
			onClickMapAnchorpointtap(e) {
				console.log('---> onClickMapAnchorpointtap :', e);
			},
			// 点击地图时触发; App-nvue、微信小程序2.9支持返回经纬度
			onClickMapTap(e) {
				console.log('---> onClickMapTap :', e);
			},
			// 点击标记点时触发，e.detail = {markerId}
			onClickMarkertap(e) {
				console.log('---> onClickMarkertap :', e);
			},
			// 点击地图poi点时触发，e.detail = {name, longitude, latitude}
			onClickMapPoitap(e) {
				console.log('---> onClickMapPoitap :', e);
			},
			// 视野发生变化时触发
			onMapRegionchange(e) {
				console.log('---> onMapRegionchange :', e);
			},
			initMarkerCluster() {
				const map = uni.createMapContext(this.mapId, this);
				// 仅调用初始化，才会触发 on.("markerClusterCreate", (e) => {})
				map.initMarkerCluster({
					enableDefaultStyle: false,
					zoomOnClick: true,
					gridSize: 60,
					complete(res) {
						console.log('initMarkerCluster', res)
					}
				});
				map.on("markerClusterCreate", (e) => {
					console.log("markerClusterCreate", e);
				});
			},
			removeMarkers(markerIds) {
				if (!markerIds) {
					markerIds = [];
					// this.markers.map(item => {
					// 	markerIds.push(item.id);
					// });
					markerIds = this.markers.map(item => item.id)
				}
				const map = uni.createMapContext(this.mapId, this);
				map.removeMarkers({
					markerIds: markerIds,
					clear: clear,
					complete(res) {
						console.log('removeMarkers', res)
					}
				})
			},
			addMarkers(markers, clear = true) {
				// console.log('---> addMarkers :', markers);
				if (!markers) {
					markers = this.markers;
				}
				// this.markers = markers;
				const map = uni.createMapContext(this.mapId, this);
				map.addMarkers({
					markers,
					clear: clear,
					complete(res) {
						console.log('addMarkers', res)
					}
				})
			},
			async getLocation() {
				await this.$utils.map.getLocation().then(res => {
					this.longitude = res.longitude;
					this.latitude = res.latitude;
				}).catch(err => {}).finally(() => {});
			},
			async getCenterLocation() {
				await this.$utils.map.getCenterLocation(this.mapId, this).then(res => {
					this.longitude = res.longitude;
					this.latitude = res.latitude;
				}).catch(err => {}).finally(() => {});
			},
			async moveToLocation(location = {}) {
				await this.$utils.map.moveToLocation(location, this.mapId, this).then(res => {})
					.catch(err => {})
					.finally(() => {});
			},
			async chooseLocation(location = {}, keyword) {
				await this.$utils.map.chooseLocation(location, keyword).then(res => {})
					.catch(err => {})
					.finally(() => {});
			},
			async onClickLocation() {
				uni.showLoading();
				await this.getLocation();
				await this.moveToLocation();
				uni.hideLoading();
				this.$emit('clicklocation', {});
			},
			async onClickCenterLocation() {
				const map = uni.createMapContext(this.mapId, this);
				const iconPath = 'https://pynook.com/static/images/common/logo.png';
				await this.getCenterLocation();
				uni.showToast({
					title: `【地图中心位置】经度：${this.longitude}，纬度：${this.latitude}`,
					icon: 'none',
					duration: 3000,
				})
				this.circles = [{
					latitude: this.latitude,
					longitude: this.longitude,
					color: '#00AE8F11',
					fillColor: '#00AE8F30',
					radius: 200
				}, {
					latitude: this.latitude,
					longitude: this.longitude,
					color: '#FFFFFF',
					fillColor: '#FFFFFF',
					radius: 24
				}, {
					latitude: this.latitude,
					longitude: this.longitude,
					color: '#00AE8F',
					fillColor: '#00AE8F',
					radius: 12
				}, ]
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './map-plus.scss';
</style>