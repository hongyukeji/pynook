<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">
				<view class="logo-wrap">
					<image class="logo-image" :src="appLogo" :mode="'heightFix'" style="height: 100%;"></image>
				</view>
				<uni-section :title="$t('common.login')+$t('common.account')" type="line">
					<view class="form-wrap" v-if="!isPiBrowser">
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
								<fui-button :text="$t('common.login')" bold @click="submit"></fui-button>
							</view>
						</fui-form>

						<view class="form-link-wrap">
							<!-- <uni-link href="/pages/auth/register" text="注册" :showUnderLine="false"></uni-link> -->
							<!-- <navigator class="form-link-btn" :url="'/pages/auth/login'">{{$t('common.login')}}</navigator> -->
							<navigator class="form-link-btn" :url="'/pages/auth/register'">{{$t('common.register')}}
							</navigator>
						</view>
					</view>
					<view class="form-wrap" v-else>
						<view class="btn-login btn-master-color" @click="piLogin()">
							π {{$t('common.login')}}
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
	import pisdk from '@/common/pisdk.js';
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
				appName: getApp().globalData.app.name || '',
				appLogo: getApp().globalData.app.logo || '',
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
			isPiBrowser() {
				return pisdk.isPiBrowser();
			},
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
							// console.log('---> data :', res.data.data);
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
			/**
			 * pi登录
			 */
			piLogin() {
				const that = this;
				pisdk.loadScript()
					.then(function() {
						console.log('---> pi loadScript()');
						console.log('---> pi login()');
						uni.showLoading({
							title: "正在唤醒登录授权..."
						})
						pisdk.login({
							onIncompletePaymentFound: async function(payment) {
								console.log('> pi onIncompletePaymentFound payment: ', payment);

								let paymentId = payment.identifier;
								let txid = payment.transaction.txid;

								// TODO: 发现未完成付款业务代码...
								uni.request({
									url: that.global.url + '/api/pi/complete?lang=' + uni
										.getStorageSync('lang'),
									method: 'POST',
									header: {
										'content-type': 'application/x-www-form-urlencoded'
									},
									data: {
										"token": uni.getStorageSync("token").token,
										"paymentId": paymentId,
										"txid": txid,
									},
									success: (res) => {
										console.log('>>> Pi onIncompletePaymentFound res',
											res);

										if (!res.data.code != 1) {
											let err = res?.data?.message;
											console.log('>>> Pi onIncompletePaymentFound err',
												err);
											uni.showToast({
												icon: 'none',
												title: `未付款订单处理失败 ${err}`
											});
											return;
										}

										if (res?.data?.data?.transaction?.verified || res?.data
											?.transaction?.verified) {
											uni.showToast({
												icon: 'none',
												title: '未付款订单处理成功，请重新发起付款'
											});
										} else {
											uni.showToast({
												icon: 'none',
												title: '未付款订单处理失败，请稍后再试！'
											});
										}

									},
									fail: (err) => {

									}
								});

							},
						}).then(async function(auth) {
							console.log('> pi login auth:', auth);

							let accessToken = auth.accessToken;
							// let uid = auth.user.uid;
							// let username = auth.user.username;
							// console.log('> pi accessToken', accessToken);

							// TODO: 登录业务代码
							let formData = {
								accessToken: accessToken,
								inviteCode: uni.getStorageSync('INVITE_CODE'),
							};

							that.$api.pi.login(formData).then((res) => {
								console.log('---> res :', res);
								const code = res.data?.code;
								const message = res.data?.message;
								console.log('---> code :', code);
								console.log('---> message :', message);
								if (code != 200) {
									uni.showToast({
										title: message || '登陆失败',
										icon: 'none'
									})
									return;
								}
								const data = res.data?.data;
								console.log('---> data :', data);
								that.login(data);
								uni.showToast({
									title: '登陆成功',
									icon: 'none'
								})
								that.$utils.common.toBackPage();
							});

						}).catch(function(err) {
							console.error('> pi auth catch:', err);
						}).finally(function() {
							uni.hideLoading();
						});

					})
					.catch(function(err) {
						console.error(`> pi 环境加载失败 ${err}`);
					});

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

	.btn-login {
		padding: $uni-spacing-row-lg;
		margin: $uni-spacing-col-lg auto;
		border-radius: $uni-border-radius-lg;
		color: #ffffff;
		border-color: $app-color-master;
		background-color: $app-color-master;
		color: $app-color-slave;
		// border-color: #FCD323;
		// background-color: #FCD323;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.logo-wrap {
		height: 120px;
		padding: $uni-spacing-row-lg;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: $uni-bg-color;
	}

	.logo-image {}
</style>