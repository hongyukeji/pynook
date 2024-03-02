export default {
	toBackPage() {
		const url = uni.getStorageSync("return_url")
		console.log('return_url:', url)
		// 返回上一页
		uni.redirectTo({
			url: url,
			success(res) {
				uni.removeStorageSync("return_url");
			},
			fail(err) {
				console.log(err)
				uni.switchTab({
					url: url,
					success(res) {
						uni.removeStorageSync("return_url");
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
	}
}