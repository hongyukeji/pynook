import api from '@/api'

export default {
	namespaced: true,
	state: {
		items: [],
		cartList: [],
		cartTotalQuantity: 0,
	},
	getters: {},
	mutations: {
		setCartData(state, data) {
			// console.log('---> setCartData :', data);
			Object.keys(data).forEach(key => {
				state[key] = data[key];
			});
		},
		setCartTotalQuantity(state, data) {
			console.log('---> setCartTotalQuantity :', data);
			state.cartTotalQuantity = data || 0;
			// 计算购物车总数量
			/* let totalQuantity = 0;
			for (let cart of state.cartList) {
				totalQuantity += Number(cart.quantity);
			}
			console.log('---> totalQuantity :', totalQuantity);
			state.cartTotalQuantity = totalQuantity; */
		},
		setCartList(state, data) {
			// console.log('---> setCartList :', data);
			state.cartList = data;
		},
		// minus - , plus +
		add(state, data) {
			// console.log('---> add :', data);
		},
		update(state, data) {
			// console.log('---> update :', data);
		},
		delete(state, data) {
			// console.log('---> delete :', data);
		},
		// 选择单个
		select(state, data) {
			// console.log('---> select :', data);
		},
		// 全选
		selectAll(state, checked) {
			// console.log('---> selectAll :', data);
		},
	},
	actions: {
		getCartList({
			state,
			commit
		}, params) {
			return new Promise((resolve, reject) => {
				api.cart.getCartList(params).then(res => {
					const data = res.data.data;
					// console.log('---> getCartList :', data);
					const items = data.records;
					commit('setCartList', items);
					// this.dispatch('cart/getCartCount');
					resolve(res);
				}).catch(error => {
					reject(error);
				})
			})
		},
		getCartTotalQuantity({
			state,
			commit
		}, params) {
			return new Promise((resolve, reject) => {
				api.cart.getCartTotalQuantity(params).then(res => {
					const data = res.data.data;
					const totalQuantity = data;
					commit('setCartTotalQuantity', totalQuantity);
					resolve(res);
				}).catch(error => {
					reject(error);
				})
			})
		},
		addCart({
			state,
			commit
		}, params) {
			return new Promise((resolve, reject) => {
				api.cart.addCart(params).then(res => {
					const data = res.data.data;
					// console.log('---> addCart :', data);
					resolve(res);
				}).catch(error => {
					reject(error);
				})
			})
		},
		updateCart({
			state,
			commit
		}, params) {
			return new Promise((resolve, reject) => {
				api.cart.updateCart(params).then(res => {
					const data = res.data.data;
					// console.log('---> updateCart :', data);
					resolve(res);
				}).catch(error => {
					reject(error);
				})
			})
		},
		deleteCart({
			state,
			commit
		}, params) {
			return new Promise((resolve, reject) => {
				api.cart.deleteCart(params).then(res => {
					const data = res.data.data;
					// console.log('---> deleteCart :', data);
					resolve(res);
				}).catch(error => {
					reject(error);
				})
			})
		},
	}
}