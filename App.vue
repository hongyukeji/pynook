<!--@author: 鸿宇 @email: 1527200768@qq.com-->
<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//App2.6.5+ 仅iOS
			// #ifndef APP-PLUS || H5
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate((res) => {
					if (res.hasUpdate) {
						updateManager.onUpdateReady(() => {
							this.fui.modal('更新提示', '发现新版本，为了获得更好的体验，建议立即更新', (res) => {
								updateManager.applyUpdate();
							});
						});
						updateManager.onUpdateFailed(() => {
							this.fui.modal('更新失败', '新版本更新失败，请稍后再试或删除小程序重新搜索打开',
								(res) => {});
						});
					}
				});
			}
			// #endif
		},
		onShow: function() {

		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	@import '@/common/fui-app.css';
	@import '@/components/firstui/fui-theme/fui-theme.css';
	/*自定义字体css */
	@import '@/static/icon/fui-custom-icon.css';
	/* 阿里字体库css */
	@import "@/static/font/iconfont.css";
	/* 在线引用阿里字体库 */
	/* @import url(//at.alicdn.com/t/c/font_4443434_ms10k34ajl8.css); */
	/*每个页面公共css */
</style>
