import api from '@/api'

// 子模块user路径：store/modules/user.js
export default {
	namespaced: true,
	state: {
		// 用户信息
		userInfo: {},
		// 是否登录
		isLogin: uni.getStorageSync("token") ? true : false,
		// 令牌
		token: uni.getStorageSync('token') || '',
	},
	getters: {
		userData: state => {
			return JSON.parse(JSON.stringify(state));
		}
	},
	mutations: {
		// 登录
		login(state, payload) {
			if (payload) {
				state.userInfo = payload.userInfo
				state.token = payload.token
				uni.setStorageSync('token', payload.token)
			}
			state.isLogin = true
		},
		// 退出登录
		logout(state) {
			state.token = ""
			state.isLogin = false
			uni.removeStorageSync('token')
		},
		// 设置用户信息
		setUserInfo(state, userInfo) {
			// console.log('---> setUserInfo :', userInfo);
			state.userInfo = userInfo;
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
	}
}