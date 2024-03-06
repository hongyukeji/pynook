export default {
	data() {
		return {
			systemLocale: 'auto',
			applicationLocale: 'auto',
			appName: getApp().globalData.app.name || '',
			appLogo: getApp().globalData.app.logo || '',
		};
	},
	computed: {
		locales() {
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
		}
	},
}