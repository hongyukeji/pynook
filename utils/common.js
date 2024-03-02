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
}