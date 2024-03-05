import http from '@/common/request.js'

export default {
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