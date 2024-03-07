export default {
	data() {
		return {
			systemLocale: 'auto',
			applicationLocale: 'auto',
			// appName: getApp().globalData?.app?.name || '',
			// appLogo: getApp().globalData?.app?.logo || '',
			// appName: globalConfig?.app?.name || '',
			// appLogo: globalConfig?.app?.logo || '',
			// appVersion: globalConfig?.app?.version || '',
		};
	},
	computed: {
		applicationLocales() {
			return [{
					text: this.$t('locale.auto'),
					code: 'auto'
				}, {
					text: this.$t('locale.en'),
					code: 'en'
				},
				{
					text: this.$t('locale.zh-hans'),
					code: 'zh-Hans'
				},
				{
					text: this.$t('locale.zh-hant'),
					code: 'zh-Hant'
				},
				{
					text: this.$t('locale.ja'),
					code: 'ja'
				}
			]
		}
	},
	created() {
		// console.log("全局混入");
		this.initLocale();
	},
	methods: {
		initLocale() {
			let systemInfo = uni.getSystemInfoSync();
			this.systemLocale = systemInfo.language;
			this.applicationLocale = uni.getLocale();
			this.isAndroid = systemInfo.platform.toLowerCase() === 'android';
			uni.onLocaleChange((e) => {
				this.applicationLocale = e.locale;
			})
		},
		onLocaleChange(e) {
			if (this.isAndroid) {
				uni.showModal({
					content: this.$t('index.language-change-confirm'),
					success: (res) => {
						if (res.confirm) {
							uni.setLocale(e.code);
						}
					}
				})
			} else {
				uni.setLocale(e.code);
				this.$i18n.locale = e.code;
			}
		},
		printUserAgent() {
			let that = this;
			let userAgent = window.navigator.userAgent.toLowerCase();
			console.log('---> userAgent', userAgent);
			// alert(JSON.stringify(userAgent));
			uni.showModal({
				title: this.$t('common.tips'),
				content: JSON.stringify(userAgent),
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		async initGlobalData() {
			// 获取公共数据
			await this.$store.dispatch('common/getCommonData');
			// 从 Vuex 中获取模块数据
			const commonData = this.$store.getters['common/commonData'];
			// 将模块数据挂载到 globalData 中，配置会覆盖本地的配置项
			// this.globalData.common = commonData;
			Object.keys(commonData).forEach(key => {
				this.globalData[key] = Object.assign(this.globalData[key] || {}, commonData[key]);
			});
		},
	},
}