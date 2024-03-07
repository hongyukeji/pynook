<template>
	<!--@author: 鸿宇 @email: 1527200768@qq.com-->
	<view class="fui-wrap fui-page__bd">
		<view class="fui-banner__box">
			<image class="fui-banner" :src="`${resUrl}/my/light/img_banner_3x.png`" mode="widthFix"></image>
			<view class="fui-vip__box fui-page__spacing">
				<view class="fui-mod__box">
					<image class="fui-vip__bg" :src="`${resUrl}/my/light/img_mod_bg.png`"></image>
				</view>
				<view class="fui-vip__btn fui-flex__center" @tap="href('/pages/user/vip/vip')">
					<!-- #ifdef MP-BAIDU || MP-QQ || MP-TOUTIAO -->
					{{status==0?$t('common.vip.privilege'):$t('common.vip.open')}}
					<!-- #endif -->
					<!-- #ifndef MP-BAIDU || MP-QQ || MP-TOUTIAO -->
					{{$t('common.vip.open')}}
					<!-- #endif -->
				</view>
			</view>
			<view class="userinfo-wrap">
				<view class="userinfo">
					<view class="avatar-wrap" style="">
						<image class="avatar" :src="userData?.userInfo?.avatar || globalConfig?.app?.logo" :mode="'aspectFill'"
							style="width: 100%;height: 100%;">
						</image>
					</view>
					<view class="username">
						{{userData?.userInfo?.username || globalConfig?.app?.name}}
					</view>
					<view class="login-wrap" v-if="!userData.isLogin">
						<navigator :url="'/pages/auth/login'">{{$t('common.login')}}</navigator>
					</view>
					<view class="login-wrap" v-else>
						<view class="btn-item logout" @click="logout">
							{{$t('common.logout')}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fui-page__spacing">
			<view class="fui-menu__wrap fui-align__center">
				<view class="fui-menu__item" v-for="(item,index) in menus" :key="index" @click="href(item.page,$event)">
					<button open-type="feedback" class="fui-btn__feedback" v-if="index===2"></button>
					<view class="fui-menu__img fui-flex__center" :style="{background:item.background}">
						<image :src="`${resUrl}/my/light/icon_${item.src}_3x.png`" mode="widthFix"></image>
					</view>
					<text>{{item.text}}</text>
				</view>
			</view>
		</view>
		<view class="fui-list__wrap">
			<fui-list-cell @click="href(item.page)" arrow bottomRight="32" v-for="(item,index) in list" :key="index">
				<view class="fui-align__center">
					<image class="fui-list__icon" :src="`/static/images/my/light/icon_${item.src}_3x.png`"
						mode="widthFix"></image>
					<text class="fui-list__text" style="margin-right: -20rpx;">{{item.text}}</text>
				</view>
			</fui-list-cell>
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
	import $fui from '@/components/firstui/fui-clipboard';
	export default {
		components: {},
		data() {
			return {
				resUrl: '/static/images',
				menus: [{
					text: this.$t('common.balance'),
					background: '#FFFBF2',
					src: 'appreciate',
					page: '/pages/user/balance/balance'
				}, {
					text: this.$t('common.bill'),
					background: '#F6F7FF',
					src: 'proposal',
					page: '/pages/user/bill/bill'
				}, {
					text: this.$t('common.token'),
					background: '#FFF4F4',
					src: 'cooperation',
					page: '/pages/user/token/token'
				}, {
					text: this.$t('common.invite'),
					background: '#F2FCF6',
					src: 'share',
					page: '/pages/user/invite/invite'
				}, ],
				list: [{
					text: this.$t('common.order'),
					src: 'edition',
					page: '/pages/user/order/order'
				}, {
					text: this.$t('tabbar.message'),
					src: 'address',
					page: '/pages/user/message/message'
				}, {
					text: this.$t('common.sign'),
					src: 'partner',
					page: '/pages/user/sign/sign'
				}, {
					text: this.$t('common.locale'),
					src: 'partner',
					page: '/pages/locale/locale'
				}, {
					text: this.$t('common.help'),
					src: 'help',
					page: '/pages/help/help'
				}, {
					text: this.$t('common.about'),
					src: 'aboutus',
					page: '/pages/about/about'
				}]
			}
		},
		computed: {
			...mapState(['status']),
			...mapState({
				userData: state => state.user,
			}),
		},
		onLoad() {
			// #ifdef MP
			this.getStatus().then((res) => {})
			// #endif
		},
		onReady() {},
		methods: {
			...mapMutations('user', ['login', 'logout']),
			...mapActions(['getStatus']),
			href(page, e) {
				if (page === 'appreciate') {
					let urls = `${this.resUrl}/common/img_wxpay.png`
					// #ifdef MP-ALIPAY
					urls = `${this.resUrl}/common/img_alipay.png`
					// #endif

					// #ifdef MP-TOUTIAO || MP-BAIDU || MP-QQ
					if (this.status == 0) {
						this.fui.toast('感谢您的支持，暂不支持此功能！')
					} else {
						uni.previewImage({
							urls: [urls]
						});
					}
					// #endif

					// #ifndef MP-TOUTIAO || MP-BAIDU || MP-QQ
					uni.previewImage({
						urls: [urls]
					});
					// #endif
				} else if (page === 'feedback') {
					let text = '复制 Issue 链接地址';

					// #ifdef MP-TOUTIAO || MP-BAIDU
					//头条/百度文字length<=4
					text = '反馈链接';
					if (this.status == 0) {
						this.fui.toast('功能完善中~')
						return;
					}
					// #endif

					// #ifndef APP-PLUS || MP-WEIXIN || MP-QQ
					this.fui.modal('意见反馈', '在以任何形式的参与前，请先阅读文档开发指南。如有任何的意见或建议，欢迎您通过创建 Issue 的方式告知我们。', (res) => {
						if (res) {
							this.getLink('https://github.com/FirstUI/FirstUI/issues', e)
						}
					}, false, '', text)
					// #endif
				} else {
					// #ifdef MP-TOUTIAO || MP-BAIDU
					if (this.status == 0 && ~page.indexOf('share')) {
						this.fui.toast('功能完善中~')
						return;
					}
					// #endif
					this.fui.href(page)
				}
			},
			getLink(link, e) {
				$fui.getClipboardData(link, res => {
					this.fui.toast('链接复制成功');
				}, e);
			}
		},
		onShareAppMessage() {
			return {
				title: 'First UI组件库'
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {}

	.fui-banner__box {
		width: 100%;
		height: 512rpx;
		background: #EDF9FF;
		position: relative;
	}

	.fui-banner {
		width: 100%;
		height: 512rpx;
		display: block;
	}

	.fui-vip__box {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	.fui-mod__box {
		width: 100%;
		height: 124rpx;
		background: #31344D;
		border-radius: 16rpx 16rpx 0 0;
		overflow: hidden;
	}

	.fui-vip__bg {
		width: 100%;
		height: 124rpx;
		display: block;
	}

	.fui-vip__btn {
		font-size: 28rpx;
		color: #FFD694;
		position: absolute;
		height: 100%;
		right: 64rpx;
		top: 0;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-menu__wrap {
		height: 210rpx;
		background: #FFFFFF;
		box-shadow: 0 4rpx 8rpx 0 rgba(2, 4, 38, 0.05);
		border-radius: 0 0 16rpx 16rpx;
	}

	.fui-menu__item {
		flex: 1;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 24rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		position: relative;
	}

	.fui-menu__img {
		width: 96rpx;
		height: 96rpx;
		border-radius: 24rpx;
		margin-bottom: 16rpx;
	}

	.fui-menu__img image {
		width: 64rpx;
		height: 64rpx;
		display: block;
	}

	.fui-btn__feedback {
		background: transparent !important;
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
		border: 0;
		z-index: 1;
	}

	.fui-btn__feedback::after {
		border: 0;
	}

	.fui-list__wrap {
		padding-top: 32rpx;
	}

	.fui-list__icon {
		width: 48rpx;
		height: 48rpx;
	}

	.fui-list__text {
		padding-left: 24rpx;
	}

	.userinfo-wrap {
		position: absolute;
		top: 0px;
		// top: 15%;
		display: flex;
		// margin: $uni-spacing-row-lg;
		padding: $uni-spacing-row-lg;
		box-sizing: border-box;
		width: 100%;
	}

	.userinfo {
		width: 100%;
		background-color: #fff;
		padding: $uni-spacing-row-lg;
		border-radius: $uni-border-radius-lg;
		display: flex;
		align-items: center;
		position: relative;
		// background-color: transparent;
		opacity: 0.9;
	}

	.avatar-wrap {
		width: 60px;
		height: 60px;
		// border-radius: $uni-border-radius-circle;
		border-radius: $uni-border-radius-lg;
		overflow: hidden;
		margin-right: $uni-spacing-row-lg;
		border: 1px solid var(--app-color-slave);
		// border: 1px solid #EEEEEE;
		padding: 5px;
	}

	.avatar {}

	.username {
		color: var(--app-color-master);
	}

	.login-wrap {
		position: absolute;
		right: $uni-spacing-row-lg;
	}

	.btn-item {
		color: var(--app-color-slave);
	}
</style>