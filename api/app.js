import http from '@/common/request.js'

export default {
	getAppData: (data) => {
		return http.get('/api', {
			data: data
		})
	},
}