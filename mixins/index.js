import pisdk from '@/common/pisdk.js';

export default {
	data() {
		return {
			systemLocale: 'auto',
			applicationLocale: 'auto',
			// appName: getApp().globalData?.app?.name || '',
			// appLogo: getApp().globalData?.app?.logo || '',
			// appName: this.globalConfig?.app?.name || '',
			// appLogo: this.globalConfig?.app?.logo || '',
			// appVersion: this.globalConfig?.app?.version || '',
			coin: this.globalConfig?.app?.coin || 'π',
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
		},
		isPiBrowser() {
			return pisdk.isPiBrowser();
		},
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
		toPrice(amount) {
			return this.$utils.common.toPrice(amount);
		},
		redirect(url, that, params) {
			return this.$utils.common.redirect(url, that, params);
		},
		/**
		 * pi支付
		 */
		piPayment(amount, memo, metadata) {
			console.log('进入pi支付流程...');
			console.log(result);
			uni.hideLoading();

			let that = this;
			let paymentInfo = {
				amount: amount,
				memo: memo,
				metadata: metadata,
			}
			pisdk.loadScript().then(function() {
				console.log('---> pi loadScript()');
				console.log('---> pi payment()');
				uni.showLoading({
					title: "正在唤醒支付..."
				});
				pisdk.payment(paymentInfo, {
					onReadyForServerApproval: async function(paymentId) {
						console.log('onReadyForServerApproval');
						console.log('批准付款');
						console.log(`paymentId：${paymentId}`);

						const formData = {
							paymentId: paymentId,
						};
						that.$api.pi.approve(formData).then((res) => {
							console.log('---> request res :', res);
							const data = res.data?.data;
							// console.log('---> request data :', data);
						});

					},
					onReadyForServerCompletion: async function(paymentId, txid) {
						console.log('onReadyForServerCompletion');
						console.log('完成付款');
						console.log(`paymentId：${paymentId}`);
						console.log(`txid：${txid}`);

						const formData = {
							paymentId: paymentId,
							txid: txid,
						};
						that.$api.pi.complete(formData).then((res) => {
							console.log('---> request res :', res);
							const data = res.data?.data;
							// console.log('---> request data :', data);
							if (data?.transaction?.verified || data?.transaction
								?.verified) {
								uni.showToast({
									icon: 'none',
									title: '支付成功'
								});
							} else {
								uni.showToast({
									icon: 'none',
									title: '完成付款失败，请稍后再试！'
								});
							}
						});
					},
					onIncompletePaymentFound: async function(payment) {
						console.log('onIncompletePaymentFound');
						console.log('发现未完成付款...');
						console.log('>>> Pi onIncompletePaymentFound payment: ', payment);

						let paymentId = payment.identifier;
						let txid = payment.transaction.txid;

						// TODO: 发现未完成付款业务代码...
						const formData = {
							paymentId: paymentId,
							txid: txid,
						};
						that.$api.pi.complete(formData).then((res) => {
							// console.log('---> request res :', res);
							const data = res.data?.data;
							// console.log('---> request data :', data);
							if (data?.transaction?.verified || data?.transaction
								?.verified) {
								uni.showToast({
									icon: 'none',
									title: '未付款订单处理成功，请重新发起付款'
								});
							} else {
								uni.showToast({
									icon: 'none',
									title: '未付款订单处理失败，请稍后再试！'
								});
							}
						});

					},
					onCancel: function(paymentId) {
						console.log('>>> Pi onCancel ...');
						uni.showToast({
							icon: 'none',
							title: `用户取消付款`
						});
					},
					onError: function(error, payment) {
						console.log('>>> Pi onError ...');
						uni.showToast({
							icon: 'none',
							title: `支付异常 ${error}`
						});
					},
				}).then(function(res) {
					console.log('>>> pi pay() 支付成功', res);
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: `支付成功`
					});
				}).catch(function(err) {
					console.log('>>> Pi pay() 支付失败', err);
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: `支付失败: ${err}`
					});
				}).finally(function() {
					uni.hideLoading();
				});

				setTimeout(res => {
					uni.hideLoading();
				}, 5000)
			}).catch(function(err) {
				console.error(`>>> Pi环境加载失败 ${err}`);
				uni.showToast({
					icon: 'none',
					title: `Pi环境加载失败 ${err}`
				});
			});
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