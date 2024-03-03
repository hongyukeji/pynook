<template>
	<view class="page-wrap">
		<view class="page-hedaer"></view>
		<view class="page-body">
			<view class="container">
				产品列表
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
			return {};
		},
		computed: {},
		onLoad() {},
		onShow() {},
		onReady() {},
		mounted() {},
		methods: {},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		font-weight: normal;
		background-color: $uni-background-color;
		box-sizing: border-box;
	}

	.page-wrap {}

	.page-hedaer {}

	.page-body {}

	.page-footer {}

	.container {
		// margin: $uni-spacing-col-lg $uni-spacing-row-lg;
		// padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	}
</style>