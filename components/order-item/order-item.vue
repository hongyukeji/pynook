<template>
	<view class="order-item">
		<fui-card :src="order?.merchant?.image" :title="order?.merchant?.name || '平台商户'" :tag="order?.createdAt">
			<view class="fui-card__content">
				<fui-preview :marginTop="0" :marginBottom="0" :previewData="orderData" :isBorder="false">
				</fui-preview>
				<fui-collapse-item @change="change" v-if="order.items && order.items.length > 0">
					<view class="fui-item__box">
						<text class="" style="color: var(--fui-color-link);">查看订单商品</text>
					</view>
					<template v-slot:content>
						<fui-panel :panelData="orderItemData" :marginTop="30" :size="26" :radius="12" :headSize="30"
							headColor="var(--app-color-master)" :descSize="24" descColor="var(--fui-color-subtitle)"
							:infoSize="26" infoColor="var(--app-color-slave)">
						</fui-panel>
					</template>
				</fui-collapse-item>
			</view>
		</fui-card>
	</view>
</template>

<script>
	export default {
		name: "order-item",
		props: {
			order: {
				type: Object,
				default () {
					return {}
				}
			},
		},
		data() {
			return {};
		},
		computed: {
			orderData() {
				const coin = this.globalConfig?.app?.coin;
				const order = this.order;
				const orderData = {
					label: '订单金额',
					value: `${coin} ` + this.toFixed(order?.totalAmount),
					list: [{
						label: this.$t('common.order.total-quantity'),
						value: 'x ' + order?.totalQuantity,
					}, {
						label: this.$t('common.order.total-price'),
						value: `${coin} ` + this.toFixed(order?.totalPrice),
					}, {
						label: this.$t('common.order.discount-amount'),
						value: `${coin} ` + this.toFixed(order?.discountAmount),
					}, {
						label: this.$t('common.button.payment.amount'),
						value: `${coin} ` + this.toFixed(order?.totalAmount),
						valueColor: 'var(--app-color-slave)',
					}, {
						label: this.$t('common.order.status'),
						value: order?.status <= 0 ? '待支付' : '已支付',
					}, ],
				}
				return orderData;
			},
			orderItemData() {
				const coin = this.globalConfig?.app?.coin;
				const orderItems = this.order.items;
				let items = [];
				for (let i in orderItems) {
					const orderItem = orderItems[i];
					const item = {
						src: orderItem.productImage,
						title: orderItem.productName,
						desc: orderItem.promiseDeliveryTime,
						source: `${coin} ` + this.toFixed(orderItem.productPrice),
						time: 'x ' + orderItem.productQuantity,
						extra: `${coin} ` + this.toFixed(orderItem.subtotalAmount),
					}
					items.push(item);
				}
				const orderItemData = {
					// head: '',
					list: items
				}
				return orderItemData;
			},
		},
	}
</script>

<style lang="scss" scoped>
	.order-item {
		// margin: $uni-spacing-col-lg;
		margin: $uni-spacing-col-lg auto;

		.fui-item__box {
			width: 100%;
			padding: 26rpx 32rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
		}

		.fui-logo {
			width: 48rpx;
			height: 48rpx;
			margin-right: 24rpx;
			display: block;
		}

		.fui-descr {
			width: 100%;
			padding: 32rpx;
			font-size: 28rpx;
			line-height: 52rpx;
			color: #7F7F7F;
			word-break: break-all;
			box-sizing: border-box;
		}
	}
</style>