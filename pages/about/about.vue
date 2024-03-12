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
				<!-- <hr />
				<view class="info">
					{{$t('common.app.browser')}}: {{userAgent}}
				</view> -->
				<!-- <hr />
				<view class="client-info">
					{{$t('common.client-info')}}:
					<text style="word-break: break-all;">
						{{JSON.stringify(clientInfo)}}
					</text>
				</view>
				<hr />
				<button @click="toClientInfo">getClientInfo</button> -->
			</view>
		</view>
		<view class="page-footer">
			<!-- <custom-tab-bar class="tab-bar-flex" direction="vertical" :show-icon="false" :selected="selected" @onTabItemTap="onTabItemTap" /> -->
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
				userAgent: window.navigator.userAgent.toLowerCase(),
				selected: {
					component: 0,
					API: 1,
					extUI: 2,
					template: 3
				},
				current: 0,
				clientInfo: {},
			};
		},
		computed: {},
		onLoad() {},
		onShow() {
			// console.log(this.toFixed("0.00000000100"))
			// this.getClientInfo();
		},
		onReady() {},
		methods: {
			async getClientInfo() {
				const formData = {}
				await this.$api.common.getClientInfo(formData).then((res) => {
					const data = res.data?.data;
					this.clientInfo = data;
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
		box-sizing: border-box;
	}

	.tab-bar-flex {
		width: 360px;
	}
</style>