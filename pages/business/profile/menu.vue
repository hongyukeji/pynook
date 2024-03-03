<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">
				<view class="fui-section__title">{{$t('common.menu')}}</view>
				<fui-list-cell :highlight="false" :padding="['28rpx','32rpx']">
					<view class="fui-cells">
						<text class="fui-text">{{$t('common.menu')+' '+$t('common.status')}}</text>
						<fui-switch @change="change" :checked="formData?.menuStatus == 1">
							<text
								class="fui-switch--text">{{formData?.menuStatus == 1 ?$t('common.on'):$t('common.off')}}</text>
						</fui-switch>
					</view>
				</fui-list-cell>
			</view>
		</view>
		<view class="page-footer">
			<button class="btn-main btn-confirm" type="default" @click="submit()">{{$t('common.form.save')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				formData: {},
			};
		},
		onLoad() {},
		onShow() {},
		onReady() {},
		mounted() {
			this.loadData();
		},
		methods: {
			change(e) {
				this.formData.menuStatus = e.detail.value ? 1 : 0;
			},
			loadData() {
				const that = this;
				this.$api.business.getBusinessData().then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					that.formData = data;
				})
			},
			submit() {
				const that = this;
				const formData = JSON.parse(JSON.stringify(this.formData));
				console.log('---> formData :', formData);
				this.$api.business.setBusinessData(formData).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					that.formData = data;
					uni.showToast({
						title: this.$t('common.form.submit-successful')
					})
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		font-weight: normal;
		background-color: $uni-background-color;
		box-sizing: border-box;
	}

	.page-wrap {}

	.page-hedaer {}

	.page-body {}

	.page-footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: $uni-spacing-row-lg;
		box-sizing: border-box;
		background-color: $uni-bg-color;
	}

	.container {
		box-sizing: border-box;
		// margin: $uni-spacing-col-lg $uni-spacing-row-lg;
		// padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	}

	.btn-main {
		color: #ffffff;
		background-color: $uni-color-master;
		border-color: $uni-color-master;
	}

	.fui-section__title {
		margin: 32rpx;
	}

	.fui-section__title {
		margin-left: 32rpx;
	}

	.fui-cells {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.fui-switch--text {
		font-size: 24rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
	}

	.fui-icon--img {
		width: 40rpx;
		height: 40rpx;
	}
</style>