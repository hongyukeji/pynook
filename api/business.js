import http from '@/common/request.js'

export default {
	getBusinessList: (data) => {
		return http.get('/api/business/list', {
			data: data
		})
	},
	getBusinessDetail: (data) => {
		return http.get('/api/business/getBusinessDetail', {
			data: data
		})
	},
	getBusinessData: (data) => {
		return http.get('/api/pi/business/getBusinessData', {
			data: data
		})
	},
	setBusinessData: (data) => {
		return http.post('/api/pi/business/setBusinessData', {
			data: data
		})
	},
	getMerchantProductList: (data) => {
		return http.get('/api/pi/business/getMerchantProductList', {
			data: data
		})
	},
	getMerchantProductDetail: (data) => {
		return http.get('/api/pi/business/getMerchantProductDetail', {
			data: data
		})
	},
	addMerchantProduct: (data) => {
		return http.post('/api/pi/business/addMerchantProduct', {
			data: data
		})
	},
	updateMerchantProduct: (data) => {
		return http.post('/api/pi/business/updateMerchantProduct', {
			data: data
		})
	},
	deleteMerchantProduct: (data) => {
		return http.post('/api/pi/business/deleteMerchantProduct', {
			data: data
		})
	},
	getMerchantOrderList: (data) => {
		return http.get('/api/pi/business/getMerchantOrderList', {
			data: data
		})
	},
	getMerchantOrderDetail: (data) => {
		return http.get('/api/pi/business/getMerchantOrderDetail', {
			data: data
		})
	},
}