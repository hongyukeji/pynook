<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container">
				<view class="header">
					<view class="logo">
						<image class="image" :src="appLogo" :mode="'heightFix'" style="width: 100%;height: 100%;">
						</image>
					</view>
					<view class="name">
						{{ appName }}
					</view>
				</view>
				<view class="description">
					For use with the [{{ appName }}] Pi App
				</view>
				<view class="content">
					<view class="qrcode-wrap">
						<fui-qrcode class="qrcode" :value="qrcodeUrl"></fui-qrcode>
					</view>
				</view>
			</view>
		</view>
		<view class="page-footer"></view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				appName: getApp().globalData.app.name || '',
				appLogo: getApp().globalData.app.logo || '',
				merchantId: 0,
			};
		},
		computed: {
			// 基于data中的count计算出双倍的值
			qrcodeUrl() {
				return getApp().globalData.app.url + "/#/pages/merchant/detail?id=" + this.merchantId;
			}
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
					that.merchantId = data.merchantId;
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {}

	.page-wrap {}

	.page-header {}

	.page-body {}

	.page-footer {}

	.container {
		color: var(--app-color-master);
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		margin: 30px auto;
	}

	.logo {
		width: 80px;
		height: 80px;
		margin-right: 5px;
	}

	.description {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		margin: 20px auto;
	}

	.content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.qrcode-wrap {
		padding: $uni-spacing-row-lg;
		background-color: $uni-bg-color;
		border-radius: $uni-border-radius-lg;
	}

	.qrcode {}
</style>