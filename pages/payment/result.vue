<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container">
				<fui-result :type="type" :title="title" :descr="descr">
					<fui-button width="400rpx" height="84rpx" text="主要操作" type="success" bold
						:margin="['48rpx','0','24rpx']">
					</fui-button>
					<fui-button width="400rpx" height="84rpx" text="次要操作" type="gray" color="#09BE4F" bold></fui-button>
				</fui-result>
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
				//data数据
				type: 'success',
				title: '操作成功',
				descr: 'Result 结果页，在页面中组织图标、文字等内容，向用户反馈操作结果',
			};
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
	page {}

	.page-wrap {}

	.page-header {}

	.page-body {}

	.page-footer {}

	.container {
		// margin: $uni-spacing-row-lg;
		// padding: $uni-spacing-row-lg;
		// border-radius: $uni-border-radius-lg;
	}
</style>