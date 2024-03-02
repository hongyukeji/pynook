import http from '@/common/request.js'

export default {
	getBusinessData: (data) => {
		return http.get('/api/business/getBusinessData', {
			data: data
		})
	},
	setBusinessData: (data) => {
		return http.post('/api/business/setBusinessData', {
			data: data
		})
	},
	getBusinessProfileFormData: (data) => {
		return http.get('/api/business/getBusinessProfileFormData', {
			data: data
		})
	},
}