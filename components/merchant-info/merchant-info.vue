<template>
	<fui-card :margin="['0rpx','0rpx']" color="var(--app-color-master)" :size="35" :width="155" :height="155"
		:src="merchant.image || globalConfig?.app?.logo" :title="merchant.name" :tag="merchant.distance"
		@click="onClickCard" v-bind="$attrs">
		<view class="fui-card__content">
			<uni-icons class="" type="location" color="var(--app-color-slave)" size="18"></uni-icons>
			{{merchant.address}}
		</view>
		<view class="fui-card__content" @click="onClickTelephone(merchant.telephone)">
			<uni-icons class="" type="phone" color="var(--app-color-slave)" size="18"></uni-icons>
			{{merchant.telephone}}
		</view>
		<view class="fui-card__content">
			<uni-icons class="" type="info" color="var(--app-color-slave)" size="18"></uni-icons>
			{{merchant.introduction}}
		</view>
	</fui-card>
</template>

<script>
	export default {
		name: "merchant-info",
		props: {
			merchant: {
				type: Object,
				default () {
					return {}
				}
			},
		},
		data() {
			return {};
		},
		methods: {
			onClickCard(index) {},
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .fui-card__header-title {
		font-weight: bold;
	}

	.fui-card__content {
		color: $uni-text-color-placeholder;
		font-weight: normal;
		font-size: 14px;
		margin: 20rpx 20rpx;
		box-sizing: border-box;
	}
</style>