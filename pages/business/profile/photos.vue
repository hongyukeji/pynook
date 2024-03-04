<template>
	<!--@author: 鸿宇 @email: 1527200768@qq.com-->
	<view class="fui-wrap">
		<view class="fui-page__hd">
			<view class="fui-page__title fui-align__center"></view>
			<view class="fui-page__desc"></view>
		</view>
		<view class="fui-page__bd fui-page__spacing">
			<view class="fui-section__title">{{$t('common.photo')}}</view>
			<view class="fui-btn__box">
				<fui-button type="success" btn-size="medium" :text="$t('common.form.save')" bold @click="submit"
					background="#090C49" color="#FFFFFF"></fui-button>
			</view>
			<fui-upload background="#333" radius="20" :fileList="fileList" :max="10" :immediate="true" :url="url"
				ref="upload" :header="uploadFileHeader" :formData="uploadFileFormData" @success="success" @error="error"
				@complete="complete" @preview="preview">
				<fui-icon name="plussign" color="#d1d1d1"></fui-icon>
			</fui-upload>
		</view>
		<!--previewImage：百度小程序只支持预览网络路径图片，这里为了做兼容-->
		<!-- #ifdef MP-BAIDU -->
		<fui-gallery :show="show" :current="current" :urls="preUrls" @hide="hideGallery"></fui-gallery>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// #ifdef MP-BAIDU
				//预览图片列表
				preUrls: [],
				show: false,
				current: 0,
				// #endif
				//上传接口地址
				// url: 'https://ffa.firstui.cn/api/example/upload-file',
				url: this.$utils.common.getApiUrl() + "/api/common/uploadFile",
				//上传状态，用于保存或其他操作时做判断
				status: '',
				//上传的图片地址列表
				urls: [],
				//初始化已上传的图片列表
				fileList: [
					// 'https://res.firstui.cn/static/images/common/logo.png',
				],
				uploadFileHeader: {
					Authorization: this.$utils.common.getToken(),
				},
				uploadFileFormData: {},
				formData: {},
			}
		},
		onLoad() {},
		mounted() {
			this.loadData();
		},
		methods: {
			loadData() {
				const that = this;
				this.$api.business.getBusinessData().then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					that.formData = data;
					if (data.merchant && data.merchant.images) {
						that.fileList = data.merchant.images.split(",");
					}
				})
			},
			submit() {
				// console.log('---> fileList :', this.fileList);
				console.log('---> urls :', this.urls);
				const that = this;
				this.formData.merchant.images = this.urls.join(",");
				const formData = this.formData;
				this.$api.business.setBusinessData(formData).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					that.formData = data;
					uni.showToast({
						title: this.$t('common.form.submit-successful')
					})
				})
			},
			success(e) {
				console.log('---> success:', e)
				//上传成功回调，处理服务器返回数据【此处根据实际返回数据进行处理】
				let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}")
				this.status = e.status
				if (res.data.url) {
					//处理结果返回给组件
					//data.url为上传成功后返回的图片地址
					//e.index为图片索引值
					this.$refs.upload.result(res.data.url, e.index)
				}
			},
			error(e) {
				console.log('---> error:', e)
				this.status = e.status
			},
			complete(e) {
				console.log('---> complete:', e)
				this.status = e.status
				this.urls = e.urls
				if (this.status === 'success' && e.action === 'upload') {
					this.fui.toast('上传完成！')
					//已上传完成的图片列表 this.urls
					console.log(this.urls)
				}
			},
			preview(e) {
				console.log('---> preview:', e)
				// #ifdef MP-BAIDU
				this.preUrls = e.urls;
				this.current = e.index;
				setTimeout(() => {
					this.show = true;
				}, 50)
				// #endif
			},
			hideGallery() {
				this.show = false;
			},
			/*
			   以下为调用upload方法手动上传的所有方法内容
			*/
			//调用upload方法上传时传入的回调函数
			uploadFile(file) {
				//上传的文件信息
				console.log('upload file', file)
				// 文件上传的函数，返回一个promise
				//上传成功后返回上传后的图片地址，上传失败则返回false即可
				return new Promise((resolve, reject) => {
					//调用api上传，所有需要参数自行补充
					uni.uploadFile({
						url: this.url,
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
						}
					})
				})
			},
			callUpload() {
				//调用upload 方法上传，并传入函数，此时请勿传入index值
				this.$refs.uploader.upload(this.uploadFile)
			},
			//重新上传
			reUpload(e) {
				/*
				  callUpload 中上传失败时会出现重新上传按钮
				  点击重新上传按钮触发（仅call-upload 为true 时有效）
				*/
				//当前上传按钮索引值
				console.log(e.index)
				//调用upload 方法上传，并传入函数，且此时需要传入index值
				this.$refs.uploader.upload(this.uploadFile, e.index)
			},
		}
	}
</script>

<style>
	.fui-btn__box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-bottom: 64rpx;
	}
</style>