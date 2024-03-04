import http from '@/common/request.js'

export default {
	getMerchantList: (data) => {
		return http.get('/api/merchant/list', {
			data: data
		})
	},
	getMerchantDetail: (data) => {
		return http.get('/api/merchant/detail', {
			data: data
		})
	},
	getMerchantTypeList: (data) => {
		return http.get('/api/merchant/type/list', {
			data: data
		})
	},
	getMerchantCategoryList: (data) => {
		return http.get('/api/merchant/category/list', {
			data: data
		})
	},
	getMerchantProductList: (data) => {
		return http.get('/api/merchant/product/list', {
			data: data
		})
	},
}