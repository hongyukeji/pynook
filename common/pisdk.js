/**
 * @name PiSDK
 * @language Vue
 * @version 1.7.0
 * @author 鸿宇 1527200768@qq.com
 * @date 2023-09-18
 */

const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = resolve;
        script.onerror = reject;
        // script.src = src + `?version=${encodeURIComponent(Math.random())}`;
        script.src = src;
        document.head.append(script);
        // reject(new Error("JS文件加载失败"));
        // resolve(src);
    });
};

const loadScriptSync = (url) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);  // 设置为同步请求
    xhr.send();
    if (xhr.status === 200) {
        var script = document.createElement('script');
        script.text = xhr.responseText;
        document.head.appendChild(script);
        return true;
    } else {
        return false;
    }
};

export default {
    loadScript() {
        let url = 'https://sdk.minepi.com/pi-sdk.js';
        return loadScript(url).then(function (res) {
            // console.log(`> 加载 ${url} 文件成功`);
        }).catch(function (err) {
            console.error(`> 加载 ${url} 文件失败`);
        });
    },
    isPiBrowser() {
        let that = this;
        let ua = window.navigator.userAgent.toLowerCase();
        // console.log('> pi userAgent', ua);
        // let isPiBrowser = ua.match(/pibrowser/i) == 'pibrowser';
        let isPiBrowser = /pibrowser/.test(ua);
        if (that.piBrowserDebug()) {
            isPiBrowser = true;
        }
        return isPiBrowser;
    },
    piBrowserDebug() {
        // console.log('> pi window.location.host:', window.location.host);
        // return true; // TODO: 开发时打开注释
        if (/localhost/.test(window.location.host)) {
            return true;
        }
        return false;
    },
    init() {
        // console.log('> pi piPaySDK.init()');
        let isPiBrowser = this.isPiBrowser();
        if (isPiBrowser && window.Pi === undefined) {
            const oScript = document.createElement('script');
            oScript.type = 'text/javascript';
            oScript.src = 'https://sdk.minepi.com/pi-sdk.js';
            document.body.appendChild(oScript);
        }
        // console.log('> pi window.Pi', window.Pi);
    },
    login({
              onIncompletePaymentFound: onIncompletePaymentFoundCallback,
          }) {
        // console.log('> pi login');
        let that = this;
        return new Promise((resolve, reject) => {
            that.loadScript().then(async function () {
                if (window.Pi === undefined) {
                    /*uni.showToast({
                        icon: 'none',
                        title: '未检测到Pi环境，请刷新重试！'
                    });
                    return;*/
                    reject(new Error("未检测到Pi环境，请刷新重试！"));
                }
                // console.log('> pi window.Pi', window.Pi);
                const Pi = window.Pi;
                let piBrowserDebug = that.piBrowserDebug();
                // console.log('> pi sandbox', piBrowserDebug);
                if (piBrowserDebug) {
                    Pi.init({
                        version: '2.0',
                        sandbox: piBrowserDebug,
                    });
                } else {
                    Pi.init({
                        version: '2.0',
                    });
                }
                // TODO: 开启沙盒模式, 正式环境注释掉 不用时必须删除 sandbox 字段参数
                // Pi.init({ version: '2.0', sandbox: true });
                // console.log('> pi window.Pi', Pi);
                // Authenticate the user, and get permission to request payments from them:
                // const scopes = ['username'];
                // https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md#scopes
                const scopes = ['username', 'payments', 'wallet_address'];

                // Read more about this callback in the SDK reference:
                function onIncompletePaymentFound(payment) {
                    // console.log('> pi authenticate onIncompletePaymentFound', payment);
                    if (typeof (onIncompletePaymentFoundCallback) == "function") {
                        onIncompletePaymentFoundCallback(payment);
                    }
                    reject(new Error("发现未完成的付款"));
                };
                // console.log('> pi authenticate scopes', scopes);
                await Pi.authenticate(scopes, onIncompletePaymentFound).then(function (auth) {
                    // console.log(`Hi there! You're ready to make payments!`);
                    // console.log('> pi authenticate auth', auth);
                    // let accessToken = auth.accessToken;
                    // let uid = auth.user.uid;
                    // let username = auth.user.username;
                    // console.log('> pi accessToken', accessToken);
                    resolve(auth);
                }).catch(function (err) {
                    // console.error(error);
                    // console.log('> pi authenticate err', err);
                    /*uni.showToast({
                        icon: 'none',
                        title: `授权发生错误：` + err
                    });*/
                    reject(new Error(err));
                });
                // console.log('> pi login err', '唤醒Pi登录失败');
                // reject(new Error("唤醒Pi登录失败"));
            }).catch(function (err) {
                // console.log('> pi loadScript err', err);
                reject(new Error(err));
            });
        });
    },
    payment(data, {
        onReadyForServerApproval: onReadyForServerApprovalCallback,
        onReadyForServerCompletion: onReadyForServerCompletionCallback,
        onIncompletePaymentFound: onIncompletePaymentFoundCallback,
        onCancel: onCancelCallback,
        onError: onErrorCallback,
    }) {
        let that = this;
        return new Promise(async (resolve, reject) => {
            // console.log('> pi piPaySDK.pay() data: ', data);
            // resolve(data);
            // reject(new Error("失败")); // 失败
            // console.log('> pi window.Pi', window.Pi);
            if (window.Pi === undefined) {
                reject(new Error("请在Pi浏览器中支付"));
                return;
            }
            const Pi = window.Pi;
            let piBrowserDebug = that.piBrowserDebug();
            // console.log('> pi sandbox', piBrowserDebug);
            if (piBrowserDebug) {
                Pi.init({
                    version: '2.0',
                    sandbox: piBrowserDebug,
                });
            } else {
                Pi.init({
                    version: '2.0',
                });
            }
            // Authenticate the user, and get permission to request payments from them:
            const scopes = ['username', 'payments'];

            // Read more about this callback in the SDK reference:
            function onIncompletePaymentFound(payment) {
                // console.log('发现未完成付款...');
                // console.log('> pi onIncompletePaymentFound payment: ', payment);
                // let paymentId = payment.identifier;
                // let txid = payment.transaction.txid;
                if (typeof (onIncompletePaymentFoundCallback) == "function") {
                    onIncompletePaymentFoundCallback(payment);
                }
                reject(new Error("发现未完成的付款"));
            };
            // pi 登录
            await Pi.authenticate(scopes, onIncompletePaymentFound).then(async function (auth) {
                // console.log(`Hi there! You're ready to make payments!`);
                // console.log('> pi auth', auth);
                // alert(JSON.stringify(auth));
                // pi 支付
                await Pi.createPayment({
                    // Amount of π to be paid:
                    amount: data.amount,
                    // An explanation of the payment - will be shown to the user:
                    memo: data.memo, // e.g: "Digital kitten #1234",
                    // An arbitrary developer-provided metadata object - for your own usage:
                    metadata: data.metadata, // e.g: { kittenId: 1234 }
                }, {
                    // Callbacks you need to implement - read more about those in the detailed docs linked below:
                    onReadyForServerApproval: function (paymentId) {
                        // console.info(`>>> Pi onReadyForServerApproval paymentId：${paymentId}`);
                        // console.log('批准付款');
                        // console.log(`paymentId：${paymentId}`);
                        if (typeof (onReadyForServerApprovalCallback) == "function") {
                            onReadyForServerApprovalCallback(paymentId);
                        }
                    },
                    onReadyForServerCompletion: function (paymentId, txid) {
                        // console.info(`>>> Pi onReadyForServerCompletion paymentId：${paymentId}`);
                        // console.log('完成付款');
                        // console.log(`paymentId：${paymentId}`);
                        // console.log(`txid：${txid}`);
                        if (typeof (onReadyForServerCompletionCallback) == "function") {
                            onReadyForServerCompletionCallback(paymentId, txid);
                        }
                        resolve({
                            paymentId: paymentId,
                            txid: txid
                        });
                    },
                    onCancel: function (paymentId) {
                        // console.warn(`>>> Pi onCancel paymentId：${paymentId}`);
                        if (typeof (paymentId) != "undefined") {
                            console.warn(`paymentId：${paymentId}`);
                        }
                        if (typeof (onCancelCallback) == "function") {
                            onCancelCallback(paymentId);
                        }
                        reject(new Error("已取消付款！"));
                    },
                    onError: function (error, payment) {
                        // console.error('>>> Pi onError error', error);
                        if (typeof (error) != "undefined") {
                            console.error('error', error);
                        }
                        if (typeof (payment) != "undefined") {
                            console.error('payment', payment);
                        }
                        if (typeof (onErrorCallback) == "function") {
                            onErrorCallback(error, payment);
                        }
                        reject(new Error("支付失败！"));
                    },
                });
            }).catch(function (error) {
                // console.error(error);
                // console.log('> pi error', error);
                reject(new Error(`授权发生错误：` + error));
            });
            // reject(new Error("唤醒Pi失败"));
        })
    },
}
