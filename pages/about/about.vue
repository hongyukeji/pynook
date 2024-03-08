<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container" style="padding: 30px;">
				<view class="app-info">
					<view class="app-name">
						{{$t('common.app.name')}}: {{ globalConfig?.app?.name }}
					</view>
					<view class="app-version">
						{{$t('common.app.version')}}: {{ globalConfig?.app?.version }}
					</view>
				</view>
				<view class="info">
					{{$t('common.app.browser')}}: {{userAgent}}
				</view>
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
				userAgent: window.navigator.userAgent.toLowerCase(),
			};
		},
		computed: {},
		onLoad() {},
		onShow() {
			console.log(this.toFixed("0.00000000100"))
		},
		onReady() {},
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
		box-sizing: border-box;
		// margin: $uni-spacing-col-lg $uni-spacing-row-lg;
		// padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	}
</style>