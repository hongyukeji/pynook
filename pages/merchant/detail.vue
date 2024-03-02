<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">
				<fui-card :src="item.image || appLogo" :title="item.name" tag="1km">
					<view class="fui-card__content">{{$t('business.form.address')}}: {{item.address}}</view>
					<view class="fui-card__content">{{$t('business.form.business-introduction')}}:
						{{item.introduction}}
					</view>
				</fui-card>
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
			return {
				params: {
					id: '',
				},
				item: {},
				appName: getApp().globalData.app.name || '',
				appLogo: getApp().globalData.app.logo || '',
			};
		},
		computed: {},
		onLoad(options) {
			this.params.id = options.id
		},
		onShow() {},
		onReady() {},
		mounted() {
			this.loadData();
		},
		methods: {
			async loadData() {
				const that = this;
				// 发送请求获取数据
				await this.$api.merchant.getMerchantDetail(this.params).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					that.item = data;
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: $uni-background-color;
	}

	.page-wrap {}

	.page-hedaer {}

	.page-body {}

	.page-footer {}

	.container {
		box-sizing: border-box;
		margin: $uni-spacing-row-lg auto;
	}
	
	.fui-card__content {
		font-size: 28rpx;
		margin: 20rpx 20rpx;
		box-sizing: border-box;
	}
</style>