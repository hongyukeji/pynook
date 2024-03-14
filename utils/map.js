// 获取地图位置
const getLocation = () => {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: 'wgs84',
			altitude: true, // 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
			isHighAccuracy: true, // 开启高精度定位
			success: res => {
				console.log('---> getLocation res :', res);
				console.log('当前位置的经度：' + res.longitude);
				console.log('当前位置的纬度：' + res.latitude);
				// this.longitude = res.longitude;
				// this.latitude = res.latitude;
				resolve(res);
			},
			fail: err => {
				console.log('---> getLocation err :', err);
				reject(err);
			}
		});
	});
}

// 获取地图中心位置
const getCenterLocation = (mapId, that) => {
	return new Promise((resolve, reject) => {
		const map = uni.createMapContext(mapId, that);
		map.getCenterLocation({
			// type: 'wgs84',
			// altitude: true, // 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
			// isHighAccuracy: true, // 开启高精度定位
			success: res => {
				// console.log('---> getCenterLocation res :', res);
				// console.log('中心位置的经度：' + res.longitude);
				// console.log('中心位置的纬度：' + res.latitude);
				// this.longitude = res.longitude;
				// this.latitude = res.latitude;
				if (res?.longitude && res?.latitude) {
					resolve(res);
				} else {
					reject(new Error("获取地图中心位置失败，请检查参数！"));
				}
			},
			fail: err => {
				console.log('---> getCenterLocation err :', err);
				reject(err);
			}
		});
	});
}

// 查看地图位置
const openLocation = (location = {}) => {
	return new Promise((resolve, reject) => {
		uni.openLocation({
			latitude: location?.latitude,
			longitude: location?.longitude,
			success: res => {
				console.log('---> openLocation res :', res);
				resolve(res);
			},
			fail: err => {
				console.log('---> openLocation err :', err);
				reject(err);
			}
		});
	});
}
// 选择地图位置
const chooseLocation = (location = {}, keyword) => {
	return new Promise((resolve, reject) => {
		uni.chooseLocation({
			latitude: location?.latitude,
			longitude: location?.longitude,
			keyword: keyword,
			success: res => {
				console.log('---> chooseLocation res :', res);
				console.log('位置名称：' + res.name);
				console.log('详细地址：' + res.address);
				console.log('纬度：' + res.latitude);
				console.log('经度：' + res.longitude);
				resolve(res);
			},
			fail: err => {
				console.log('---> chooseLocation err :', err);
				reject(err);
			}
		});
	});
}

// 移动位置
const moveToLocation = (location = {}, mapId, that) => {
	return new Promise((resolve, reject) => {
		const map = uni.createMapContext(mapId, that);
		map.moveToLocation({
			longitude: location?.longitude, // 经度
			latitude: location?.latitude, // 纬度
			success: res => {
				// console.log('---> moveToLocation res :', res);
				resolve(res);
			},
			fail: err => {
				console.log('---> moveToLocation err :', err);
				reject(err);
			},
			complete: res => {
				// console.log('---> moveToLocation location :', location);
				if (res.errMsg == 'moveToLocation:ok') {
					// console.log('---> moveToLocation ok :', res);
				} else {
					console.log('---> moveToLocation err :', res);
				}
			}
		});
	});
}

/**
 * 地图授权检测
 * @returns 
 */
const siteAthor = () => {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success: (res) => {
				// 表示 初始化进入，从未授权
				if (res.authSetting['scope.userLocation'] === undefined) {
					return resolve(true);
					// 表示 已授权
				} else if (res.authSetting['scope.userLocation'] === true) {
					return resolve(true);
					// 表示 授权拒绝
				} else if (res.authSetting['scope.userLocation'] === false) {
					uni.showModal({
						content: '检测到您没打开获取位置权限，是否去设置打开？',
						confirmText: "确认",
						cancelText: '取消',
						success: (res) => {
							if (res.confirm) {
								uni.openSetting({
									success: (res) => {
										// uni.showToast({
										//     title: '授权后将重新打开此页面',
										//     icon: 'none',
										// })
									},
									fail: (err) => {
										console.log(err)
									}
								})
							} else {
								uni.showToast({
									title: '获取授权位置授权失败,请手动打开位置权限',
									icon: 'none',
								})
							}
						}
					})
					return resolve(false)
				}
			}
		})
	})
};

