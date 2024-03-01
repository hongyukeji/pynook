// @author: 鸿宇 @email: 1527200768@qq.com
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
	// #endif
	state: {
		//是否登录
		isLogin: uni.getStorageSync("token") ? true : false
	},
	mutations: {
		//登录
		login(state, payload) {
			if (payload) {
				state.token = payload.token
				uni.setStorageSync('token',payload.token)
			}
			state.isLogin = true
		},
		//退出登录
		logout(state) {
			state.token = ""
			state.isLogin = false
			uni.removeStorageSync('token')
		}
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
