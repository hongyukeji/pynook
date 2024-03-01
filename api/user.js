import http from '@/common/fui-request.js'

export default {
	getUserInfo: (data) => {
		return http.get('/api/user/getUserInfo', {
			data: data
		})
	},
}