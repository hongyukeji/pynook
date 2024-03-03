<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">
				<fui-card :margin="['0rpx','0rpx']" :src="item.image || appLogo" :title="item.name" tag="1km">
					<view class="fui-card__content">{{$t('business.form.address')}}: {{item.address}}</view>
					<view class="fui-card__content">{{$t('business.form.business-introduction')}}:
						{{item.introduction}}
					</view>
				</fui-card>

				<view class="uni-padding-wrap uni-common-mt">
					<uni-segmented-control :current="current" :values="items" :style-type="styleType"
						active-color="#090C49" @clickItem="onClickItem" />
				</view>

				<view class="content">
					<view v-if="current === 0">
						<text class="content-text">会员券</text>
					</view>
					<view v-if="current === 1">
						<text class="content-text">商品列表</text>
					</view>
				</view>
			</view>
		</view>
		<view class="page-footer">
			<view class="goods-carts" v-if="current === 1">
				<uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="onClick"
					@buttonClick="buttonClick" />
			</view>
		</view>
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
				items: ['会员券', '菜单', ],
				current: 0,
				options: [{
						icon: 'home',
						text: this.$t('tabbar.home'),
						url: '/'
					},
					/* {
					icon: 'chat',
					text: '客服'
				}, {
					icon: 'shop',
					text: '店铺',
					info: 2,
					infoBackgroundColor: '#007aff',
					infoColor: "#f5f5f5"
				}, */
					{
						icon: 'cart',
						text: this.$t('tabbar.cart'),
						url: '/pages/cart/cart'
					}
				],
				buttonGroup: [{
					text: '立即购买',
					backgroundColor: 'linear-gradient(90deg, #FAD09E, #090C49)',
					color: '#fff'
				}],
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
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			onClick(e) {
				uni.showToast({
					title: `点击${e.content.text}`,
					icon: 'none'
				})
				const url = e.content.url;
				this.$utils.common.redirect(url);
			},
			buttonClick(e) {
				console.log(e)
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		background-color: $uni-background-color;
		font-weight: normal;
	}

	.page-wrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.page-hedaer {}

	.page-body {
		position: relative;
		flex: 1;
	}

	.page-footer {}

	.container {
		box-sizing: border-box;
		margin: $uni-spacing-row-lg;
	}

	.fui-card__content {
		font-size: 28rpx;
		margin: 20rpx 20rpx;
		box-sizing: border-box;
	}

	.uni-common-mt {
		margin-top: $uni-spacing-row-lg;
	}

	.uni-padding-wrap {}

	::v-deep .segmented-control__item--button {
		border-color: $uni-color-master !important;
	}

	.content {
		// background-color: $uni-bg-color;
		display: flex;
		justify-content: center;
		align-items: center;
		height: auto;
		text-align: center;
		padding: $uni-spacing-col-lg;
	}
</style>