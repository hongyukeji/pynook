import api from '@/api'

// 子模块app路径：store/modules/app.js
export default {
	namespaced: true,
	// state：提供唯一的公共数据源，所有共享的数据都要统一放到store中的state存储
	// 公共的变量，这里的变量不能随便修改，只能通过触发mutations的方法才能改变
	state: {
		...{
			name: '',
			version: '',
		},
		// ...uni.getStorageSync('appInfo')
	},
	// getters 用于对store中的已有数据进行加工处理形成新的数据，如果store中的数据发生变化
	getters: {
		appInfo: state => {
			return JSON.parse(JSON.stringify(state));
		}
	},
	// mutations 同步变更state数据，传多个参数需要用对象的方式
	// 相当于同步的操作
	mutations: {
		// 设置应用信息
		setAppInfo(state, appInfo) {
			console.log('---> setAppInfo :', appInfo);
			Object.keys(appInfo).forEach(key => {
				state[key] = appInfo[key];
			});
			// uni.setStorageSync('appInfo', appInfo);
		},
	},
	// actions 异步变更state数据
	// 相当于异步的操作,不能直接改变state的值，只能通过触发mutations的方法才能改变
	actions: {
		// 获取应用信息
		getAppInfo({
			commit
		}) {
			return new Promise((resolve, reject) => {
				api.app.appInfo().then(res => {
					const appInfo = res.data.data;
					console.log('---> getAppInfo :', appInfo);
					commit('setAppInfo', appInfo);
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
	}
}