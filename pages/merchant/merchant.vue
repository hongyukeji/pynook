<template>
	<view class="page-wrap">
		<view class="page-header">
			<uni-search-bar class="page-header-search-bar" clearButton="auto" cancelButton="none" bgColor="#FFFFFF"
				textColor="var(app-color-slave)" :placeholder="$t('common.search')" @confirm="search"
				v-model="params.keyword">
			</uni-search-bar>
		</view>
		<view class="page-body">
			<view class="container">
				<view class="items">
					<view class="item" v-for="(item,index) in items" :key="index" @click="toRedirect(item)">
						<merchant-info :merchant="item"></merchant-info>
					</view>
				</view>
			</view>
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
				this.getData();
			},
			async getData() {
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
				await this.$api.merchant.getMerchantList(this.params).then((res) => {
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
					let items = data.records;
					// 将数据追加到 items 数组中
					that.items = that.items.concat(items);
				});
				if (this.loading == 1) {
					this.loading = 0;
				}
			},
			toRedirect(item) {
				const url = "/pages/merchant/detail?id=" + item.id;
				this.redirect(url);
			},
		},
		// 下拉刷新
		async onPullDownRefresh() {
			console.log('下拉刷新-->>')
			await this.getData();
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
		width: 100%;
		min-height: 100%;
		background-color: var(--app-bg-color);
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

	.items {}

	.items .item {
		margin: $uni-spacing-col-lg auto;
	}

	.fui-card__content {
		color: $uni-text-color-placeholder;
		font-weight: normal;
		font-size: 14px;
		margin: 20rpx 20rpx;
		box-sizing: border-box;
	}

	::v-deep .fui-card__header-title {
		font-weight: bold;
	}
</style>