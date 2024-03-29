import store from '@/store'
import globalConfig from '@/config'
import BigNumber from "bignumber.js";

export default {
	toFixed(amount, digits = 7) {
		// console.log('---> amount :', amount);
		if (this.isEmpty(amount)) {
			amount = 0;
		}
		return new BigNumber(amount).toNumber();
		// return new BigNumber(amount).toFixed();
	},
	toNumber(amount, digits = 7) {
		if (this.isEmpty(amount)) {
			amount = 0;
		}
		return new BigNumber(amount).toNumber();
	},
	getApiUrl() {
		const url = (process.env.NODE_ENV === 'production' ? globalConfig?.app?.apiUrl : globalConfig?.app
				?.apiDevUrl) ||
			'';
		return url;
	},
	getToken() {
		const tokenPrefix = "Bearer ";
		const token = uni.getStorageSync('TOKEN') || '';
		if (token && token != '' && !this.isEmpty(token)) {
			return tokenPrefix + token;
		}
		return '';
	},
	toBackPage() {
		const that = this;
		let url = this.getReturnUrl();
		console.log('RETURN_URL:', url);

		if (!url) {
			var pages = getCurrentPages()
			// console.log('pages:', pages);
			// console.log('pages.length:', pages.length);
			// 判断上一页路由是否存在
			if (pages.length <= 1) {
				url = '/';
			}
		}

		// console.log('url:', url);
		// return;

		// 返回上一页
		uni.redirectTo({
			url: url,
			success(res) {
				that.removeReturnUrl();
			},
			fail(err) {
				console.log('---> redirectTo fail err :', err)
				uni.switchTab({
					url: url,
					success(res) {
						that.removeReturnUrl();
					},
					fail(err) {
						console.log('---> switchTab fail err :', err)
						uni.navigateBack({
							delta: 1
						});
					}
				});
			}
		});
	},
	getReturnUrl() {
		const returnUrl = uni.getStorageSync("RETURN_URL") || '';
		return returnUrl;
	},
	setReturnUrl(returnUrl) {
		if (!returnUrl || this.isEmpty(returnUrl)) {
			returnUrl = this.getCurrentPage();
		}
		// 存储上一页网址
		uni.setStorageSync("RETURN_URL", returnUrl);
	},
	removeReturnUrl() {
		uni.removeStorageSync("RETURN_URL");
		return;
	},
	toLoginPage(returnUrl) {
		this.setReturnUrl(returnUrl);
		store.commit('user/logout');
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
	previewImage(url, urls) {
		if (!urls) {
			urls = [url];
		}
		uni.previewImage({
			current: url,
			loop: true,
			urls: urls
		})
	},
	redirect(url, that, params) {
		// console.log('---> redirect url :', url);
		if (!url) {
			throw new Error('[redirect] Url is empty');
		}
		if (url.startsWith('method://')) {
			const method = url.substring('method://'.length);
			// console.log('---> redirect method :', method);
			// console.log('---> redirect params :', params);
			that[method](params);
			return;
		}

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
	uploadFile(url, file, options = {}) {
		//上传的文件信息
		console.log('upload file', file)
		// 文件上传的函数，返回一个promise
		//上传成功后返回上传后的图片地址，上传失败则返回false即可
		return new Promise((resolve, reject) => {
			//调用api上传，所有需要参数自行补充
			uni.uploadFile({
				url: url,
				name: 'file',
				// header: {},
				// formData:{},
				filePath: file.path,
				success: (res) => {
					//以下成功或失败逻辑根据接口自行处理
					const data = JSON.parse(res.data.replace(/\ufeff/g, "") || "{}")
					if (data.statusCode === 200) {
						//返回上传成功后的图片
						resolve(data.data.url)
					} else {
						//上传失败
						reject(false)
					}
				},
				fail: (err) => {
					//上传失败
					reject(false)
				},
				...options,
			})
		})
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
	getH5Location() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					this.longitude = position.coords.longitude;
					this.latitude = position.coords.latitude;
					console.log('纬度：' + this.latitude + '，经度：' + this.longitude);
				},
				error => {
					console.error('获取位置失败：', error);
					uni.showToast({
						title: `获取位置失败`,
						icon: 'none',
					})
				}, {
					// enableHighAccuracy: true, // 是否要求高精度的位置信息
					// timeout: 10000, // 请求的超时时间
					// maximumAge: 0 // 对获取的地理位置信息的缓存时间
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
			uni.showToast({
				title: `当前浏览器不支持地理定位`,
				icon: 'none',
			})
		}
	},
	getCurrentLocation() {
		return new Promise((resolve, reject) => {
			uni.request({
				url: 'https://ipapi.co/json',
				data: {},
				success: res => {
					console.log('---> getUserLocation res :', res);
					const latitude = res?.data.latitude;
					const longitude = res?.data.longitude;
					console.log('当前位置的经度：' + longitude);
					console.log('当前位置的纬度：' + latitude);
					if (latitude && longitude) {
						const position = {
							latitude: latitude,
							longitude: longitude,
						};
						resolve(position);
					} else {
						reject(err);
					}
				},
				fail: err => {
					reject(err);
				}
			});
		});
	},
}