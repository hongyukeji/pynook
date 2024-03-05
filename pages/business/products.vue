<template>
	<view class="page-wrap">
		<view class="page-hedaer">
			<uni-search-bar class="page-hedaer-search-bar" clearButton="auto" cancelButton="none" bgColor="#FFFFFF"
				textColor="var(--app-color-slave)" :placeholder="$t('common.search')" @confirm="search"
				v-model="params.keyword">
			</uni-search-bar>
		</view>
		<view class="page-body">
			<view class="container">
				<view class="items">
					<view class="item" v-for="(item,index) in items" :key="index" @click="toRedirect(item)">
						产品列表
					</view>
				</view>
			</view>

			<fui-fab background="var(--app-color-master)" :isDrag="true" :mask="true" :maskClosable="true"
				:position="'left'" :fabs="fabs" @click="handleClickPopup">
				<fui-icon name="plussign" color="#fff"></fui-icon>
			</fui-fab>

			<uni-popup ref="popup" type="center" :animation="true" :mask-click="true">
				<view class="popup-body">
					<view class="form-wrap">
						<view class="form-header">
							<view class="form-title">
								{{$t('common.add.product')}}
							</view>
							<view class="btn-close-popup" @click="closePopup">
								<uni-icons class="btn-icon" type="close" color="#656D76" size="24"></uni-icons>
							</view>
						</view>
						<view class="form-body">
							<!-- <scroll-view class="form-scroll" :show-scrollbar="true" scroll-y> -->
							<!-- 基础表单校验 -->
							<uni-forms ref="form" :rules="rules" :modelValue="formData" label-position="top"
								label-width="120">
								<uni-forms-item :label="$t('common.product.name')" required :name="['name']">
									<uni-easyinput v-model="formData.name"
										:placeholder="$t('common.form.please-enter')+' '+$t('common.product.name')" />
								</uni-forms-item>
								<uni-forms-item :label="$t('common.product.price')" required :name="['price']">
									<uni-easyinput type="digit" v-model="formData.price"
										@change="(val)=>{formData.price = val.replace(/[^\d.]/g, '');}"
										:placeholder="$t('common.form.please-enter')+' '+$t('common.product.price')" />
								</uni-forms-item>
								<uni-forms-item :label="$t('common.product.image')" required :name="['image']">
									<upload-file v-model="formData.image"></upload-file>
								</uni-forms-item>
								<uni-forms-item :label="$t('common.product.description')" required
									:name="['description']">
									<uni-easyinput type="textarea" v-model="formData.description" trim autoHeight
										maxlength="255"
										:placeholder="$t('common.form.please-enter')+' '+$t('common.product.description')" />
								</uni-forms-item>
								<uni-forms-item :label="$t('common.product.stock')" required :name="['stock']">
									<uni-easyinput type="number" trim v-model="formData.stock"
										@change="(val)=>{formData.stock = val.replace(/\.(\d*)/, '').replace(/[^\d]/g, '');}"
										:placeholder="$t('common.form.please-enter')+' '+$t('common.product.stock')" />
								</uni-forms-item>
								<uni-forms-item :label="$t('common.product.delivery-time')" required
									:name="['deliveryTime']">
									<uni-easyinput v-model="formData.deliveryTime"
										:placeholder="$t('common.form.please-enter')+' '+$t('common.product.delivery-time')" />
								</uni-forms-item>
							</uni-forms>
							<!-- </scroll-view> -->
						</view>
						<view class="form-footer">
							<button class="btn-submit" type="default"
								@click="submit()">{{$t('common.form.submit')}}</button>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<view class="page-footer">
			<uni-load-more :status="loadStatus"></uni-load-more>
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
				params: {
					current: 0, // 初始页码
					size: 10, // 每页条数
					keyword: "", // 关键字
				},
				items: [], // 列表数据数组
				loading: 0, // 加载状态: 0-加载前more，1-加载中loading，2-没有更多数据noMore
				fabs: [{
					name: 'plus',
					text: this.$t('common.add.product'),
					link: 'method://addItem',
					// color: 'var(--app-color-master)',
				}, {
					name: 'setup',
					text: this.$t('pages.business.dashbord'),
					link: '/pages/business/dashbord',
					// color: 'var(--app-color-master)',
				}, {
					name: 'home',
					text: this.$t('tabbar.home'),
					link: '/',
					// color: 'var(--app-color-master)',
				}],
				formData: {},
				// 校验规则
				rules: {
					"name": {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'common.product.name')
						}]
					},
					"stock": {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'common.product.stock')
						}]
					},
					"price": {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'common.product.price')
						}]
					},
					"image": {
						rules: [{
							required: true,
							errorMessage: this.$t('common.form.please-enter') + ' ' + this.$t(
								'common.product.image')
						}]
					},
				},
			};
		},
		computed: {
			loadStatus() {
				switch (this.loading) {
					case 0:
						return "more";
						break;
					case 1:
						return "loading";
						break;
					case 2:
						return "noMore";
						break;
					default:
						return "more";
				}
			},
		},
		onLoad() {},
		onShow() {},
		onReady() {},
		mounted() {
			this.loadData();
		},
		methods: {
			search() {
				this.refreshData();
			},
			async refreshData() {
				this.params.current = 0;
				this.items = [];
				if (this.loading == 2) {
					this.loading = 0;
				}
				await this.loadData();
			},
			async loadData() {
				const that = this;
				if (this.loading >= 1) {
					return;
				}
				this.params.current++;
				this.loading = 1;
				// 发送请求获取数据
				await this.$api.business.getMerchantProductList(this.params).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					// console.log('---> data :', data);
					// 判断是否是最后一页
					if (data.current >= data.pages) {
						that.loading = 2;
					}
					const items = data.records;
					// 将数据追加到 items 数组中
					that.items = that.items.concat(items);
				});
				if (this.loading == 1) {
					this.loading = 0;
				}
			},
			toRedirect(item) {
				const url = "/pages/product/detail?id=" + item.id;
				this.$utils.common.redirect(url);
			},
			addItem() {
				console.log('---> addItem :', '添加商品');
				this.openPopup();
			},
			openPopup() {
				this.$refs.popup.open()
			},
			closePopup() {
				this.$refs.popup.close()
			},
			handleClickPopup(e) {
				console.log(e)
				console.log(`您点击了【${this.fabs[e.index].text}】按钮~`)
				const link = this.fabs[e.index].link;
				if (link.startsWith('method://')) {
					const method = link.substring('method://'.length);
					console.log(method); // 输出: addItem
					this[method]();
					return;
				}
				this.$utils.common.redirect(link);
			},
		},
		// 下拉刷新
		async onPullDownRefresh() {
			console.log('下拉刷新-->>')
			await this.refreshData();
			uni.stopPullDownRefresh() // 停止当前页面刷新
		},
		// 触底加载
		async onReachBottom() {
			console.log('触底加载-->>')
			await this.loadData();
		},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		font-weight: normal;
		background-color: var(--app-bg-color);
		box-sizing: border-box;
	}

	.page-wrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.page-hedaer {}

	.page-body {
		position: relative;
		flex: 1;
	}

	.page-footer {}

	.container {
		box-sizing: border-box;
		margin: $uni-spacing-col-lg $uni-spacing-row-lg;
	}

	.items {}

	.items .item {
		margin: $uni-spacing-col-lg auto;
	}

	::v-deep .uni-popup .uni-popup__wrapper {
		// width: 100%;
		// height: 80%;
		// height: 80%;
		// max-height: 80%;
	}

	.popup-body {
		width: 100vw;
		height: 90vh;
		padding: $uni-spacing-row-lg;
		box-sizing: border-box;
	}

	.form-wrap {
		// margin: $uni-spacing-row-lg;
		background-color: var(--app-bg-color);
		border-radius: $uni-border-radius-lg;
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.form-header {
		padding: $uni-spacing-row-base;
	}

	.form-footer {
		padding: $uni-spacing-row-base;
	}

	.form-body {
		flex: 1;
		// width: 100%;
		height: 100%;
		overflow-y: auto;
		padding: $uni-spacing-row-base;
	}

	.scroll {}

	.form-title {
		font-size: 18px;
		text-align: center;
	}

	.btn-close-popup {
		display: flex;
		position: absolute;
		top: $uni-spacing-col-base;
		right: $uni-spacing-col-base;
	}

	.btn-submit {
		color: var(--app-text-color-white);
		border-color: var(--app-color-master);
		background-color: var(--app-color-master);
	}
</style>