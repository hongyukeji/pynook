import http from '@/common/request.js'

export default {
	getProductList: (data) => {
		return http.get('/api/product/list', {
			data: data
		})
	},
	getProductDetail: (data) => {
		return http.get('/api/product/detail', {
			data: data
		})
	},
}