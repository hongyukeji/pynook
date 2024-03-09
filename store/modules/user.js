import api from '@/api'

// 子模块user路径：store/modules/user.js
export default {
	namespaced: true,
	state: {
		// 是否登录
		isLogin: uni.getStorageSync("TOKEN") ? true : false,
		// 令牌
		token: uni.getStorageSync('TOKEN') || '',
		// 用户信息
		userInfo: uni.getStorageSync('USER_INFO') || {},
		// 是否商户
		isMerchant: uni.getStorageSync("IS_MERCHANT") ? true : false,
	},
	getters: {
		userData: state => {
			return JSON.parse(JSON.stringify(state));
		}
	},
	mutations: {
		// 登录
		login(state, payload) {
			console.log('---> login payload :', payload);
			if (payload) {
				Object.keys(payload).forEach(key => {
					state[key] = payload[key];
				});
				state.userInfo = payload.userInfo
				uni.setStorageSync('USER_INFO', payload.userInfo)
				state.token = payload.token
				uni.setStorageSync('TOKEN', payload.token)
			}
			state.isLogin = true;
			// 同步用户业务信息
			this.dispatch('user/syncUserBusinessInfo');
		},
		// 退出登录
		logout(state) {
			state.isLogin = false;
			state.token = "";
			state.userInfo = {};
			state.isMerchant = false
			uni.removeStorageSync('TOKEN');
			uni.removeStorageSync('USER_INFO');
			uni.removeStorageSync('IS_MERCHANT');
		},
		// 设置用户信息
		setUserInfo(state, userInfo) {
			// console.log('---> setUserInfo :', userInfo);
			state.userInfo = userInfo;
		},
		// 设置用户业务信息
		setUserMerchantInfo(state, isMerchant) {
			// console.log('---> setUserMerchantInfo isMerchant :', isMerchant);
			state.isMerchant = isMerchant;
			uni.setStorageSync('IS_MERCHANT', isMerchant);
		},
	},
	actions: {
		// 获取用户信息
		getUserInfo({
			commit
		}) {
			return new Promise((resolve, reject) => {
				api.user.getUserInfo().then(res => {
					const userInfo = res.data.data;
					// console.log('---> getUserInfo :', userInfo);
					commit('setUserInfo', userInfo);
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 同步用户业务信息
		syncUserBusinessInfo({
			state,
			commit
		}) {
			return new Promise((resolve, reject) => {
				// 未登陆清除用户业务信息标记
				if (!state.isLogin) {
					uni.removeStorageSync('IS_MERCHANT');
					return null;
				}
				api.business.getBusinessData().then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					// 判断是否是商户
					let isMerchant = false;
					if (data.merchantId && data.merchantId > 0) {
						isMerchant = true
					} else {
						isMerchant = false
					}
					commit('setUserMerchantInfo', isMerchant);
				})
			})
		},
	},
}