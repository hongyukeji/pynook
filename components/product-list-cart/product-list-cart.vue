<template>
	<view class="items">
		<view class="item" v-for="(item,index) in items" :key="index">
			<view class="item-left">
				<slot name="item-left">
					<view class="item-image">
						<image class="image" :src="item.image" :mode="'aspectFill'" style="width: 100%;height: 100%;">
						</image>
					</view>
				</slot>
			</view>
			<view class="item-center">
				<slot name="item-center">
					<view class="item-name">
						{{item.name}}
					</view>
					<view class="item-price">
						π {{item.price}}
					</view>
					<view class="item-description">
						{{item.description}}
					</view>
				</slot>
			</view>
			<view class="item-right" style="display: none;">
				<slot name="item-right">
					<view class="item-btn" @click="$emit('updateItem', item)">
						<uni-icons class="btn-icon" type="compose" color="#656D76" size="24"></uni-icons>
					</view>
					<view class="item-btn" @click="$emit('deleteItem', item)">
						<uni-icons class="btn-icon" type="trash" color="#656D76" size="24"></uni-icons>
					</view>
				</slot>
			</view>
			<view class="item-header"></view>
			<view class="item-footer">

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "product-list",
		props: {
			items: {
				type: Array,
				default () {
					return []
				}
			},
		},
		data() {
			return {

			};
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
		}
	}
</style>