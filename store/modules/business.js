import api from '@/api'

export default {
	namespaced: true,
	state: {
		profile: {},
		profileFormData: {
			...uni.getStorageSync('BUSINESS_PROFILE_FORM_DATA')
		},
	},
	getters: {
		businessData: state => {
			return JSON.parse(JSON.stringify(state));
		}
	},
	mutations: {
		setBusinessData(state, data) {
			// console.log('---> setBusinessData :', data);
			Object.keys(data).forEach(key => {
				state[key] = data[key];
			});
		},
		setBusinessProfileFormData(state, formData) {
			// console.log('---> setBusinessProfileFormData :', formData);
			state.profileFormData = formData
			uni.setStorageSync('BUSINESS_PROFILE_FORM_DATA', formData);
		},
	},
	actions: {
		getBusinessData({
			commit
		}) {
			return new Promise((resolve, reject) => {
				api.business.getBusinessData().then(res => {
					const data = res.data.data;
					// console.log('---> getBusinessData :', data);
					commit('setBusinessData', data);
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		getBusinessProfileFormData({
			commit
		}) {
			return new Promise((resolve, reject) => {
				api.business.getBusinessProfileFormData().then(res => {
					const data = res.data.data;
					// console.log('---> getBusinessProfileFormData :', data);
					commit('setBusinessProfileFormData', data);
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
	}
}