<template>
	<fui-upload background="#eee" radius="20" :fileList="uploadFileFileList" :max="1" :immediate="true"
		:url="uploadFileUrl" ref="upload" :header="uploadFileHeader" :formData="uploadFileFormData"
		@success="uploadFileSuccess" @error="uploadFileError" @complete="uploadFileComplete"
		@preview="uploadFilePreview" v-bind="$attrs">
		<fui-icon name="plussign" color="#fff"></fui-icon>
	</fui-upload>
</template>

<script>
	export default {
		name: "upload-file",
		props: {
			value: [Array, String],
			modelValue: [Array, String],
		},
		data() {
			return {
				val: '',
				// 图片上传
				uploadFileUrl: this.$utils.common.getApiUrl() + "/api/common/uploadFile",
				uploadFileHeader: {
					Authorization: this.$utils.common.getToken(),
				},
				uploadFileFormData: {},
				uploadFileStatus: '',
				// uploadFileFileList: [],
				uploadFileUrls: [],
			};
		},
		computed: {
			uploadFileFileList() {
				let modelValue = this.getModelValue();
				if (Array.isArray(modelValue) && modelValue.length > 0) {
					return modelValue;
				}
				if (typeof modelValue === 'string' && modelValue.trim() !== '') {
					return [modelValue];
				}
				return [];
			},
		},
		watch: {
			value(newVal) {
				this.val = newVal;
			},
			modelValue(newVal) {
				this.val = newVal;
			},
			uploadFileUrls: {
				handler(newVal, oldVal) {
					// console.log("---> uploadFileUrls watch newVal: ", newVal);
					// console.log("---> uploadFileUrls watch oldVal: ", oldVal);
				},
				immediate: true, // 初始化绑定时就会执行handler方法
				deep: true, // 对象中任一属性值发生变化，都会触发handler方法
			},
		},
		created() {
			// this.init();
		},
		methods: {
			init() {
				console.log('---> uploadFile init: ', '...')

				// console.log('---> uploadFile this.$attrs:', this.$attrs)
				// console.log('---> uploadFile this.$attrs.modelValue:', this.$attrs.modelValue)
				// console.log('---> uploadFile modelValue:', this.modelValue)

				// 使用 this.$nextTick() 方法可以确保你的代码在 DOM 更新后执行，从而避免因为 DOM 更新延迟导致的操作出现问题。
				this.$nextTick(() => {
					console.log('---> uploadFile this.$refs.upload:', this.$refs.upload)
				});

				// 延迟执行的代码
				setTimeout(() => {
					const imageUrl =
						'https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png';
					this.setModelValue(imageUrl);
				}, 3000);
			},
			setModelValue(value) {
				// TODO 兼容 vue2
				this.$emit('input', value);
				// TODO　兼容　vue3
				this.$emit('update:modelValue', value);
			},
			getModelValue() {
				if (this.value) {
					return this.value;
				} else {
					return this.modelValue;
				}
			},
			syncModelValue() {
				let modelValue = this.getModelValue();
				if (Array.isArray(modelValue)) {
					this.setModelValue(this.uploadFileUrls);
				} else {
					this.setModelValue(this.uploadFileUrls[0] || '');
				}
			},
			uploadFileSuccess(e) {
				console.log('---> uploadFile success:', e)
				//上传成功回调，处理服务器返回数据【此处根据实际返回数据进行处理】
				let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}")
				this.uploadFileStatus = e.status
				if (res.data.url) {
					//处理结果返回给组件
					//data.url为上传成功后返回的图片地址
					//e.index为图片索引值
					this.$refs.upload.result(res.data.url, e.index)
				}
			},
			uploadFileError(e) {
				console.log('---> uploadFile error:', e)
				this.uploadFileStatus = e.status
			},
			uploadFileComplete(e) {
				console.log('---> uploadFile complete:', e)
				this.uploadFileStatus = e.status
				this.uploadFileUrls = e.urls
				if (this.uploadFileStatus === 'success' && e.action === 'upload') {
					// this.fui.toast('上传完成！')
					//已上传完成的图片列表 this.uploadFileUrls
					console.log(this.uploadFileUrls)
					//回传图片地址...
				}
				// 同步数据
				this.syncModelValue();
			},
			uploadFilePreview(e) {
				console.log('---> uploadFile preview:', e)
			},
		},
	}
</script>

<style lang="scss" scoped>

</style>