// @author: 鸿宇 @email: 1527200768@qq.com

import App from './App'
import fui from './common/fui-app'
import http from './common/fui-request.js'
import store from './store'

import api from './api'
import messages from './locale/index'

// mixin混入
import globalMixin from './mixins/index.js';

// 拦截器 权限拦截
import interceptor from './common/interceptor.js';

// 拦截器
interceptor()

// 国际化配置
let i18nConfig = {
	locale: uni.getLocale(),
	messages
}

// #ifndef VUE3
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.fui = fui
Vue.prototype.http = http
Vue.prototype.$api = api

Vue.mixin(globalMixin);

App.mpType = 'app'

const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue';
import {
	createI18n
} from 'vue-i18n'

/*
  在 Vue3 中，如果 nvue 使用了 Vuex 的相关 API，
  需要在 main.js 的 createApp 的返回值中 return 一下 Vuex
*/
import Vuex from "vuex";

const i18n = createI18n(i18nConfig)

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(store)
	app.config.globalProperties.fui = fui;
	app.config.globalProperties.http = http;
	app.config.globalProperties.$api = api;
	app.mixin(globalMixin);
	return {
		Vuex,
		app
	}
}
// #endif