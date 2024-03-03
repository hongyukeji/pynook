<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">
				<view class="fui-page-bd">
					<view class="fui-template__item" @tap="toRedirect(item)" v-for="(item,index) in menus" :key="index">
						<view class="fui-template__item-inner" :style="{background:item.background}">
							<image class="fui-icon" :src="`${resUrl}/template/light/icon_${item.src}_3x.png`"
								mode="widthFix"></image>
							<view class="fui-name__cn">{{item.cn}}</view>
							<view class="fui-name__en">{{item.en}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="page-footer"></view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				resUrl: '/static/images',
				menus: [{
					cn: this.$t('common.orders'),
					en: 'Orders',
					src: 'journalism',
					background: '#FFF7E5',
					page: '/pages/business/orders'
				}, {
					cn: this.$t('business.button.award-stamps'),
					en: 'Award Stamps',
					src: 'gateway',
					background: '#FFF4F4',
					page: 'scan://'
				}, {
					cn: this.$t('common.map'),
					en: 'Map',
					src: 'vote',
					background: '#FFF4F4',
					page: '/'
				}, {
					cn: this.$t('pages.business.profile'),
					en: 'Business Profile',
					src: 'gateway',
					background: '#F2FCF6',
					page: '/pages/business/profile'
				}, {
					cn: this.$t('common.products'),
					en: 'Products',
					src: 'shopping_mall',
					background: '#F6F7FF',
					page: '/pages/business/products'
				}, ],
				templateData: [{
					cn: '商城',
					en: 'MALL',
					src: 'shopping_mall',
					background: '#FFF7E5',
					page: ''
				}, {
					cn: '点餐',
					en: 'ORDER',
					src: 'order',
					background: '#FFF4F4',
					page: ''
				}, {
					cn: '聊天',
					en: 'CHAT',
					src: 'chat',
					background: '#F2FCF6',
					page: ''
				}, {
					cn: '短视频',
					en: 'SHORT VIDEO',
					src: 'short_video',
					background: '#FFF4F4',
					page: ''
				}, {
					cn: '新闻',
					en: 'NEWS',
					src: 'journalism',
					background: '#F6F7FF',
					page: ''
				}, {
					cn: '门户',
					en: 'PORTAL',
					src: 'gateway',
					background: '#F2FCF6',
					page: '/pages/nav/portal-nav/portal-nav'
				}, {
					cn: '登录',
					en: 'LOGIN',
					src: 'login',
					background: '#FFF7E5',
					page: '/pages/nav/login-nav/login-nav'
				}, {
					cn: '签到',
					en: 'SIGN IN',
					src: 'sign_in',
					background: '#F7F4FF',
					page: ''
				}, {
					cn: '投票',
					en: 'VOTE',
					src: 'vote',
					background: '#FFF4F4',
					page: ''
				}, {
					cn: '教育',
					en: 'EDUCATION',
					src: 'education',
					background: '#F6F7FF',
					page: ''
				}],
			};
		},
		onLoad() {},
		onShow() {},
		onReady() {},
		methods: {
			toRedirect(item) {
				console.log("toRedirect item:", item);
				const url = item.page;
				this.$utils.common.redirect(url);
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		font-weight: normal;
		background-color: $uni-background-color;
		box-sizing: border-box;
	}

	.page-wrap {}

	.page-hedaer {}

	.page-body {}

	.page-footer {}

	.container {
		margin: $uni-spacing-row-lg;
		// padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	}

	.fui-page-bd {
		display: flex;
		flex-wrap: wrap;
	}

	.fui-template__item {
		width: 50%;
		margin-bottom: 32rpx;
		box-sizing: border-box;
	}

	.fui-template__item:nth-of-type(odd) {
		padding-right: 15rpx;
	}

	.fui-template__item:nth-of-type(even) {
		padding-left: 15rpx;
	}

	.fui-template__item-inner {
		height: 176rpx;
		border-radius: 24rpx;
		overflow: hidden;
		position: relative;
		padding-left: 32rpx;
		box-sizing: border-box;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-icon {
		width: 64rpx;
		height: 64rpx;
		position: absolute;
		right: 32rpx;
		top: 32rpx;
	}

	.fui-name__cn {
		line-height: 32rpx;
		padding-top: 62rpx;
	}

	.fui-name__en {
		font-size: 24rpx;
		line-height: 24rpx;
		color: #B2B2B2;
		padding-top: 16rpx;
	}
</style>