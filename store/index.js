// @author: 鸿宇 @email: 1527200768@qq.com
// import createPersistedState from 'vuex-persistedstate' // 引入数据持久化插件
// #ifdef MP
import http from '../common/fui-request'
// #endif
// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
// #endif

// #ifdef VUE3
import {
	createStore
} from 'vuex'
const store = createStore({
	// plugins 插件配置 npm install --save vuex-persistedstate
	/* plugins: [createPersistedState({
		// key: "vuex", // 设置存储的名称，可以自定义
		paths: ['user',],
		// 设置存储的方式，可以使用本地存储或者其他方式
		storage: {
			getItem: key => uni.getStorageSync(key), // 获取
			setItem: (key, value) => uni.setStorageSync(key, value), // 存储
			removeItem: key => uni.removeStorageSync(key) // 删除
		}
	})], */
	// #endif
	state: {
	},
	mutations: {
	},
	actions: {
	},
	// https://zh.uniapp.dcloud.io/tutorial/vue3-vuex.html#module
	modules: {}
})

// 自动import导入所有 modules 模块
const modules = {}
const context = import.meta.globEager('./modules/*.js')
Object.entries(context).forEach(([key, value]) => {
  const moduleName = key.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
  modules[moduleName] = value.default
})

// 自动注册模块
Object.keys(modules).forEach(moduleName => {
  store.registerModule(moduleName, modules[moduleName])
})

export default store
