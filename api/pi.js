import http from '@/common/request.js'

export default {
	login: (data) => {
		return http.post('/api/pi/auth/login', {
			data: data
		})
	},
}