// @author: 鸿宇 @email: 1527200768@qq.com
import http from '@/components/firstui/fui-request'

//初始化请求配置项
http.create({
	host: 'http://localhost:8000',
	header: {
		// 'content-type': 'application/x-www-form-urlencoded',
		'Content-Type': 'application/json;charset=UTF-8'
	}
})
//请求拦截
http.interceptors.request.use(config => {
	//请求之前可在请求头中加入token等信息
	let token = uni.getStorageSync('token') || '';
	if (config.header) {
		config.header['Authorization'] = token
	} else {
		config.header = {
			'Authorization': token
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
