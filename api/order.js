import http from '@/common/request.js'

export default {
	confirmOrder: (data) => {
		return http.post('/api/order/confirm', {
			data: data
		})
	},
	submitOrder: (data) => {
		return http.post('/api/order/submit', {
			data: data
		})
	},
	getOrderList: (data) => {
		return http.get('/api/order/getOrderList', {
			data: data
		})
	},
	getOrderDetail: (data) => {
		return http.get('/api/order/getOrderDetail', {
			data: data
		})
	},
}