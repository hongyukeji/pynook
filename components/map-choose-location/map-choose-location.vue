<template>
	<view class="map-choose-location">
		<slot name="button">
			<button type="primary" @click="open()">{{$t('common.form.select')+$t('business.form.location')}}</button>
		</slot>

		<!-- 普通弹窗 -->
		<uni-popup ref="popup" @change="change">
			<view class="popup-content">
				<map-plus ref="map" @regionchange="onMapRegionchange" @clicklocation="onMapRegionchange">
					<template v-slot:map-control-extend>
						<view class="map-control-btn block" @click="onClickChooseLocation()">
							<uni-icons class="map-control-icon" type="map-pin-ellipse" color="var(--app-color-slave)"
								size="30"></uni-icons>
							<view class="map-control-text">{{$t('common.form.select')+$t('business.form.location')}}
							</view>
						</view>
					</template>
				</map-plus>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "map-choose-location",
		props: {
			longitude: [Number],
			latitude: [Number],
		},
		data() {
			return {
				type: 'center',
				show: false,
				mapId: 'map',
			};
		},
		methods: {
			syncValue() {
				// TODO 兼容 vue2
				// this.$emit('input', value);
				this.$emit('input:latitude', this.$refs.map.latitude);
				this.$emit('input:longitude', this.$refs.map.longitude);
				// TODO　兼容　vue3
				// this.$emit('update:modelValue', value);
				this.$emit('update:latitude', this.$refs.map.latitude);
				this.$emit('update:longitude', this.$refs.map.longitude);
			},
			change(e) {
				// console.log('当前模式：' + e.type + ',状态：' + e.show);
				this.show = e.show;
			},
			open() {
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(this.type);
				this.$nextTick(() => {
					this.$refs.map.latitude = this.toNumber(this.latitude);
					this.$refs.map.longitude = this.toNumber(this.longitude);
					this.setCenterLocation();
				});
			},
			close() {
				this.$refs.popup.close()
			},
			// 视野发生变化时触发
			async onMapRegionchange(e) {
				console.log('---> onMapRegionchange 11 :', e);
				this.setCenterLocation();
			},
			async setCenterLocation() {
				await this.$refs.map.getCenterLocation();
				this.$refs.map.markers = [{
					id: 0,
					width: 32,
					height: 32,
					latitude: this.$refs.map.latitude,
					longitude: this.$refs.map.longitude,
					iconPath: '/static/images/icon/map/store.png',
				}];
			},
			async onClickChooseLocation() {
				console.log('---> onClickChooseLocation :', this);
				// this.$refs.popup.open(this.type)
				await this.$refs.map.getCenterLocation();
				// this.longitude = this.$refs.map.longitude;
				// this.latitude = this.$refs.map.latitude;
				// this.syncValue();
				const latitude = this.$refs.map.latitude;
				const longitude = this.$refs.map.longitude;
				this.syncValue();
				this.close();
				return;
				uni.showToast({
					title: `【地图中心位置】经度：${longitude}，纬度：${latitude}`,
					icon: 'none',
					duration: 3000,
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/components/map-plus/map-plus.scss';

	.popup-content {
		display: flex;
		align-items: center;
		justify-content: center;
		// padding: $uni-spacing-row-lg;
		margin: $uni-spacing-row-lg;
		width: 100vw;
		height: 50vh;
		background-color: #fff;
		border-radius: $uni-border-radius-lg;
		box-sizing: border-box;
		position: relative;
		z-index: 999999;
	}
</style>