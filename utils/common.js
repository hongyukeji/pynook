export default {
	toBackPage() {
		const url = uni.getStorageSync("RETURN_URL")
		console.log('RETURN_URL:', url)
		// 返回上一页
		uni.redirectTo({
			url: url,
			success(res) {
				uni.removeStorageSync("RETURN_URL");
			},
			fail(err) {
				console.log(err)
				uni.switchTab({
					url: url,
					success(res) {
						uni.removeStorageSync("RETURN_URL");
					},
					fail(err) {
						console.log(err)
						uni.navigateBack({
							delta: 1
						});
					}
				});
			}
		});
	},
	// 检查 URL 是否匹配给定的列表
	checkUrlPattern(url, list) {
		for (let i = 0; i < list.length; i++) {
			const pattern = list[i].replace(/\*\*/g, '.*'); // 将 ** 替换为正则表达式 .*，表示匹配任意字符
			const regex = new RegExp('^' + pattern + '$'); // 创建正则表达式对象
			if (regex.test(url)) {
				return true;
			}
		}
		return false;
	},
	// 检查变量是否为空
	isEmpty(variable) {
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
	},
	toLoginPage(returnUrl) {
		if (!returnUrl || this.isEmpty(returnUrl)) {
			returnUrl = this.getCurrentPage();
		}
		// 存储上一页网址
		uni.setStorageSync("RETURN_URL", returnUrl)
		// 跳转至登陆页面
		uni.navigateTo({
			url: "/pages/auth/login"
		})
	},
	getCurrentPage() {
		var pages = getCurrentPages() // 获取栈实例
		let currentRoute = pages[pages.length - 1].route; // 获取当前页面路由
		let currentPage = pages[pages.length - 1]['$page']['fullPath'] //当前页面路径(带参数)
		return currentPage;
	},
	redirect(url) {
		if (url.startsWith('http')) {
			this.redirectUrl(url);
			return;
		}
		// if (url !== '' && !url.startsWith('/')) {
		// 	url = '/' + url;
		// }
		uni.navigateTo({
			url: url,
			success: res => {},
			fail: () => {
				uni.switchTab({
					url: url,
					success: res => {},
					fail: () => {
						this.redirectUrl(url);
					},
					complete: () => {}
				});
			},
			complete: () => {}
		});

	},
	redirectUrl(url) {
		// #ifdef MP
		uni.navigateTo({
			url: '/pages/webview/webview?url=' + url,
			success: res => {},
			fail: () => {
				this.redirectUrl(url);
			},
			complete: () => {}
		});
		return;
		// #endif

		// #ifdef H5
		// window.location.href = url;
		window.open(url);
		return;
		// #endif

		// #ifdef APP-PLUS
		/* plus.runtime.openURL(
			'mqq://im/chat?chat_type=wpa&uin=' + qq + '&version=1&src_type=web'
		); */
		plus.runtime.openWeb(url);
		return;
		// #endif

	},
}