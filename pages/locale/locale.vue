<template>
	<view class="page-wrap">
		<view class="page-header"></view>
		<view class="page-body">
			<view class="container">
				<!-- 插件信息 -->
				<view style="display: none;">
					<view class="title">{{$t('index.demo')}}</view>
					<view class="description">{{$t('index.demo-description')}}</view>
					<view class="detail-link">{{$t('index.detail')}}:
						<text class="link">https://uniapp.dcloud.net.cn/collocation/i18n</text>
					</view>
				</view>
				<!-- 语言信息 -->
				<view class="locale-setting">{{$t('index.language-info')}}</view>
				<view class="list-item">
					<text class="k">{{$t('index.system-language')}}:</text>
					<text class="v">{{systemLocale}}</text>
				</view>
				<view class="list-item">
					<text class="k">{{$t('index.application-language')}}:</text>
					<text class="v">{{applicationLocale}}</text>
				</view>
				<!-- 选择语言 -->
				<view class="locale-setting">{{$t('common.form.select')}}{{$t('index.language')}}</view>
				<view class="locale-list">
					<view class="locale-item" v-for="(item, index) in applicationLocales" :key="index"
						@click="onLocaleChange(item)">
						<text class="text">{{item.text}}</text>
						<text class="icon-check" v-if="item.code == applicationLocale"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="page-footer"></view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {};
		},
		onLoad() {
			this.initLocale();
		},
		onShow() {},
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
		padding: 15px;
	}

	button {
		margin-bottom: 15px;
	}

	.title {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 15px;
	}

	.description {
		font-size: 14px;
		opacity: 0.6;
		margin-bottom: 15px;
	}

	.detail-link {
		font-size: 14px;
		word-break: break-all;
	}

	.link {
		color: #007AFF;
		margin-left: 10px;
	}

	.locale-setting {
		font-size: 16px;
		font-weight: bold;
		margin-top: 25px;
		margin-bottom: 5px;
		padding-bottom: 5px;
		border-bottom: 1px solid #f0f0f0;
	}

	.list-item {
		font-size: 14px;
		padding: 10px 0;
	}

	.list-item .v {
		margin-left: 5px;
	}

	.locale-item {
		display: flex;
		flex-direction: row;
		padding: 10px 0;
	}

	.locale-item .text {
		flex: 1;
	}

	.icon-check {
		margin-right: 5px;
		border: 2px solid #007aff;
		border-left: 0;
		border-top: 0;
		height: 12px;
		width: 6px;
		transform-origin: center;
		/* #ifndef APP-NVUE */
		transition: all 0.3s;
		/* #endif */
		transform: rotate(45deg);
	}
</style>