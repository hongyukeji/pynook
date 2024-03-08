import http from '@/common/request.js'

export default {
	getUserInfo: (data) => {
		return http.get('/api/user/getUserInfo', {
			data: data
		})
	},
	setUserInfo: (data) => {
		return http.post('/api/user/setUserInfo', {
			data: data
		})
	},
	getUserOrderList: (data) => {
		return http.get('/api/user/order/list', {
			data: data
		})
	},
	getUserOrderDetail: (data) => {
		return http.get('/api/user/order/detail', {
			data: data
		})
	},
}