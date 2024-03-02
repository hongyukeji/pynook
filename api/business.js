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
}