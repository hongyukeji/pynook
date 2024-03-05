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

			<fui-fab :zIndex="10" :position="'left'" background="var(--app-color-master)" @click="addItem">
				<fui-icon name="plussign" color="#fff"></fui-icon>
			</fui-fab>
			<fui-fab background="var(--app-color-master)" :isDrag="true" :mask="false"
				:position="'right'" :fabs="fabs" @click="handleClick">
				<fui-icon name="plussign" color="#fff"></fui-icon>
			</fui-fab>

			<uni-popup ref="popup" type="center" :animation="true" :mask-click="false">
				<view class="form-wrap" style="">
					<view class="">添加商品表单</view>
					<view class="">添加商品表单</view>
					<view class="">添加商品表单</view>
					<view class="">添加商品表单</view>
					<view class="">添加商品表单</view>
					<view class="">添加商品表单</view>
					<view class="">添加商品表单</view>
					<view class="">添加商品表单</view>
					<view class="">添加商品表单</view>
					<view class="">添加商品表单</view>
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
					text: '添加商品',
					color: 'var(--app-color-master)',
				}, {
					name: 'setup',
					text: '仪表盘',
					color: 'var(--app-color-master)',
				}, {
					name: 'home',
					text: '首页',
					color: 'var(--app-color-master)',
				}],
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
				return;
				const url = "/pages/merchant/detail?id=" + item.id;
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
			handleClick(e) {
				console.log(e)
				this.fui.toast(`您点击了【${this.fabs[e.index].text}】按钮~`)
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
		background-color: $app-bg-color;
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
		width: 100%;
		// height: 100%;
	}

	.form-wrap {
		background-color: $uni-bg-color;
		margin: $uni-spacing-row-lg;
		padding: $uni-spacing-row-lg;
		border-radius: $uni-border-radius-lg;
	}
</style>