import http from '@/common/request.js'

export default {
	getCartList: (data) => {
		return http.get('/api/cart/getCartList', {
			data: data
		})
	},
	getCartTotalQuantity: (data) => {
		return http.get('/api/cart/getCartTotalQuantity', {
			data: data
		})
	},
	addCart: (data) => {
		return http.post('/api/cart/addCart', {
			data: data
		})
	},
	updateCart: (data) => {
		return http.post('/api/cart/updateCart', {
			data: data
		})
	},
	deleteCart: (data) => {
		return http.post('/api/cart/deleteCart', {
			data: data
		})
	},
}