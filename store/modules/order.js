import api from '@/api'

export default {
	namespaced: true,
	state: {},
	getters: {
		data: state => {
			return JSON.parse(JSON.stringify(state));
		}
	},
	mutations: {
		setData(state, data) {
			// console.log('---> setData :', data);
			Object.keys(data).forEach(key => {
				state[key] = data[key];
			});
		},
	},
	actions: {
		getData({
			commit
		}) {
			return new Promise((resolve, reject) => {
				api.example.getData().then(res => {
					const data = res.data.data;
					// console.log('---> getData :', data);
					commit('setData', data);
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
	}
}