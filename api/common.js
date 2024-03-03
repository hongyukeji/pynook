import http from '@/common/request.js'

export default {
	getCommonData: (data) => {
		return http.get('/api/common/getCommonData', {
			data: data
		})
	},
	uploadFile: (data) => {
		return http.post('/api/common/uploadFile', {
			data: data
		})
	},
}