<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container">
				<view class="order-wrap">
					<fui-panel :panelData="orderPanelData" :marginTop="30" :size="26" :radius="12" :headSize="30"
						headColor="var(--app-color-master)" :descSize="24" descColor="var(--fui-color-subtitle)"
						:infoSize="26" infoColor="var(--app-color-slave)">
						<!-- <fui-list-cell arrow :bottomBorder="false" topBorder topLeft="32">
							<text class="fui-text__link" style="color: var(--app-color-master);">返回修改</text>
						</fui-list-cell> -->
					</fui-panel>
					<!-- <fui-white-space size="large"></fui-white-space> -->
					<fui-preview :previewData="orderPreviewData" labelColor="var(--app-color-master)" :hdLabelSize="30"
						:bdSize="28" bd-align="left" :labelWidth="136" :hdLabelWidth="136"
						:marginTop="30"></fui-preview>
				</view>
			</view>
		</view>
		<view class="page-footer">
			<button class="page-footer-btn" type="default" @click="submit"
				v-if="!(orderData.id)">{{$t('common.form.submit.order')}}</button>
			<button class="page-footer-btn btn-payment" type="default" @click="onPayment"
				v-else>{{$t('common.button.payment.pi')}}</button>
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
				options: {},
				orderData: {},
				orderPreviewData: {
					label: this.$t('common.order.info'),
					value: '',
					list: [{
						label: this.$t('common.order.total-quantity'),
						value: 'x0',
					}, {
						label: this.$t('common.order.total-price'),
						value: 'π 0.00',
					}, {
						label: this.$t('common.order.discount-amount'),
						value: 'π 0.00',
					}, {
						label: this.$t('common.button.payment.amount'),
						value: 'π 0.00',
						valueColor: 'var(--app-color-slave)',
					}, ],
					buttons: []
				},
				orderPanelData: {
					// head: this.$t('common.order.products'),
					head: '商户名称',
					list: [{
						src: '/static/images/common/logo.png',
						title: '商品名称',
						desc: '商品描述',
						source: 'π 0.00',
						time: 'x0',
						extra: '0.00'
					}, ]
				},
			};
		},
		computed: {},
		watch: {
			orderData: {
				handler(newVal, oldVal) {
					// console.log("---> orderData watch newVal: ", newVal);
					// console.log("---> orderData watch oldVal: ", oldVal);
					// 更新页面数据...
					this.syncOrderData(newVal);
				},
				immediate: true, // 初始化绑定时就会执行handler方法
				deep: true, // 对象中任一属性值发生变化，都会触发handler方法
			},
		},
		onLoad(options) {
			this.options = options;
		},
		onShow() {
			// console.log('---> onShow options :', this.options);
		},
		onReady() {},
		mounted() {
			this.getData();
		},
		methods: {
			getData() {
				const params = this.options;
				this.$api.order.confirmOrder(params).then((res) => {
					// console.log('---> request res :', res);
					const data = res.data?.data;
					// console.log('---> request data :', data);
					this.orderData = data;
				})
			},
			submit() {
				uni.showToast({
					title: this.$t('common.developing'),
					icon: 'none'
				})
				// return;
				const params = this.options;
				this.$api.order.submitOrder(params).then((res) => {
					// console.log('---> request res :', res);
					const data = res.data?.data;
					// console.log('---> request data :', data);
					this.orderData = data;
					// 跳转至支付页面
				})
			},
			onPayment() {
				const that = this;
				const paymentInfo = this.orderData?.paymentInfo;
				const amount = paymentInfo.amount;
				const memo = paymentInfo.subject;
				const metadata = paymentInfo.metadata;
				this.piPayment(amount, memo, metadata).then(function(res) {
					console.log('>>> pi pay() 支付成功', res);
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: `支付成功`
					});
					that.redirect('/pages/user/order/order');
				}).catch(function(err) {
					console.log('>>> Pi pay() 支付失败', err);
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: `支付失败: ${err}`
					});
					that.redirect('/pages/user/order/order');
				});
			},
			syncOrderData(orderData) {
				if (!orderData) {
					orderData = this.orderData;
				}
				// console.log('---> syncOrderData orderData :', orderData);
				// console.log('---> syncOrderData this.orderData :', this.orderData);
				const coin = this.coin;
				const merchant = orderData.merchant;
				const orderItems = orderData.items;
				// console.log('---> syncOrderData orderItems :', orderItems);
				let productItems = [];
				for (let i in orderItems) {
					const orderItem = orderItems[i];
					// console.log('---> syncOrderData orderItem :', orderItem);
					const productItem = {
						src: orderItem.productImage,
						title: orderItem.productName,
						desc: orderItem.promiseDeliveryTime,
						source: `${coin} ` + this.toFixed(orderItem.productPrice),
						time: 'x ' + orderItem.productQuantity,
						extra: `${coin} ` + this.toFixed(orderItem.subtotalAmount),
					}
					productItems.push(productItem);
				}
				this.orderPanelData.list = productItems;
				this.orderPanelData.head = merchant?.name;
				this.orderPreviewData.list[0].value = 'x ' + orderData.totalQuantity
				this.orderPreviewData.list[1].value = `${coin} ` + this.toFixed(orderData.totalPrice);
				this.orderPreviewData.list[2].value = `${coin} ` + this.toFixed(orderData.discountAmount);
				this.orderPreviewData.list[3].value = `${coin} ` + this.toFixed(orderData.totalAmount);
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
		z-index: 999;

		.page-footer-btn {
			font-size: 16px;
			color: #ffffff;
			background-color: var(--app-color-master);
			border-color: var(--app-color-master);
		}

		.btn-payment {
			background-color: #FAB249;
			border-color: #FAB249;
		}
	}

	.container {
		padding-bottom: 80px;
	}

	.order-wrap {
		margin: $uni-spacing-row-lg;
		// padding: $uni-spacing-row-lg;
	}

	::v-deep .fui-panel__wrap {
		border-radius: $uni-border-radius-lg;
	}

	::v-deep .fui-panel__mb-title {
		// 最多显示2行
		overflow: hidden;
		white-space: normal;
		text-align: left;
		word-wrap: break-word;
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	::v-deep .fui-panel__mb-info {
		justify-content: flex-end;
	}

	::v-deep .fui-preview__wrap {
		border-radius: $uni-border-radius-lg;
	}

	::v-deep .fui-preview__wrap .fui-preview__hd:first-child .fui-preview__item:first-child>.fui-preview__label {
		font-weight: bold;
	}

	::v-deep .fui-preview__btn {
		background-color: var(--app-color-master);
	}
</style>