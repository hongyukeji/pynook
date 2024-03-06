<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">
				<view class="fui-section__title">{{$t('business.common.loyalty-card')}}</view>

				<view class="content">
					<fui-list-cell :highlight="false" :padding="['28rpx','32rpx']">
						<view class="fui-cells">
							<text class="fui-text">{{$t('business.common.loyalty-card')+' '+$t('common.status')}}</text>
							<fui-switch @change="change" :checked="formData?.loyaltyCardStatus == 1">
								<text
									class="fui-switch--text">{{formData?.loyaltyCardStatus == 1 ?$t('common.on'):$t('common.off')}}</text>
							</fui-switch>
						</view>
					</fui-list-cell>
				</view>

				<view class="content" v-if="formData?.loyaltyCardStatus == 1">
					<view class="form-body">
						<!-- 基础表单校验 -->
						<uni-forms ref="form" :rules="rules" :modelValue="formData" label-position="top"
							label-width="120">
							<uni-forms-item :label="$t('business.form.free-item-name')" required
								:name="['freeItemName']">
								<uni-easyinput v-model="formData.freeItemName"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.free-item-name')" />
							</uni-forms-item>
							<uni-forms-item :label="$t('business.form.free-item-number')" required
								:name="['freeItemNumber']">
								<uni-easyinput type="number" v-model="formData.freeItemNumber"
									@change="(val)=>{formData.freeItemNumber = val.replace(/\.(\d*)/, '').replace(/[^\d]/g, '');}"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.free-item-number')" />
							</uni-forms-item>
							<uni-forms-item :label="$t('business.form.free-item-needed-stamp-number')" required
								:name="['freeItemNeededStampNumber']">
								<uni-easyinput type="number" v-model="formData.freeItemNeededStampNumber"
									@change="(val)=>{formData.freeItemNeededStampNumber = val.replace(/\.(\d*)/, '').replace(/[^\d]/g, '');}"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.free-item-needed-stamp-number')" />
							</uni-forms-item>
						</uni-forms>
					</view>
					<view class="stamps-preview-wrap">
						<view class="stamps-preview-icon">
							<view class="stamps-preview-number">
								{{formData.freeItemNeededStampNumber}}
							</view>
							<view class="stamps-preview-text">
								{{$t('business.common.stamps')}}
							</view>
						</view>
						<view class="stamps-preview-desc">
							{{$t('business.common.exchange')}} {{formData.freeItemNumber}} {{formData.freeItemName}}
						</view>
					</view>
				</view>
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
				// 校验规则
				rules: {
					"freeItemName": {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'business.form.free-item-name')
						}]
					},
					"freeItemNumber": {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'business.form.free-item-number')
						}]
					},
					"freeItemNeededStampNumber": {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'business.form.free-item-needed-stamp-number')
						}]
					},
				},
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
				this.formData.loyaltyCardStatus = e.detail.value ? 1 : 0;
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
				// const formData = JSON.parse(JSON.stringify(this.formData));
				const formData = this.formData;
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
		min-height: 100%;
		font-weight: normal;
		background-color: var(--app-bg-color);
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

	.stamps-preview-wrap {
		margin: $uni-spacing-row-lg;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.stamps-preview-icon {
		padding: 15px 30px;
		background-color: var(--app-color-master);
		border-radius: $uni-border-radius-lg;
	}

	.stamps-preview-number {
		font-size: 30px;
		color: var(--app-color-slave);
		text-align: center;
	}

	.stamps-preview-text {
		font-size: 14px;
		color: #ffffff;
		text-align: center;
	}

	.stamps-preview-desc {
		font-size: 18px;
		font-weight: bold;
		padding: $uni-spacing-col-lg $uni-spacing-row-lg;
		color: var(--app-color-master);
	}
</style>