<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">
				<uni-section title="密码登陆" type="line">
					<view class="form-wrap">
						<fui-form ref="form" top="0" :model="formData" :show="false">
							<fui-form-item label="用户名" asterisk prop="username">
								<fui-input :borderBottom="false" :padding="[0]" placeholder="用户名/邮箱/手机号"
									v-model="formData.username"></fui-input>
							</fui-form-item>
							<fui-form-item label="密码" asterisk prop="password">
								<fui-input :borderBottom="false" :padding="[0]" placeholder="请输入密码"
									v-model="formData.password" type="password"></fui-input>
							</fui-form-item>
							<!-- <fui-form-item label="记住我">
								<fui-switch v-model="formData.rememberMe" @change="change"
									:scaleRatio="0.9"></fui-switch>
							</fui-form-item> -->
							<view class="form-btn-wrap">
								<fui-button text="登陆" bold @click="submit"></fui-button>
							</view>
						</fui-form>
						<view class="form-link-wrap">
							<!-- <uni-link href="/pages/auth/register" text="注册" :showUnderLine="false"></uni-link> -->
							<!-- <navigator class="form-link-btn" :url="'/pages/auth/login'">登陆</navigator> -->
							<navigator class="form-link-btn" :url="'/pages/auth/register'">注册</navigator>
						</view>
					</view>
				</uni-section>
			</view>
		</view>
		<view class="page-footer">
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
				// 表单数据
				formData: {
					username: '',
					password: '',
					rememberMe: false,
				},
				// 校验规则
				rules: [{
					name: "username",
					rule: ["required", ],
					msg: ["请输入用户名", ]
				}, {
					name: "password",
					rule: ["required", ],
					msg: ["请输入密码", ]
				}],
				rememberMeOptions: [{
					text: '记住我',
					value: true
				}],
			};
		},
		computed: {
			...mapState({
				userData: state => state.user,
			}),
		},
		onLoad() {},
		onShow() {},
		onReady() {},
		methods: {
			...mapMutations('user', ['login', 'logout']),
			change(e) {
				this.formData.rememberMe = e.detail.value
			},
			toBackPage() {
				this.$utils.common.toBackPage();
			},
			submit() {
				const that = this;
				console.log(this.formData)
				//注意：validator方法第三个参数必须传true
				this.$refs.form.validator(this.formData, this.rules, true).then(res => {
					console.log(res)
					if (res.isPassed) {
						console.log('校验通过！')
						that.$api.auth.login(that.formData).then((res) => {
							console.log('---> res :', res);
							if (res.data.code != 200) {
								uni.showToast({
									title: res.data.message,
									icon: 'none'
								})
								return;
							}
							// console.log('---> title :', title);
							that.login(res.data.data);
							console.log('userData:', that.userData);
							uni.showToast({
								title: '登陆成功',
								icon: 'none'
							})
							that.toBackPage();
						})
					} else {
						console.log('向上滑动页面查看错误提示！')
					}
				}).catch(err => {
					console.log(err)
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {}

	.page-wrap {}

	.page-hedaer {}

	.page-body {}

	.page-footer {}

	.container {
		box-sizing: border-box;
	}

	.form-wrap {
		padding: $uni-spacing-row-lg;
		background-color: #fff;
	}

	.form-btn-wrap {
		margin: $uni-spacing-row-lg;
	}

	.form-link-wrap {
		margin: $uni-spacing-row-lg;
		padding-top: $uni-spacing-row-lg;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.form-link-btn {}
</style>