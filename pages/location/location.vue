<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container">
				<view class="step">
					<view class="step-title">
						{{$t('common.vpn.step.one.title')}}
					</view>
					<view class="step-content"></view>
				</view>
				<fui-white-space height="30"></fui-white-space>
				<view class="step">
					<view class="step-title">
						{{$t('common.vpn.step.two.title')}}
					</view>
					<view class="step-content">
						<fui-white-space height="20"></fui-white-space>
						<button class="step-btn" @click="onClickGetLocation">{{$t('common.get-location')}}</button>
					</view>
				</view>
				<fui-white-space height="30"></fui-white-space>
				<view class="step">
					<view class="step-title">
						{{$t('common.vpn.step.three.title')}}
					</view>
					<view class="step-content"></view>
				</view>
				<fui-white-space height="30"></fui-white-space>
				<view class="step">
					<view class="step-title">
						{{$t('common.vpn.step.four.title')}}
					</view>
					<view class="step-content">
						<fui-white-space height="20"></fui-white-space>
						<button class="step-btn" @click="toBackPage">{{$t('common.text.return-previous-page')}}</button>
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
		computed: {},
		onLoad(options) {},
		onShow() {},
		onReady() {},
		mounted() {},
		methods: {
			onClickGetLocation() {
				uni.showLoading();
				// 获取当前位置
				this.$utils.common.getCurrentLocation().then(res => {
					const longitude = res.longitude;
					const latitude = res.latitude;
					// 保存至本地缓存中
					uni.setStorageSync("MAP_LONGITUDE", longitude);
					uni.setStorageSync("MAP_LATITUDE", latitude);
					uni.showToast({
						// title: `获取位置成功，经度：${longitude}，纬度：${latitude}`,
						title: this.$t('common.get.location.succeed', {
							longitude: longitude,
							latitude: latitude,
						}),
						icon: 'none',
						duration: 2000,
					});
				}).catch(err => {
					uni.showToast({
						title: this.$t('common.request-failed'),
						icon: 'none',
						duration: 2000,
					});
				}).finally(() => {
					uni.hideLoading();
				});
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		min-height: 100%;
		font-weight: normal;
		background-color: var(--app-bg-color);
		box-sizing: border-box;
	}

	.page-wrap {
		width: 100%;
		min-height: 100%;
		background-color: var(--app-bg-color);
	}

	.page-header {}

	.page-body {}

	.page-footer {}

	.container {
		// margin: $uni-spacing-row-lg;
		padding: $uni-spacing-row-lg;
		// border-radius: $uni-border-radius-lg;
	}
</style>