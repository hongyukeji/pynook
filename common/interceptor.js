// 引入的js文件中使用国际化
import {
	initVueI18n
} from '@dcloudio/uni-i18n'
import messages from '@/locale/index'
const {
	t
} = initVueI18n(messages)

// 检查 URL 是否匹配给定的列表
function checkUrlPattern(url, list) {
	for (let i = 0; i < list.length; i++) {
		const pattern = list[i].replace(/\*\*/g, '.*'); // 将 ** 替换为正则表达式 .*，表示匹配任意字符
		const regex = new RegExp('^' + pattern + '$'); // 创建正则表达式对象
		if (regex.test(url)) {
			return true;
		}
	}
	return false;
}

// 检查变量是否为空
function isEmpty(variable) {
	// 判断变量是否为 null 或者 undefined
	if (variable === null || variable === undefined) {
		return true;
	}

	// 判断字符串是否为空
	if (typeof variable === 'string' && variable.trim() === '') {
		return true;
	}

	// 判断数组是否为空
	if (Array.isArray(variable) && variable.length === 0) {
		return true;
	}

	// 判断对象是否为空
	if (typeof variable === 'object' && Object.keys(variable).length === 0) {
		return true;
	}

	// 判断是否为 NaN
	if (typeof variable === 'number' && isNaN(variable)) {
		return true;
	}

	return false;
}

// 需要登陆列表
let needLoginList = [
	"/pages/user/**",
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
				if (checkUrlPattern(url, needLoginList)) {
					isNeedLogin = true;
					// console.log('-> 是否需要登陆：', isNeedLogin)
				}
				// 如果存在白名单列表中
				if (checkUrlPattern(url, whiteList)) {
					isNeedLogin = false;
					// console.log(-> 是否白名单：'), isNeedLogin
				}
				//判断要打开的页面是否需要验证登录 (token == '' || !token)
				if (isNeedLogin && isEmpty(token)) {
					uni.showToast({
						title: t('pages.auth.please-login') || '请登录',
						icon: 'none'
					})
					// 存储上一页网址
					uni.setStorageSync("back_url", url)
					// 跳转至登陆页面
					uni.navigateTo({
						url: "/pages/auth/login/login"
					})
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
		success(args) {
			// console.log('interceptor-success', args)
			// 请求成功后，修改code值为1
			// args.data.code = 1
		},
		fail(err) {
			// console.log('interceptor-fail', err)
		},
		complete(res) {
			// console.log('interceptor-complete', res)
		}
	})

}