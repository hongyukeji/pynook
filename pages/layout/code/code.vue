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
			return {};
		},
		computed: {},
		onLoad(options) {},
		onShow() {},
		onReady() {},
		mounted() {},
		methods: {},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		min-height: 100%;
		font-weight: normal;
		background-color: var(--app-bg-color);
		box-sizing: border-box;
	}

	.page-wrap {
		width: 100%;
		min-height: 100%;
		background-color: var(--app-bg-color);
	}

	.page-header {}

	.page-body {}

	.page-footer {}

	.container {
		// margin: $uni-spacing-row-lg;
		// padding: $uni-spacing-row-lg;
		// border-radius: $uni-border-radius-lg;
	}
</style>