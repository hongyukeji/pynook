<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container">
				功能开发中，敬请期待！
			</view>
		</view>
		<view class="page-footer"></view>
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
				options: {},
			};
		},
		computed: {},
		onLoad(options) {
			this.options = options;
		},
		onShow() {
			console.log('---> onShow options :', this.options);
		},
		onReady() {},
		mounted() {
			this.getData();
		},
		methods: {
			getData() {
				const params = this.options;
				this.$api.order.confirmOrder(params).then((res) => {
					console.log('---> request res :', res);
					const data = res.data?.data;
					console.log('---> request data :', data);
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {}

	.page-wrap {}

	.page-header {}

	.page-body {}

	.page-footer {}

	.container {
		// margin: $uni-spacing-col-lg $uni-spacing-row-lg;
		// padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	}
</style>