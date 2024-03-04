<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">
				<fui-card :margin="['0rpx','0rpx']" :src="item.image || appLogo" :title="item.name" tag="1km">
					<view class="fui-card__content">
						<uni-icons class="" type="location" color="$uni-color-slave" size="18"></uni-icons>
						{{item.address}}
					</view>
					<view class="fui-card__content">
						<uni-icons class="" type="home" color="$uni-color-slave" size="18"></uni-icons>
						{{item.introduction}}
					</view>
				</fui-card>

				<view class="banner-wrap" v-if="banners && banners.length > 0">
					<fui-swiper-dot :styles="styles" :items="banners" :current="current2">
						<swiper class="fui-banner__box" @change="change2" circular :indicator-dots="false" autoplay
							:interval="5000" :duration="150">
							<swiper-item v-for="(item,index) in banners" :key="index">
								<view class="fui-banner__cell" :class="{'fui-item__scale':current2!==index}"
									:style="{background: '#fff',padding: '0px','box-sizing': 'border-box',}">
									<image class="image" :src="item" :mode="'heightFix'"
										style="width: 100%;height: 100%;">
									</image>
								</view>
							</swiper-item>
						</swiper>
					</fui-swiper-dot>
				</view>

				<view class="uni-padding-wrap uni-common-mt">
					<uni-segmented-control :current="current" :values="items" :style-type="styleType"
						active-color="#090C49" @clickItem="onClickItem" />
				</view>

				<view class="content">
					<view v-if="current === 0">
						<text class="content-text">会员券</text>
					</view>
					<view class="product-wrap" v-if="current === 1">
						<!-- 列表模式-->
						<view class="fui-goods__list">
							<view class="fui-goods__item" :class="{'fui-goods__item-list':true,'fui-goods__hover':true}"
								v-for="(item,index) in productList" :key="index" @tap="handleClick(item)">
								<fui-lazyload radius="16" :width="252" :height="252" :src="item.src" mode="aspectFill">
								</fui-lazyload>
								<view class="fui-goods__item-content" :class="{'fui-list__padding':true}">
									<view class="fui-goods__item-top">
										<fui-overflow-hidden :rows="2" :size="28" :text="item.title">
										</fui-overflow-hidden>
										<view class="fui-goods__item-attr">
											<fui-tag :text="item.tag" :padding="['4rpx','4rpx']"
												background="rgba(255, 43, 43, .05)" color="#FF2B2B"
												borderColor="transparent"></fui-tag>
										</view>
									</view>
									<view>
										<view class="fui-goods__item-price">
											<fui-text font-weight="500" text="￥" :size="22" color="#FF2B2B"></fui-text>
											<fui-text font-weight="500" lineHeight :text="getPrice(item.price,1)"
												:size="34" color="#FF2B2B">
											</fui-text>
											<fui-text font-weight="500" :text="getPrice(item.price,2)" :size="24"
												color="#FF2B2B"></fui-text>
										</view>
										<fui-text :padding="['4rpx','0','0']" :text="`${item.evaluate}条评价`" :size="24"
											color="#7F7F7F"></fui-text>
									</view>
								</view>
							</view>
						</view>
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
				current: 1,
				current2: 0,
				banners: [],
				styles: {
					width: 12,
					height: 12,
					activeWidth: 24,
					activeBackground: '#090C49',
				},
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
					// backgroundColor: 'linear-gradient(90deg, #FAD09E, #090C49)',
					backgroundColor: 'linear-gradient(90deg, #090C49, #090C49)',
					color: '#fff'
				}],
				productList: [{
					src: 'https://res.firstui.cn/static/images/component/waterfall/P_008.jpeg',
					title: '厨房厨柜定制整体套装石英石台面装修家用一体灶台柜吊柜碗橱柜',
					tag: '近期浏览过万',
					price: '2800.00',
					evaluate: 2000
				}, {
					src: 'https://res.firstui.cn/static/images/component/waterfall/P_006.jpeg',
					title: '学生宿舍被套床单三件套寝室床上被褥套装被子全套 150×200cm',
					tag: '100%好评',
					price: '48.00',
					evaluate: 800
				}, {
					src: 'https://res.firstui.cn/static/images/component/waterfall/P_010.jpeg',
					title: '【特价捡漏】高档轻奢品牌设计感小众衬衣女2022夏季新款清凉休闲女式百搭短袖棉质格纹衬衫',
					tag: '近期浏览过万',
					price: '29.90',
					evaluate: 12000
				}, {
					src: 'https://res.firstui.cn/static/images/component/waterfall/P_011.jpeg',
					title: '丝袜女夏季超薄性感黑丝显瘦美腿袜纯欲风长筒打底连裤袜',
					tag: '100%好评',
					price: '8.90',
					evaluate: 1100
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
					if (data.images) {
						that.banners = data.images.split(",");
					}
				})
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			onClick(e) {
				/* uni.showToast({
					title: `点击${e.content.text}`,
					icon: 'none'
				}) */
				const url = e.content.url;
				this.$utils.common.redirect(url);
			},
			buttonClick(e) {
				console.log(e)
			},
			change2(e) {
				this.current2 = e.detail.current;
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
			}
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
		// text-align: center;
		padding: $uni-spacing-col-lg 0px;
		box-sizing: border-box;
	}

	.banner-wrap {
		margin: $uni-spacing-row-lg auto;
	}

	.product-wrap {
		width: 100%;
		position: relative;
		margin-bottom: 50px;
		padding: 12rpx 0rpx;
		// background-color: $uni-bg-color;
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

	/* ============================ */
	/* 商品列表 css */
	.fui-goods__list {
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		overflow: hidden;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}

	.fui-goods__item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		background-color: #fff;
	}

	.fui-goods__hover:active {
		background-color: rgba(0, 0, 0, 0.2);
	}

	.fui-goods__item-card {
		width: 344rpx;
		flex-direction: column;
		margin-bottom: 16rpx;
		border-radius: 16rpx;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		transform: translateY(0);
		/* #endif */
	}

	.fui-goods__item-list {
		flex: 1;
		/* #ifndef APP-NVUE  */
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		padding: 12rpx 24rpx;
		flex-direction: row;
		padding: $uni-spacing-col-lg;
		margin-bottom: $uni-spacing-col-lg;
		border-radius: $uni-border-radius-lg;
	}

	.fui-gi__mr {
		margin-right: 16rpx;
	}

	.fui-goods__item-content {
		height: 252rpx;
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: column;
		justify-content: space-between;
	}

	.fui-goods__item-top {
		// width: 426rpx;
	}

	.fui-card__padding {
		padding: 20rpx;
	}

	.fui-list__padding {
		padding: 12rpx 0 12rpx 24rpx;
	}

	.fui-goods__item-price {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: flex-end;
	}

	.fui-goods__item-attr {
		flex-direction: row;
		padding-top: 8rpx;
	}
</style>