<template>
	<view class="map">
		<map id="map" :longitude="center.lng" :latitude="center.lat" :scale="scale" show-location :markers="markers"
			style="width: 100vw; height: 100vh" @callouttap="onMarkerTap" @tap="currentStation = {}">
			<!-- 气泡 -->
			<cover-view slot="callout">
				<block v-for="(item,index) in stationList" :key="index">
					<cover-view class="customCallout" :marker-id="index">
						<cover-view class="content">
							<cover-view class="left cm">闲 {{ item.freeGunNum }}</cover-view>
							<cover-view
								class="right fsm">￥{{ toFixed(item.servicePrice+ item.chargePrice,2) }}</cover-view>
						</cover-view>
					</cover-view>
				</block>
			</cover-view>
		</map>
	</view>
</template>
<script>
	export default {
		name: 'MapBox',
		props: {
			positon: {
				type: Object,
				default: {
					lng: 114.43,
					lat: 30.50,
				}
			},
			stationList: {
				type: Array,
				default: []
			},
			currentMode: {
				type: String
			}
		},
		data() {
			return {
				markers: [],
				customCalloutMarkerIds: [],
				center: {
					lng: '',
					lat: ''
				},
				mpCtx: null,
				scale: 12,
				currentStation: {}
			}
		},
		mounted() {
			uni.hideTabBar(); // 隐藏tab 
			// uni.showTabBar(); //显示tab
			// uniapp不使用自定义tabbar的情况下隐藏指定的tabbar
			/* uni.setTabBarItem({
				index: 1, // 从左到右 0开始
				visible: false // 默认true false隐藏
			}) */
			// 获取附近点位
			this.$nextTick(() => {
				// 获取地图实例
				this.mpCtx = uni.createMapContext('map', this)
				if (this.positon.lng) {
					this.center = this.positon
				} else {
					this.center.lng = 114.43
					this.center.lat = 30.50
				}
				this.addMarkers()
			})
		},
		methods: {
			changeMode() {
				this.$emit('changeMode')
			},
			// 气泡点击事件
			onMarkerTap(e) {
				this.currentStation = this.stationList[e.markerId]
				//移动中心点位
				this.mpCtx.moveToLocation({
					longitude: this.stationList[e.markerId].lng,
					latitude: this.stationList[e.markerId].lat,
					success: (s) => {
						console.log(s)
					}
				})
			},
			// 添加点位
			addMarkers() {
				let obj = {}
				this.stationList.map((item, index) => {
					obj = {
						id: index, // 标记点 id
						longitude: item.lng,
						latitude: item.lat,
						width: 20,
						height: 20,
						iconPath: '../../../static/image/triangle.png',
						customCallout: {
							anchorY: 4,
							anchorX: 0,
							display: 'ALWAYS'
						}
					}
					this.markers.push(obj)
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.customCallout {
		.content {
			background-color: #fff;
			width: 80px;
			height: 36px;
			padding: 5px;
			display: flex;
			align-items: center;
			border-radius: 5px;

			.left {
				width: 36px;
				height: 36px;
				border-radius: 50%;
				background-color: rgba(#ed773a, 0.1);
				font-size: 10px;
				text-align: center;
				line-height: 36px;
				flex-shrink: 1;
			}

			.right {
				flex-grow: 1; // 必须要,否则模拟器显示正常,真机会有部分缺失
			}
		}
	}
</style>