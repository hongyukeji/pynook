import http from '@/common/request.js'

export default {
	login: (data) => {
		return http.post('/api/auth/login', {
			data: data
		})
	},
	register: (data) => {
		return http.post('/api/auth/register', {
			data: data
		})
	},
}