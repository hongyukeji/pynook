<template>
	<view class="items">
		<view class="item" v-for="(item,index) in items" :key="index">
			<view class="item-left">
				<slot name="item-left">
					<view class="item-image" @click="itemPreviewImage(item.image)">
						<image class="image" :src="item.image" :mode="'aspectFill'" style="width: 100%;height: 100%;">
						</image>
					</view>
				</slot>
			</view>
			<view class="item-center">
				<slot name="item-center">
					<view class="item-info">
						<view class="item-name">
							{{item.name}}
						</view>
						<view class="item-price">
							π {{item.price}}
						</view>
						<view class="item-description">
							{{item.description}}
						</view>
					</view>
					<view class="item-cart" v-if="type == 'cart'">
						<template v-if="cartItemQuantity(item) > 0">
							<view class="item-cart-number">
								<view class="item-cart-number-box">
									{{cartItemQuantity(item)}}
								</view>
							</view>
							<view class="item-cart-btn">
								<view class="item-cart-btn-delete"
									@click="deleteCartItem(item.quantity, index, item.id)">
									<uni-icons class="btn-icon" type="trash" color="var(--app-color-master)"
										size="24"></uni-icons>
								</view>
							</view>
						</template>
						<template v-else>
							<view class="item-cart-number">
								<fui-input-number v-model="item.quantity" custom backgroundColor="#FFF" :size="30"
									:width="120" margin="0" :radius="8" :min="0" :max="999999999"
									color="var(--app-color-master)" :index="index" :params="item.id"
									@change="updateCartItem">
									<uni-icons class="btn-icon" type="minus-filled" color="var(--app-color-master)"
										size="30"></uni-icons>
									<template v-slot:plus>
										<uni-icons class="btn-icon" type="plus-filled" color="var(--app-color-master)"
											size="30"></uni-icons>
									</template>
								</fui-input-number>
							</view>
							<view class="item-cart-btn">
								<view class="item-cart-btn-add" @click="addCartItem(item.quantity, index, item.id)">
									<uni-icons class="btn-icon" type="cart" color="#fff" size="24"></uni-icons>
								</view>
							</view>
						</template>
					</view>
				</slot>
			</view>
			<view class="item-right" v-if="type == 'manage'">
				<slot name="item-right">
					<view class="item-manage">
						<view class="item-btn" @click="$emit('updateItem', item)">
							<uni-icons class="btn-icon" type="compose" color="#656D76" size="24"></uni-icons>
						</view>
						<view class="item-btn" @click="$emit('deleteItem', item)">
							<uni-icons class="btn-icon" type="trash" color="#656D76" size="24"></uni-icons>
						</view>
					</view>
				</slot>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		name: "product-list",
		props: {
			type: {
				type: String,
				default () {
					// manage ｜ cart
					return ""
				}
			},
			items: {
				type: Array,
				default () {
					return []
				}
			},
			cartList: {
				type: [Array],
				default () {
					return []
				}
			},
		},
		data() {
			return {};
		},
		computed: {
			cartItemQuantity() {
				return (item) => {
					for (let cart of this.cartList) {
						if (cart.productId == item.id) {
							return cart.quantity;
						}
					}
					return 0;
				}
			}
		},
		methods: {
			itemPreviewImage(url) {
				uni.previewImage({
					current: url,
					loop: true,
					urls: [url]
				})
			},
			addCartItem(value = 0, index, params) {
				console.log('---> addCartItem :', value, index, params);
				// const quantity = String(value).replace(/\.(\d*)/, '').replace(/[^\d]/g, '');
				// console.log('---> quantity :', quantity);
				const item = this.items[index];
				this.$emit('addCartItem', item, value, params);
			},
			deleteCartItem(value = 0, index, params) {
				console.log('---> deleteCartItem :', value, index, params);
				// const quantity = String(value).replace(/\.(\d*)/, '').replace(/[^\d]/g, '');
				// console.log('---> quantity :', quantity);
				const item = this.items[index];
				this.$emit('deleteCartItem', item, value, params);
			},
			updateCartItem({
				value = 0,
				index,
				params
			}) {
				// console.log('---> updateCartItem :', value, index, params);
				// const quantity = String(value).replace(/\.(\d*)/, '').replace(/[^\d]/g, '');
				// console.log('---> quantity :', quantity);
				const item = this.items[index];
				this.$emit('updateCartItem', item, value, params);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.items {
		.item {
			display: flex;
			margin: $uni-spacing-col-lg auto;

			.item-left {
				.item-image {
					width: 80px;
					height: 80px;
					border-radius: $uni-border-radius-lg;
					overflow: hidden;
					background-color: $uni-bg-color;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.item-center {
				flex: 1;
				padding: 0 $uni-spacing-col-base;

				.item-name {
					color: var(--app-color-master);
					font-size: 14px;
					font-weight: normal;
					// 最多显示1行
					overflow: hidden;
					white-space: normal;
					text-align: left;
					word-wrap: break-word;
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}

				.item-description {
					color: $uni-text-color-grey;
					font-size: 12px;
					font-weight: normal;
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

				.item-price {
					color: var(--app-color-slave);
					font-size: 16px;
					font-weight: normal;
				}
			}

			.item-right {
				.item-btn {
					padding: $uni-spacing-col-sm;
				}
			}

			.item-cart {
				display: flex;
				align-items: center;
				// justify-content: space-between;
				justify-content: flex-end;

				.item-cart-number {
					display: flex;
					align-items: center;
					margin-right: $uni-spacing-row-lg;

					.btn-icon {
						margin: 0 10px;
					}
				}

				.item-cart-number-box {
					display: flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
					min-width: 35px;
					min-height: 35px;
					color: var(--app-color-master);
					border: 1px solid var(--app-color-master);
					border-color: var(--app-color-master);
					background-color: var(--app-color-slave);
					border-radius: $uni-border-radius-lg;
				}

				.item-cart-btn {
					.item-cart-btn-add {
						color: var(--app-text-color-white);
						border-color: var(--app-color-master);
						background-color: var(--app-color-master);
						padding: 5px 10px;
						border-radius: $uni-border-radius-lg;
					}

					.item-cart-btn-delete {
						padding: 5px 10px;
					}
				}
			}
		}
	}
</style>