/**
 * 地图授权
 * @returns 
 */
const getSetting = () => {
	console.info("调用位置授权~")
	return new Promise(async (resolve, reject) => {
		const resoult = await siteAthor(); //授权检测,是否拒绝过授权;
		console.info("resoult", resoult);
		if (!resoult) return; //跳转到设置页面
		uni.getSetting({
			success: async (res) => {
				if (!res.authSetting['scope.userLocation']) {
					console.log(res)
					uni.authorize({
						scope: 'scope.userLocation',
						success: async () => { //1.1 允许授权
							const res = await getNowSite();
							resolve(res);
						},
						fail: () => { //1.2 拒绝授权
							uni.showToast({
								title: '用户拒绝位置授权,位置会发生偏差',
								icon: 'none',
							})
							resolve(false);
						}
					})
				} else {
					const res = await getNowSite();
					resolve(res);
				}
			}
		})
	})
}

/**
 * 获取经纬度
 * @returns 
 */
const getNowSite = () => {
	return new Promise(async (resolve, reject) => {
		uni.getLocation({
			type: 'wgs84',
			altitude: true,
			isHighAccuracy: true,
			success: (res) => {
				console.log('当前位置的经度：' + res.longitude);
				console.log('当前位置的纬度：' + res.latitude);
				const {
					longitude,
					latitude
				} = res || {};
				if (longitude && latitude) {
					return resolve(res);
					// this.punctuationBits(latitude,longitude,"当前位置",0);
				} else {
					uni.showToast({
						title: '获取定位失败,请查看是否打开手机定位权限',
						icon: 'none',
					})
					resolve({});
				}
			},
			fail: (fail) => {
				console.info("获取定位失败", fail)
				// uni.showToast({
				//     title: '获取定位失败,请查看是否打开手机定位权限',
				//     icon: 'none',
				// })
				resolve({});
			},
		});
	})
}

/**
 * 选择点详情
 * @param {*} pointInfo 
 */
const openMap = (pointInfo) => {
	if (this.covers.length > 0 && pointInfo) {
		const {
			latitude,
			longitude,
			targetInfo,
			id,
			title
		} = this.covers[pointInfo.markerId];
		if (pointInfo.markerId === 0) return;
		uni.openLocation({
			latitude: Number(latitude), //要去的纬度-地址
			longitude: Number(longitude), //要去的经度-地址
			name: targetInfo.name, //地址名称
			address: targetInfo.address, //要去的具体地址
			//此处踩坑的问题.latitude 和 longitude的值一定要是number类型。所以传递的时候需要使用Number将其转换一下。
		})
	}
}


/**
 * 地图标点
 * @param {*} latitude 维度
 * @param {*} longitude 经度
 */
const punctuationBits = (latitude, longitude, labelName, id, address = "") => {
	let item = {
		id,
		checkedId: id,
		markerIndex: id,
		latitude,
		longitude,
		with: 10,
		height: 30,
		title: labelName,
		iconPath: '../static/tab_site.png', //展示的图标
		// 点击获取到的标点信息
		targetInfo: {
			labelName,
			address
		},
		callout: { //自定义标记点上方的气泡窗口 点击有效  
			content: labelName, //文本
			color: '#ffffff', //文字颜色
			fontSize: 15, //文本大小
			borderRadius: 15, //边框圆角
			padding: '10',
			bgColor: '#3F59F4', //背景颜色
			display: 'ALWAYS', //常显
		}
	};
	// 重新获取当前定位后,删除原来的位置信息
	if (id === 0 && this.covers.length > 0 && this.covers[0].id === 0) {
		this.covers.shift(item);
	}
	// 当前位置放在第一个
	id === 0 ? this.covers.unshift(item) : this.covers.push(item);
	this.latitude = latitude;
	this.longitude = longitude;
	// console.info("点位列表",this.covers)
}

export default {
	getLocation,
	getCenterLocation,
	openLocation,
	chooseLocation,
	moveToLocation,
};