// @author: 鸿宇 @email: 1527200768@qq.com
import http from '@/components/firstui/fui-request'
import utils from '@/utils'

//初始化请求配置项
http.create({
	host: utils.common.getApiUrl() || '',
	header: {
		// 'content-type': 'application/x-www-form-urlencoded',
		// 'content-type': 'application/json'
	}
})
//请求拦截
http.interceptors.request.use(config => {
	//请求之前可在请求头中加入token等信息
	// const tokenPrefix = "Bearer ";
	// const token = uni.getStorageSync('token') || '';
	const token = utils.common.getToken();
	if (token && token != '') {
		if (config.header) {
			config.header['Authorization'] = token
		} else {
			config.header = {
				'Authorization': token
			}
		}
	}
	return config
})
//响应拦截
http.interceptors.response.use(response => {
	//TODO
	return response
}, (err) => {
	//错误响应：断网、错误域名等
	return Promise.reject(err)
})

export default http