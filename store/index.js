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
					isLogin: uni.getStorageSync("firstui_m_token") ? true : false
				},
				mutations: {
					//登录
					login(state, payload) {
						if (payload) {
							state.token = payload.token
							uni.setStorageSync('firstui_m_token',payload.token)
						}
						state.isLogin = true
					},
					//退出登录
					logout(state) {
						state.token = ""
						state.isLogin = false
						uni.removeStorageSync('firstui_m_token')
					}
				},
				actions: {

				}
			})

			export default store
