<template>
	<view class="page-wrap">
		<view class="page-header">
			<uni-search-bar class="page-header-search-bar" clearButton="auto" cancelButton="none" bgColor="#FFFFFF"
				textColor="var(--app-color-slave)" :placeholder="$t('common.search')" @confirm="search"
				v-model="params.keyword">
			</uni-search-bar>
		</view>
		<view class="page-body">
			<view class="container">
				<product-list-manage :items="items" @update-item="updateItem"
					@delete-item="deleteItem"></product-list-manage>
			</view>

			<fui-fab background="var(--app-color-master)" :isDrag="true" :mask="true" :maskClosable="true"
				:center="true" :position="'left'" :fabs="fabs" @click="handleClickPopup">
				<fui-icon name="plussign" color="#fff"></fui-icon>
			</fui-fab>

			<uni-popup ref="popup" type="center" :animation="true" :mask-click="true">
				<view class="popup-body">
					<view class="form-wrap">
						<view class="form-header">
							<view class="form-title">
								{{formData.id ? $t('common.product.update') : $t('common.product.add')}}
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
					text: this.$t('common.product.add'),
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
							errorMessage: this.$t('common.form.please-upload') + ' ' + this.$t(
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
						this.loading = 2;
					}
					const items = data.records;
					// 将数据追加到 items 数组中
					this.items = this.items.concat(items);
				});
				if (this.loading == 1) {
					this.loading = 0;
				}
			},
			submit() {
				// const formData = JSON.parse(JSON.stringify(this.formData));
				// console.log('---> formData :', this.formData);
				// const that = this;
				const formData = this.formData;
				this.$refs['form'].validate().then(validateFormData => {
					console.log('success validateFormData:', validateFormData);
					// uni.showToast({title: `校验通过`})
					const method = [formData.id ? 'updateMerchantProduct' : 'addMerchantProduct'];
					console.log('---> method :', method);
					this.$api.business[method](formData).then((res) => {
						// console.log('---> res :', res);
						if (res.data?.code != 200) {
							uni.showToast({
								title: res.data?.message || this.$t('common.request-failed'),
								icon: 'none'
							})
							return;
						}
						const data = res.data?.data;
						// this.formData = data;
						uni.showToast({
							title: this.$t('common.form.submit-successful')
						})
						this.formData = {};
						this.closePopup();
						this.refreshData();
					})
				}).catch(err => {
					console.log('err', err);
				})
			},
			deleteProduct(id, index) {
				const formData = {
					id: id,
				}
				this.$api.business.deleteMerchantProduct(formData).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					uni.showToast({
						title: this.$t('common.form.delete-successful')
					})
					this.items.splice(index, 1); //删除数组索引2的位置以后的1个元素
				})
			},
			toRedirect(item) {
				// 编辑商品
				this.updateItem(item);
				return;
				const url = "/pages/product/detail?id=" + item.id;
				this.$utils.common.redirect(url);
			},
			addItem() {
				console.log('---> addItem :', '添加商品');
				this.formData = {};
				this.openPopup();
			},
			updateItem(item) {
				console.log('---> updateItem :', '编辑商品');
				const formData = {
					id: item.id,
				}
				this.$api.business.getMerchantProductDetail(formData).then((res) => {
					// console.log('---> res :', res);
					if (res.data?.code != 200) {
						uni.showToast({
							title: res.data?.message || this.$t('common.request-failed'),
							icon: 'none'
						})
						return;
					}
					const data = res.data?.data;
					this.formData = data;
					this.openPopup();
				})
			},
			deleteItem(item, index) {
				console.log('---> deleteItem :', '删除商品');
				const that = this;
				uni.showModal({
					title: this.$t('common.tips'),
					content: `确定删除${item.name}商品吗？`,
					content: this.$t('common.tips.confirm.delete', {
						param: item.name
					}),
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							that.deleteProduct(item.id, index);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			openPopup() {
				this.$nextTick(() => {
					this.$refs.popup.open();
				});
			},
			closePopup() {
				this.$nextTick(() => {
					this.$refs.popup.close();
				});
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
	page {}

	.page-wrap {
		display: flex;
		flex-direction: column;
	}

	.page-header {}

	.page-body {
		position: relative;
		flex: 1;
	}

	.page-footer {}

	.container {
		box-sizing: border-box;
		margin: $uni-spacing-col-lg $uni-spacing-row-lg;
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
		padding: $uni-spacing-row-lg;
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