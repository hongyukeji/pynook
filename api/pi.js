import http from '@/common/request.js'

export default {
	login: (data) => {
		return http.post('/api/pi/auth/login', {
			data: data
		})
	},
	approve: (data) => {
		return http.post('/api/payment/approve', {
			data: data
		})
	},
	complete: (data) => {
		return http.post('/api/payment/complete', {
			data: data
		})
	},
}