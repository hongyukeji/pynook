<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">

				<uni-section :title="$t('business.title.contact-information')" type="line">
					<view class="form-body">
						<!-- 基础表单校验 -->
						<uni-forms ref="form" :rules="rules" :modelValue="formData" label-position="top"
							label-width="120">
							<uni-forms-item :label="$t('business.form.business-name')" required name="name">
								<uni-easyinput v-model="formData.name"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.business-name')" />
							</uni-forms-item>
							<uni-forms-item :label="$t('business.form.business-type')" required name="type">
								<!-- <uni-easyinput v-model="formData.type" placeholder="Please enter business type" /> -->
								<uni-data-select v-model="formData.type"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.business-type')"
									emptyTips="No options" :localdata="typeOptions" @change="change"></uni-data-select>
							</uni-forms-item>
							<uni-forms-item :label="$t('business.form.location')" required name="location">
								<uni-easyinput v-model="formData.location"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.location')" />
							</uni-forms-item>
							<uni-forms-item :label="$t('business.form.business-introduction')" name="introduction">
								<uni-easyinput type="textarea" v-model="formData.introduction"
									:placeholder="$t('common.form.please-enter')+' '+$t('business.form.business-introduction')"
									trim autoHeight maxlength="255" />
							</uni-forms-item>
						</uni-forms>

						<view class="btn-group">
							<view class="btn-item" @click="onTo()">
								<view class="btn-item-text">
									{{$t('business.button.menu')}}
								</view>
								<view class="btn-item-icon">
									<uni-icons type="arrow-right" size="24"></uni-icons>
								</view>
							</view>
							<view class="btn-item" @click="onTo()">
								<view class="btn-item-text">
									{{$t('business.button.loyalty-stamps')}}
								</view>
								<view class="btn-item-icon">
									<uni-icons type="arrow-right" size="24"></uni-icons>
								</view>
							</view>
							<view class="btn-item" @click="onTo()">
								<view class="btn-item-text">
									{{$t('business.button.business-photos')}}
								</view>
								<view class="btn-item-icon">
									<uni-icons type="arrow-right" size="24"></uni-icons>
								</view>
							</view>
							<view class="btn-item" @click="onTo()">
								<view class="btn-item-text">
									{{$t('business.button.get-qr-code')}}
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
	export default {
		components: {},
		data() {
			return {
				formData: {
					name: '',
					type: '',
					location: '',
					introduction: '',
				},
				/*rules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入名称',
							},
							{
								minLength: 4,
								maxLength: 32,
								errorMessage: '名称长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
					// 对email字段进行必填验证
					type: {
						rules: [{
							format: 'type',
							errorMessage: '请选择业务类型',
						}]
					}
					// 对email字段进行必填验证
					location: {
						rules: [{
							format: 'type',
							errorMessage: '请输入地址位置',
						}]
					}
				},*/
				typeOptions: [{
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
				}, ],
				// 校验规则
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'business.form.business-name')
						}]
					},
					type: {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'business.form.business-type')
						}]
					},
					location: {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'business.form.location')
						}]
					},
					// 自定义表单校验规则
					/**hobby: {
						rules: [{
								format: 'array'
							},
							{
								validateFunction: function(rule, value, data, callback) {
									if (value.length < 2) {
										callback('请至少勾选两个兴趣爱好')
									}
									return true
								}
							}
						]
					}*/
				},
			};
		},
		onLoad() {
			// uni.setNavigationBarTitle({
			// 	title: this.$t('business.page.business-apply'),
			// })
		},
		onShow() {},
		methods: {
			submit() {
				this.$refs.form.validate().then(res => {
					console.log('表单数据信息：', res);
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				var formdata = e.detail.value
				uni.showModal({
					content: '表单数据内容：' + JSON.stringify(formdata),
					showCancel: false
				});
			},
			formReset: function(e) {
				console.log('清空数据')
			},
			onClickItem(e) {
				console.log(e);
				this.current = e.currentIndex
			},
			submit(ref) {
				this.$refs[ref].validate().then(res => {
					console.log('success', res);
					uni.showToast({
						title: `校验通过`
					})
				}).catch(err => {
					console.log('err', err);
				})
			},
			change(e) {
				console.log("e:", e);
			},
			onTo(e) {
				console.log("e:", e);
				uni.navigateTo({
					url: '/pages/common/coding/coding'
				});
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {}

	.page-wrap {}

	.page-hedaer {}

	.page-body {
		background-color: #fff;
	}

	.container {
		padding-bottom: 60px;
	}

	.page-footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: $uni-spacing-row-lg;
		box-sizing: border-box;
		background-color: #fff;
	}

	.container {}

	.form-body {
		padding: 15px;
		background-color: #fff;
	}

	.uni-forms-item {
		// margin-bottom: 10px;
	}

	.btn-group {}

	.btn-item {
		padding: 15px;
		margin: 20px auto;
		border-radius: 10px;
		background-color: $uni-color-second;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.btn-item-text {
		color: $uni-color-main;
		text-decoration: none;
		font-size: 14px;
		font-weight: 700;
	}

	.btn-item-icon {}

	.btn-main {
		color: #ffffff;
		background-color: $uni-color-main;
		border-color: $uni-color-main;
	}

	.btn-confirm {}
</style>