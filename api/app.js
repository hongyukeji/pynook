import http from '@/common/fui-request.js'

export default {
	getAppInfo: (data) => {
		return http.get('/api', {
			data: data
		})
	},
}