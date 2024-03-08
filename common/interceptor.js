import utils from '@/utils'
import store from '@/store'

// 引入的js文件中使用国际化
import {
	initVueI18n
} from '@dcloudio/uni-i18n'
import messages from '@/locale/index'
const {
	t
} = initVueI18n(messages)

// 需要登陆列表
let needLoginList = [
	"/pages/user/**",
	"/pages/business/**",
]

// 白名单列表
const whiteList = [
	'/', // 注意入口页必须直接写 '/'
	"/pages/index/index",
	"/pages/auth/login",
	"/pages/auth/register",
	"/pages/auth/**",
	"/pages/user/user",
]

export default async function() {
	// 页面拦截
	let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
	list.forEach(item => { //用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
		// console.log(item, 'router list item')
		uni.addInterceptor(item, {
			invoke(e) { // 调用前拦截
				//获取用户的token
				// console.log(e, 'routerjs invoke')
				const token = localStorage.getItem('token')
				//获取当前页面路径（即url去掉"?"和"?"后的参数）
				// console.log(token, 'router index token')
				// 网址
				const url = e.url.split('?')[0]
				// console.log(url, 'router index url')
				// 是否需要登陆： false-否（默认）
				let isNeedLogin = false
				// 如果存在需要登陆列表中 needLoginList.includes(url) || needLoginList.indexOf(url) !== -1
				if (utils.common.checkUrlPattern(url, needLoginList)) {
					isNeedLogin = true;
					// console.log('-> 是否需要登陆：', isNeedLogin)
				}
				// 如果存在白名单列表中
				if (utils.common.checkUrlPattern(url, whiteList)) {
					isNeedLogin = false;
					// console.log(-> 是否白名单：'), isNeedLogin
				}
				//判断要打开的页面是否需要验证登录 (token == '' || !token)
				if (isNeedLogin && utils.common.isEmpty(token)) {
					uni.showToast({
						title: t('pages.auth.please-login') || '请登录',
						icon: 'none'
					})
					utils.common.toLoginPage(url);
					return false
				}
				return true
			},
			fail(err) { // 失败回调拦截 
				console.log(err);
			},
		})
	})

	// 请求拦截
	uni.addInterceptor('request', {
		invoke(args) {
			// console.log('interceptor-invoke', args)
			// request 触发前拼接 url 
			// args.url = 'https://www.example.com/' + args.url
		},
		success(res) {
			// console.log('interceptor-success', res)
			// uni.hideLoading();
			// const message = res.data?.message || t('common.request-failed');
			// const data = res.data?.data;
			if (res.data?.code == 401) {
				store.commit('user/logout');
				utils.common.toLoginPage();
				throw new Error(`[request] ${message}`);
			}
			if (res.data?.code != 200) {
				if (res.data?.message) {
					uni.showToast({
						title: res.data?.message,
						icon: 'none'
					})
				}
				// throw new Error(`[request] ${message}`);
			}
		},
		fail(err) {
			// console.log('interceptor-fail', err)
		},
		complete(res) {
			// console.log('interceptor-complete', res)
			uni.hideLoading();
		}
	})

}