<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container">

				<uni-section :title="$t('business.title.contact-information')" type="line">
					<view class="form-body">
						<!-- 基础表单校验 -->
						<uni-forms ref="form" :rules="rules" :modelValue="formData" label-position="top"
							label-width="120">
							<uni-forms-item :label="$t('business.form.business-name')" required
								:name="['merchant','name']" :rules="rules['merchant.name'].rules">
								<uni-easyinput v-model="formData.merchant.name"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.business-name')" />
							</uni-forms-item>
							<uni-forms-item :label="$t('business.form.business-type')" required
								:name="['merchant','typeId']" :rules="rules['merchant.typeId'].rules">
								<uni-data-select v-model="formData.merchant.typeId"
									:placeholder="$t('common.form.please-select')+' '+$t('business.form.business-type')"
									emptyTips="No options" :localdata="typeOptions"
									@change="typeChange"></uni-data-select>
							</uni-forms-item>
							<uni-forms-item :label="$t('business.form.address')" required :name="['merchant','address']"
								:rules="rules['merchant.address'].rules">
								<uni-easyinput v-model="formData.merchant.address"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.address')" />
							</uni-forms-item>
							<uni-forms-item :label="$t('business.form.business-introduction')"
								:name="['merchant','introduction']">
								<uni-easyinput type="textarea" v-model="formData.merchant.introduction" trim autoHeight
									maxlength="255"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.business-introduction')" />
							</uni-forms-item>
							<uni-forms-item :label="$t('business.form.image')" :name="['merchant','image']">
								<upload-file v-model="formData.merchant.image"></upload-file>
							</uni-forms-item>
							<uni-forms-item :label="$t('business.form.telephone')" :name="['merchant','telephone']">
								<uni-easyinput v-model="formData.merchant.telephone"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.telephone')" />
							</uni-forms-item>
						</uni-forms>

						<view class="btn-group">
							<view class="btn-item" v-for="(item,index) in menus" :key="index"
								@click="toRedirect(item, $event)">
								<view class="btn-item-text">
									{{item.text}}
								</view>
								<view class="btn-item-icon">
									<uni-icons type="arrow-right" size="24"></uni-icons>
								</view>
							</view>
						</view>

					</view>
				</uni-section>

			</view>
		</view>
		<view class="page-footer">
			<button class="btn-main btn-confirm" type="default"
				@click="submit('form')">{{$t('common.form.confirm')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions,
	} from 'vuex';
	export default {
		components: {},
		data() {
			return {
				formData: {
					merchant: {
						name: '',
						typeId: '',
						address: '',
						introduction: '',
					},
				},
				typeOptions: [
				/* {
					label: '咖啡店',
					text: 'Coffee shop',
					value: 0
				}, {
					label: '餐馆',
					text: 'Restaurant',
					value: 1
				}, {
					label: '杂货店',
					text: 'Grocery Store',
					value: 2
				}, {
					label: '书店',
					text: 'Bookstore',
					value: 3
				}, {
					label: '面包店',
					text: 'Bakery',
					value: 4
				}, {
					label: '其他',
					text: 'Other',
					value: 5
				}, */
				],
				// 校验规则
				rules: {
					"merchant.name": {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'business.form.business-name')
						}]
					},
					"merchant.typeId": {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-select') + ' ' + this.$t(
								'business.form.business-type')
						}]
					},
					"merchant.address": {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'business.form.address')
						}]
					},
				},
				menus: [
					/* 
					{
						text: this.$t('pages.business.orders'),
						url: '/pages/business/orders'
					}, {
						text: this.$t('pages.business.products'),
						url: '/pages/business/products'
					}, 
					*/
					{
						text: this.$t('pages.business.dashbord'),
						url: '/pages/business/dashbord'
					},
					{
						text: this.$t('business.button.menu'),
						url: '/pages/business/profile/menu'
					}, {
						text: this.$t('business.button.loyalty-stamps'),
						url: '/pages/business/profile/stamps'
					}, {
						text: this.$t('business.button.business-photos'),
						url: '/pages/business/profile/photos'
					}, {
						text: this.$t('business.button.get-qrcode'),
						url: '/pages/business/profile/qrcode'
					},
				],
			};
		},
		computed: {
			...mapState({
				isLogin: state => state.user.isLogin,
				isMerchant: state => state.user.isMerchant,
			}),
		},
		watch: {
			formData: {
				handler(newVal, oldVal) {
					// console.log("formData--newVal: ", newVal, "formData--oldVal: ", oldVal);
				},
				immediate: true, // 初始化绑定时就会执行handler方法
				deep: true, // 对象中任一属性值发生变化，都会触发handler方法
			},
		},
		onLoad() {},
		onShow() {},
		mounted() {
			this.getData();
		},
		methods: {
			...mapActions('user', ['syncUserBusinessInfo']),
			getData() {
				const that = this;
				this.$api.merchant.getMerchantTypeList().then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					let items = [];
					Object.keys(data).forEach(function(key) {
						// console.log(key, data[key]);
						const item = data[key];
						items.push({
							text: item.name,
							value: item.id,
						})
					});
					that.typeOptions = items;
				})
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
					const formData = Object.assign({}, that.formData, data);
					// console.log('---> formData :', formData);
					that.formData = formData;
					// console.log('---> this.formData :', that.formData);

					// this.uploadFileFileList.push(this.formData?.merchant?.image)
					// this.uploadFileFileList[0] = this.formData?.merchant?.image;
					// this.$refs.upload.initData(this.uploadFileFileList)
				})
			},
			submit(ref = 'form') {
				const that = this;
				this.$refs[ref].validate().then(formData => {
					console.log('success formData:', formData);
					// uni.showToast({title: `校验通过`})
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

						// 是否同步状态
						let isSyncStatus = false;
						// 同步用户业务信息
						if (this.formData.merchantId != data.merchantId) {
							isSyncStatus = true;
						}

						that.formData = Object.assign(that.formData, data);
						console.log('---> formData :', that.formData);
						uni.showToast({
							title: this.$t('common.form.submit-successful')
						})

						// todo：跳转至业务仪表盘
						// const url = "/pages/business/dashbord";
						// this.$utils.common.redirect(url);

						if (isSyncStatus) {
							this.syncUserBusinessInfo();
						}

					})

				}).catch(err => {
					console.log('err', err);
				})
			},
			typeChange(val) {
				console.log("typeChange val:", val);
				this.formData.merchant.typeId = val;
			},
			toRedirect(item) {
				console.log("toRedirect item:", item);

				// 判断是否已经开通商户，未开通则不允许跳转
				if (this.formData.merchantId <= 0 || !this.formData.merchantId) {
					this.submit();
					return;
					uni.showToast({
						title: this.$t('common.form.please-submit') + " " + this.$t('pages.business.profile'),
						icon: 'none'
					})
					return;
				}

				const link = item.url;
				this.$utils.common.redirect(link);
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {}

	.page-wrap {}

	.page-header {}

	.page-body {
		background-color: var(--app-bg-color);
	}

	.container {
		padding-bottom: 60px;
		background-color: var(--app-bg-color);
	}

	.page-footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: $uni-spacing-row-lg;
		box-sizing: border-box;
		background-color: $uni-bg-color;
	}

	.container {}

	.uni-section ::v-deep .uni-section-header {
		background-color: var(--app-bg-color);
	}

	.form-body {
		padding: 15px;
		background-color: var(--app-bg-color);
	}

	.uni-forms-item {
		// margin-bottom: 10px;
	}

	.btn-group {}

	.btn-item {
		padding: 15px 15px;
		margin: 20px auto;
		border-radius: 10px;
		background-color: var(--app-color-slave);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.btn-item-text {
		color: var(--app-color-master);
		text-decoration: none;
		font-size: 16px;
		font-weight: 700;
	}

	.btn-item-icon {}

	.btn-main {
		color: #ffffff;
		background-color: var(--app-color-master);
		border-color: var(--app-color-master);
	}

	.btn-confirm {}
</style>