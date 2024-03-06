<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container">
				<fui-card :margin="['0rpx','0rpx']" color="var(--app-color-master)" :src="merchant.image || appLogo"
					:title="merchant.name" tag="0km">
					<view class="fui-card__content">
						<uni-icons class="" type="location" color="var(--app-color-slave)" size="18"></uni-icons>
						{{merchant.address}}
					</view>
					<view class="fui-card__content">
						<uni-icons class="" type="phone" color="var(--app-color-slave)" size="18"></uni-icons>
						{{merchant.telephone}}
					</view>
					<view class="fui-card__content">
						<uni-icons class="" type="info" color="var(--app-color-slave)" size="18"></uni-icons>
						{{merchant.introduction}}
					</view>
				</fui-card>

				<view class="banner-wrap" v-if="banners && banners.length > 0">
					<fui-swiper-dot :styles="bannerStyles" :items="banners" :current="bannerCurrent">
						<swiper class="fui-banner__box" @change="bannerChange" circular :indicator-dots="false" autoplay
							:interval="5000" :duration="150">
							<swiper-item v-for="(item,index) in banners" :key="index">
								<view class="fui-banner__cell" :class="{'fui-item__scale':bannerCurrent!==index}"
									:style="{background: '#fff',padding: '0px','box-sizing': 'border-box',}">
									<image class="image" :src="item" :mode="'aspectFill'"
										style="width: 100%;height: 100%;">
									</image>
								</view>
							</swiper-item>
						</swiper>
					</fui-swiper-dot>
				</view>

				<view class="uni-padding-wrap uni-common-mt">
					<uni-segmented-control :current="tabMenuCurrent" :values="tabMenus" :style-type="'button'"
						active-color="var(--app-color-master)" @clickItem="tabMenuClickItem" />
				</view>

				<view class="content">
					<template v-if="tabMenuCurrent === 0">
						<view class="stamps-preview-wrap" v-if="business.loyaltyCardStatus">
							<view class="stamps-preview-icon">
								<view class="stamps-preview-number">
									{{business.freeItemNeededStampNumber}}
								</view>
								<view class="stamps-preview-text">
									{{$t('business.common.stamps')}}
								</view>
							</view>
							<view class="stamps-preview-desc">
								{{$t('business.common.exchange')}} {{business.freeItemNumber}} {{business.freeItemName}}
							</view>
						</view>
					</template>
					<template v-if="tabMenuCurrent === 1">
						<view class="product-wrap">
							<product-list-cart :items="items"></product-list-cart>
						</view>
						<view class="content-footer">
							<uni-load-more :status="loadStatus"></uni-load-more>
						</view>
					</template>
				</view>
			</view>
		</view>
		<view class="page-footer">
			<!-- <view class="goods-carts" v-if="tabMenuCurrent === 1"></view> -->
			<uni-goods-nav :options="navOptions" :fill="true" :button-group="buttonGroup" @click="navClick"
				@buttonClick="navButtonClick" />
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
				merchant: {
					id: '',
				},
				business: {},
				// 商品
				params: {
					current: 0, // 初始页码
					size: 10, // 每页条数
					keyword: "", // 关键字
				},
				items: [], // 列表数据数组
				loading: 0, // 加载状态: 0-加载前more，1-加载中loading，2-没有更多数据noMore
				tabMenus: [this.$t('business.common.loyalty-card'), this.$t('business.button.menu'), ],
				tabMenuCurrent: 1,
				bannerCurrent: 0,
				banners: [],
				bannerStyles: {
					width: 12,
					height: 12,
					activeWidth: 24,
					activeBackground: 'var(--app-color-master)',
				},
				navOptions: [{
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
					// backgroundColor: 'linear-gradient(90deg, #FAD09E, #090C49)',
					backgroundColor: 'linear-gradient(90deg, var(--app-color-master), var(--app-color-master))',
					color: '#fff'
				}],
				productList: [],
			};
		},
		computed: {
			loadStatus() {
				switch (this.loading) {
					case 0:
						return "more";
						break;
					case 1:
						return "loading";
						break;
					case 2:
						return "noMore";
						break;
					default:
						return "more";
				}
			},
		},
		onLoad(options) {
			this.merchant.id = options.id
			this.params.merchantId = options.id
		},
		onShow() {},
		onReady() {},
		mounted() {
			this.getMerchantData();
			this.getBusinessDetail();
			this.loadData();
		},
		methods: {
			async getBusinessDetail() {
				const formData = {
					merchantId: this.merchant.id,
				}
				await this.$api.business.getBusinessDetail(formData).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					this.business = data;
				})
			},
			async getMerchantData() {
				// 发送请求获取数据
				const formData = {
					id: this.merchant.id,
				}
				await this.$api.merchant.getMerchantDetail(formData).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					this.merchant = data;
					if (data.images) {
						this.banners = data.images.split(",");
					}
				})
			},
			async refreshData() {
				this.params.current = 0;
				this.items = [];
				if (this.loading == 2) {
					this.loading = 0;
				}
				await this.loadData();
			},
			async loadData() {
				if (this.loading >= 1) {
					return;
				}
				this.params.current++;
				this.loading = 1;
				// 发送请求获取数据
				await this.$api.product.getProductList(this.params).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					// console.log('---> data :', data);
					// 判断是否是最后一页
					if (data.current >= data.pages) {
						this.loading = 2;
					}
					const items = data.records;
					// 将数据追加到 items 数组中
					this.items = this.items.concat(items);
				});
				if (this.loading == 1) {
					this.loading = 0;
				}
			},
			tabMenuClickItem(e) {
				if (this.tabMenuCurrent !== e.currentIndex) {
					this.tabMenuCurrent = e.currentIndex
				}
			},
			navClick(e) {
				/* uni.showToast({
					title: `点击${e.content.text}`,
					icon: 'none'
				}) */
				const url = e.content.url;
				this.$utils.common.redirect(url);
			},
			navButtonClick(e) {
				console.log(e)
			},
			bannerChange(e) {
				this.bannerCurrent = e.detail.current;
			},
			getPrice(price, type) {
				if (!price) return ''
				const arr = price.split('.')
				return type === 1 ? arr[0] : `.${arr[1]}`
			},
			vip() {
				const url = "/pages/my/qa/qa?index=2&title=VIP专属内容"
				uni.fui.href(url)
			},
			handleClick(e) {
				console.log(e);
			},
			// 下拉刷新
			async onPullDownRefresh() {
				console.log('下拉刷新-->>')
				await this.refreshData();
				uni.stopPullDownRefresh() // 停止当前页面刷新
			},
			// 触底加载
			async onReachBottom() {
				console.log('触底加载-->>')
				await this.loadData();
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		min-height: 100%;
		background-color: var(--app-bg-color);
		font-weight: normal;
	}

	.page-wrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.page-header {}

	.page-body {
		position: relative;
		flex: 1;
	}

	.page-footer {
		position: fixed;
		width: 100%;
		bottom: 0;
	}

	.container {
		box-sizing: border-box;
		margin: $uni-spacing-row-lg;
		padding-bottom: var(--window-bottom);
		margin-bottom: var(--window-bottom);
	}

	.fui-card__content {
		color: $uni-text-color-placeholder;
		font-weight: normal;
		font-size: 14px;
		margin: 20rpx 20rpx;
		box-sizing: border-box;
	}

	.uni-common-mt {
		margin-top: $uni-spacing-row-lg;
	}

	.uni-padding-wrap {}

	::v-deep .segmented-control__item--button {
		border-color: var(--app-color-master) !important;
	}

	.content {
		// background-color: $uni-bg-color;
		// text-align: center;
		box-sizing: border-box;
		padding: $uni-spacing-col-lg 0px;
	}

	.banner-wrap {
		margin: $uni-spacing-row-lg auto;
	}

	.product-wrap {
		width: 100%;
		position: relative;
		padding: 12rpx 0rpx;
		// background-color: $uni-bg-color;
		// margin-bottom: 50px;
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

	.fui-wrap {
		padding-bottom: 64rpx;
	}

	.fui-section__title {
		margin-left: 32rpx;
	}

	.fui-banner__item {
		width: 100%;
		height: 360rpx;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		font-weight: 600;
	}

	.fui-banner__wrap {
		height: 360rpx;
	}


	.fui-banner__box {
		height: 280rpx;
	}

	.fui-banner__cell {
		width: 100%;
		height: 280rpx;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		font-weight: 600;
		border-radius: 24rpx;
		transition: transform .1s linear;
	}

	.fui-item__scale {
		transform: scale3d(.9, .9, 1);
	}
</style>