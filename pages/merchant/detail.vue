<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container">
				<merchant-info :merchant="merchant"></merchant-info>
				<view class="banner-wrap" v-if="banners && banners.length > 0">
					<fui-swiper-dot :styles="bannerStyles" :items="banners" :current="bannerCurrent">
						<swiper class="fui-banner__box" @change="onChangeBanner" circular :indicator-dots="false"
							autoplay :interval="5000" :duration="150">
							<swiper-item v-for="(item,index) in banners" :key="index">
								<view @click="bannerPreviewImage(index)" class="fui-banner__cell"
									:class="{'fui-item__scale':bannerCurrent!==index}"
									:style="{background: '#fff',padding: '0px','box-sizing': 'border-box',}">
									<image class="image" :src="item" :mode="'aspectFill'" style="width: 100%;">
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
							<product-list :type="'cart'" :items="items" :cartList="cartList"
								@add-cart-item="addCartItem" @update-cart-item="updateCartItem"
								@delete-cart-item="deleteCartItem"></product-list>
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
			<uni-goods-nav :options="navMenuList" :fill="true" :button-group="navButtonList" @click="onClickNavMenu"
				@buttonClick="onClickNavButton" />
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
				navMenuList: [{
						icon: 'home',
						text: this.$t('tabbar.home'),
						url: '/'
					},
					{
						icon: 'chat',
						text: this.$t('common.customer-service'),
						url: 'method://onClickTelephone',
					},
					/* {
					icon: 'shop',
					text: '店铺',
					info: 2,
					infoBackgroundColor: '#007aff',
					infoColor: "#f5f5f5"
					}, */
					{
						icon: 'cart',
						text: this.$t('tabbar.cart'),
						// url: '/pages/cart/cart',
						url: 'method://onConfirmOrder',
						info: 0,
						// info: this.$store.getters['cart/cartTotalQuantity'] || 0,
						// info: this.$store.state.cart.cartTotalQuantity,
					}
				],
				navButtonList: [{
					text: this.$t('common.buy-now'),
					// backgroundColor: 'linear-gradient(90deg, #FAD09E, #090C49)',
					backgroundColor: 'linear-gradient(90deg, var(--app-color-master), var(--app-color-master))',
					color: '#fff',
					url: 'method://onConfirmOrder',
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
			...mapState({
				isLogin: state => state.user.isLogin,
			}),
			...mapState({
				cartList: state => state.cart.cartList,
				cartTotalQuantity: state => state.cart.cartTotalQuantity,
			}),
			// ...mapGetters('cart', ['cartTotalQuantity']),
		},
		watch: {
			cartTotalQuantity: {
				handler(newVal, oldVal) {
					// console.log("---> cartTotalQuantity watch newVal: ", newVal);
					// console.log("---> cartTotalQuantity watch oldVal: ", oldVal);
					// this.navMenuList[1].info = this.cartTotalQuantity;
					this.navMenuList.map(item => {
						// console.log(item);
						if (item.url == '/pages/cart/cart') {
							item.info = this.cartTotalQuantity;
						}
					});
				},
				immediate: true, // 初始化绑定时就会执行handler方法
				deep: true, // 对象中任一属性值发生变化，都会触发handler方法
			},
		},
		onLoad(options) {
			this.merchant.id = options.id
			this.params.merchantId = options.id
		},
		onShow() {
			// console.log('---> cartList :', this.cartList);
			// console.log('---> cartTotalQuantity :', this.cartTotalQuantity);
			// console.log('---> cartTotalQuantity :', this.$store.state.cart.cartTotalQuantity);
			// console.log('---> cartTotalQuantity :', this.$store.getters['cart/cartTotalQuantity']);
			this.initData();
		},
		onReady() {},
		mounted() {},
		methods: {
			...mapActions('cart', ['getCartList', 'getCartTotalQuantity', 'addCart', 'updateCart', 'deleteCart']),
			initData() {
				this.getMerchantData();
				this.getBusinessDetail();
				this.loadData();
				if (this.isLogin) {
					this.syncCartData();
				}
			},
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
			onClickNavMenu(e) {
				console.log('---> onClickNavMenu :', e);
				/* uni.showToast({
					title: `点击${e.content.text}`,
					icon: 'none'
				}) */
				const url = e.content.url;
				const params = e.content;
				if (url == '/pages/cart/cart') {
					this.$utils.common.setReturnUrl();
				}
				this.redirect(url, this, params);
			},
			onClickNavButton(e) {
				console.log('---> onClickNavButton :', e);
				const url = e.content.url;
				const params = e.content;
				this.redirect(url, this, params);
			},
			onChangeBanner(e) {
				// console.log('---> onChangeBanner :', e);
				this.bannerCurrent = e.detail.current;
			},
			getPrice(price, type) {
				if (!price) return ''
				const arr = price.split('.')
				return type === 1 ? arr[0] : `.${arr[1]}`
			},
			handleClick(e) {
				console.log(e);
			},
			async syncCartData() {
				await this.getCartList();
				await this.getCartTotalQuantity();
			},
			async addCartItem(item, value, params) {
				console.log('---> addCartItem :', item);
				if (!item) {
					return;
				}
				const formData = {
					productId: item.id,
					quantity: value,
				};
				await this.addCart(formData);
				await this.syncCartData();
			},
			async updateCartItem(item, value, params) {
				if (!item) {
					return;
				}
				return;
				console.log('---> updateCartItem :', item);
				const formData = {
					productId: item.id,
					quantity: value,
				};
				await this.updateCart(formData);
				await this.syncCartData();
			},
			async deleteCartItem(item, value, params) {
				console.log('---> deleteCartItem :', item);
				if (!item) {
					return;
				}
				const formData = {
					productId: item.id,
					quantity: value,
				};
				await this.deleteCart(formData);
				await this.syncCartData();
			},
			onClickTelephone(telephone) {
				if(!telephone){
					telephone = this.merchant.telephone;
				}
				uni.makePhoneCall({
					phoneNumber: telephone,
				});
			},
			bannerPreviewImage(index) {
				uni.previewImage({
					current: this.banners[index],
					loop: true,
					urls: this.banners
				})
			},
			onConfirmOrder() {
				// console.log('---> onConfirmOrder params :', params);
				const merchantId = this.merchant.id;
				// 发送请求获取数据
				const params = {
					merchantId: merchantId,
				}

				// url参数编码
				const urlParams = new URLSearchParams(params).toString();
				console.log('---> urlParams :', urlParams);

				// url参数解码
				// const urlParams = new URLSearchParams(window.location.search);
				// console.log('---> urlParams :', urlParams);

				const url = `/pages/order/confirm?${urlParams}`;
				this.redirect(url, this, params);
			},
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
		padding-bottom: 50px;
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