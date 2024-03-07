<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container">
				<view class="fui-section__title">{{$t('common.menu')}}</view>

				<view class="content">
					<fui-list-cell :highlight="false" :padding="['28rpx','32rpx']">
						<view class="fui-cells">
							<text class="fui-text">{{$t('common.menu')+' '+$t('common.status')}}</text>
							<fui-switch @change="menuStatusChange" :checked="formData?.menuStatus == 1">
								<text
									class="fui-switch--text">{{formData?.menuStatus == 1 ?$t('common.on'):$t('common.off')}}</text>
							</fui-switch>
						</view>
					</fui-list-cell>
				</view>

				<template v-if="formData?.menuStatus == 1">
					<view class="content">
						<fui-list-cell :highlight="false" :padding="['28rpx','32rpx']">
							<view class="fui-cells">
								<text
									class="fui-text">{{$t('business.common.accept-order')+' '+$t('common.status')}}</text>
								<fui-switch @change="acceptOrderStatusChange"
									:checked="formData?.acceptOrderStatus == 1">
									<text
										class="fui-switch--text">{{formData?.acceptOrderStatus == 1 ?$t('common.on'):$t('common.off')}}</text>
								</fui-switch>
							</view>
						</fui-list-cell>
					</view>
					<view class="content">
						<fui-list-cell :highlight="false" :padding="['28rpx','32rpx']">
							<view class="fui-cells">
								<text
									class="fui-text">{{$t('business.common.accept-payment')+' '+$t('common.status')}}</text>
								<fui-switch @change="acceptPaymentStatusChange"
									:checked="formData?.acceptPaymentStatus == 1">
									<text
										class="fui-switch--text">{{formData?.acceptPaymentStatus == 1 ?$t('common.on'):$t('common.off')}}</text>
								</fui-switch>
							</view>
						</fui-list-cell>
					</view>
					<view class="content btn-product-wrap" style="">
						<!-- <fui-button type="gray" btn-size="medium" :text="$t('pages.business.products')" bold @click="submit" style="margin: 0 auto;"></fui-button> -->
						<view class="btn-product-add" @click="toProductPage">
							<uni-icons class="btn-product-add-icon" type="plus" size="60" color="#fff"></uni-icons>
						</view>
					</view>
				</template>
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
			menuStatusChange(e) {
				this.formData.menuStatus = e.detail.value ? 1 : 0;
			},
			acceptOrderStatusChange(e) {
				this.formData.acceptOrderStatus = e.detail.value ? 1 : 0;
			},
			acceptPaymentStatusChange(e) {
				this.formData.acceptPaymentStatus = e.detail.value ? 1 : 0;
			},
			toProductPage() {
				const url = "/pages/business/products";
				this.redirect(url);
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {}

	.page-wrap {}

	.page-header {}

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

	.content {
		padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	}

	.btn-main {
		color: #ffffff;
		background-color: var(--app-color-master);
		border-color: var(--app-color-master);
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

	.btn-product-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-product-add {
		background-color: var(--app-color-master);
		display: inline-flex;
		padding: $uni-spacing-row-lg;
		border-radius: $uni-border-radius-circle;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
	}

	.btn-product-add-icon {
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>