<template>
	<view class="fui-wrap">
		<view class="fui-page__hd">
			<view class="fui-page__title fui-align__center"></view>
			<view class="fui-page__desc"></view>
		</view>
		<view class="fui-page__bd fui-page__spacing">
			<view class="fui-section__title">{{$t('common.photo')}}</view>
			<view class="fui-btn__box">
				<fui-button type="success" btn-size="medium" :text="$t('common.form.save')" bold @click="submit"
					background="#090C49" color="#FFFFFF"></fui-button>
			</view>
			<upload-file v-model="uploadFileUrls" :max="10"></upload-file>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uploadFileUrls: [],
			}
		},
		onLoad() {},
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
					if (data.merchant && data.merchant.images) {
						this.uploadFileUrls = data.merchant.images.split(",");
					}
					this.formData = data;
				})
			},
			submit() {
				// console.log('---> fileList :', this.fileList);
				console.log('---> urls :', this.urls);
				const that = this;
				this.formData.merchant.images = this.uploadFileUrls.join(",");
				this.$api.business.setBusinessData(this.formData).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					this.formData = data;
					uni.showToast({
						title: this.$t('common.form.submit-successful')
					})
				})
			},
		}
	}
</script>

<style>
	.fui-btn__box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-bottom: 64rpx;
	}
</style>