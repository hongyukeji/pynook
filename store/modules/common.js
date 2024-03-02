import api from '@/api'

// 子模块common路径：store/modules/common.js
export default {
	namespaced: true,
	state: {},
	getters: {
		commonData: state => {
			return JSON.parse(JSON.stringify(state));
		}
	},
	mutations: {
		setCommonData(state, commonData) {
			// console.log('---> setCommonData :', commonData);
			Object.keys(commonData).forEach(key => {
				state[key] = commonData[key];
			});
		},
	},
	actions: {
		getCommonData({
			commit
		}) {
			return new Promise((resolve, reject) => {
				api.common.getCommonData().then(res => {
					const commonData = res.data.data;
					// console.log('---> getCommonData :', commonData);
					commit('setCommonData', commonData);
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
	}
}