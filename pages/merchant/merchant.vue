<template>
	<view class="page-wrap">
		<view class="page-hedaer">
			<uni-search-bar class="page-hedaer-search-bar" clearButton="auto" cancelButton="none" bgColor="#FFFFFF"
				textColor="$uni-color-slave" :placeholder="$t('common.search')" @confirm="search"
				v-model="params.keyword" @blur="blur" @focus="focus" @input="input" @cancel="cancel" @clear="clear">
			</uni-search-bar>
		</view>
		<view class="page-body">
			<view class="container">
				<view class="items">
					<view class="item" v-for="(item,index) in items" :key="index" @click="toRedirect(item)">
						<fui-card :src="item.image || appLogo" :title="item.name" tag="1km">
							<view class="fui-card__content">{{$t('business.form.address')}}: {{item.address}}</view>
							<view class="fui-card__content">{{$t('business.form.business-introduction')}}:
								{{item.introduction}}</view>
						</fui-card>
					</view>
				</view>
			</view>
		</view>
		<view class="page-footer">
			<uni-load-more :status="status"></uni-load-more>
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
				appName: getApp().globalData.app.name || '',
				appLogo: getApp().globalData.app.logo || '',
			};
		},
		computed: {
			status() {
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
					// 开发测试
					for (var i = 0; i < 50; i++) {
						// items.push(items[0] || that.items[0]);
					}
					// 将数据追加到 items 数组中
					that.items = that.items.concat(items);
				});
				if (this.loading == 1) {
					this.loading = 0;
				}
			},
			toRedirect(item) {
				const url = "/pages/merchant/detail?id=" + item.id;
				this.$utils.common.redirect(url);
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
		background-color: $uni-background-color;
		font-weight: normal;
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
	}

	.items {}

	.items .item {
		margin: $uni-spacing-col-lg auto;
	}


	.fui-section__title {
		margin-left: 32rpx;
	}

	.fui-card__content {
		font-size: 28rpx;
		margin: 20rpx 20rpx;
		box-sizing: border-box;
	}

	.fui-padding {
		padding-left: 32rpx;
		padding-right: 32rpx;
	}

	.fui-list__item {
		width: 100%;
		height: 385rpx;
		position: relative;
		background: #eee;
	}

	.fui-cover {
		width: 100%;
		height: 385rpx;
		display: block;
	}

	.fui-list__title {
		position: absolute;
		left: 0;
		bottom: 0;
		color: #fff;
		font-weight: 500;
		padding: 24rpx 20rpx;
		box-sizing: border-box;
		background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.6));
	}

	.fui-card__title {
		width: 100%;
		padding: 32rpx;
		box-sizing: border-box;
		font-weight: 500;
	}
</style>