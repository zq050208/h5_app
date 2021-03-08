
/**
 * 机型内核判断
 * @type {{versions: {trident, presto, webKit, gecko, mobile, ios, android, iPhone, iPad, webApp, weixin, qq}, language: string}}
 */
var browser = {
    versions: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

/**
 * requset请求
 * @param url 地址
 * @param type 方式
 * @param data  参数
 * @returns {*} 返回请求对象 .then()接收
 */
function requsetHttp(url, type, data, token, callback) {
    var ajax = $.ajax({
        url: baseUrl + url,
        type: type,
        dataType: 'json',
        data: data,
        timeout: 30000,
        beforeSend: function (xhr) {
            if (token) xhr.setRequestHeader('token', token);
            if (data.v && data.v != null) xhr.setRequestHeader('v', data.v)

        },
        complete: function (XMLHttpRequest, status) { },
        error: function (xmlHttpRequest, error) { },
        success: function (res) { typeof callback == 'function' && callback(disposeJson(res)); }
    });
}

/**
 *  requset请求 （ return .then() 接收 ）
 * @param url 请求地址
 * @param type  请求方法
 * @param data  参数
 * @param token  token
 * @returns {*|{readyState, getResponseHeader, getAllResponseHeaders, setRequestHeader, overrideMimeType, statusCode, abort}}
 */
function RequsetHttp(url, type, token, data, callback) {
    var ajax = $.ajax({
        url: baseUrl + url,
        type: type,
        dataType: 'json',
        headers: { token: token },
        data: data,
        timeout: 30000,
        beforeSend: function () { },
        complete: function (XMLHttpRequest, status) { },
        error: function (xmlHttpRequest, error) { },
        success: function (res) {
            typeof callback == 'function' && callback(disposeJson(res));
        }
    });
    return ajax;
}

function changeTime(time) {
    return time.substring(4, 16).replace(/-/g, "月").replace(/\s/g, "日 ").substr(1)
}

/**
 * requset自定义baseurl请求
 * @param url 地址
 * @param type 方式
 * @param data  参数
 * @returns {*} 返回请求对象 .then()接收
 */
function requsetHttpUrl(dataBaseUrl, url, type, data, token, callback) {
    var ajax = $.ajax({
        url: dataBaseUrl + url,
        type: type,
        dataType: 'json',
        data: data,
        timeout: 30000,
        beforeSend: function (xhr) {
            if (token) xhr.setRequestHeader('token', token);
            if (data.v && data.v != null) xhr.setRequestHeader('v', data.v)

        },
        complete: function (XMLHttpRequest, status) { },
        error: function (xmlHttpRequest, error) { },
        success: function (res) { typeof callback == 'function' && callback(disposeJson(res)); }
    });
}


/**
 * 获取用户信息
 * @returns {*}
 */
function getUserInfo() {
    var user_info = {};
    //增加debug模式取值url参数，默认值false。
    var debug = arguments[0] ? arguments[0] : false;
    if (debug) {
        user_info = { token: Request('token'), user_id: Request('user_id') }
        return user_info;
    } else {
        try {
            if (browser.versions.android) {
                user_info = JSON.parse(window.titi_js.callTitiUserInfo());
            } else if (browser.versions.iPhone || browser.versions.iPad) {
                user_info = callTitiUserInfo();
            }
        } catch (e) {

        }
        return user_info;
    }
}

/**
 * 联系客服
 */
function callService() {
    if (browser.versions.android) {
        window.titi_js.callCustomerService();
    } else if (browser.versions.iPhone || browser.versions.iPad) {
        window.webkit.messageHandlers.callCustomerService.postMessage(null);
    }
}

/**
 * 登录
 */
function goLogin() {
    if (browser.versions.android) {
        window.titi_js.callLogin();
    } else if (browser.versions.iPhone || browser.versions.iPad) {
        window.webkit.messageHandlers.callLogin.postMessage(null);
    }
}

/***
 * 开启一个新web
 */
function callNewWeb(url) {
    if (browser.versions.android) {
        window.titi_js.callNewWeb(url);
    } else if (browser.versions.iPhone || browser.versions.iPad) {
        window.webkit.messageHandlers.callNewWeb.postMessage(url);
    }
}
/***
 * 回退页面
 */
function callFinish() {
    if (browser.versions.android) {
        window.titi_js.callFinish();
    } else if (browser.versions.iPhone || browser.versions.iPad) {
        window.webkit.messageHandlers.callFinish.postMessage(null);
    }
}
/***
 * 显示右上角分享按钮
 * @param obj
 * @type   显示类型：1.显示图片 2.显示文字
 * @content  1.内容  2.url
 * @method  执行回调方法
 */
function showWebShare(obj) {
    try {
        if (browser.versions.android) {
            window.titi_js.callTitle(JSON.stringify(obj));
        } else if (browser.versions.iPhone || browser.versions.iPad) {
            window.webkit.messageHandlers.callTitle.postMessage(JSON.stringify(obj));
        }
    } catch (e) {
        config.share = true;
    }
}

function addFooterShare(data) {
    var style = `<style>
    body{  padding-bottom: constant(safe-area-inset-bottom); padding-bottom: env(safe-area-inset-bottom);}
    footer{display: none; }
    .mask {position: fixed;background: rgba(0, 0, 0, 0.2);top: 0;left: 0;z-index: 99;width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;border-radius: 4px}
    .footer{ position: fixed;bottom: 0;display: flex;width: 100%;justify-content: center;align-items: center;background: #FFFFFF;z-index: 100; padding-bottom: env(safe-area-inset-bottom)}
    .footer .share{flex: 1;display: flex;justify-content: center;align-items: center;flex-direction: column;padding: 12px 0 8px 0;z-index: 120;background: #ffffff; padding-bottom: env(safe-area-inset-bottom)}
    .footer .share>span{padding-top: 5px}
    .footer img{height: 30px}
    .bulk{height: 76px !important;display: none}</style>`;
    var footer = `
        <footer>
            <div class="mask"></div>
            <div class="footer">
            <div class="share"><img src="../activity/img/invite-WeChat.png"/><span>微信</span></div>
            <div class="share"><img src="../activity/img/invite-discover.png"/><span>朋友圈</span></div>
            <div class="share"><img src="../activity/img/invite-QQ.png"/><span>QQ</span></div>
            <!--<div class="share copylink"><img src="../activity/img/invite-link.png"/><span>复制链接</span></div>-->
            </div>
        </footer>`;
    $('body').append(`<div class="bulk"></div>`);
    $('html').append(footer + style);
    $('footer .mask').click(function () {
        $('footer').hide();
        $('.bulk').hide();
    })
    $('footer .share').click(function () {
        var obj = {
            shareUrl: data.shareUrl,
            title: data.title,
            desc: data.desc,
            img: data.img,
            type: $(this).index()
        };
        if (browser.versions.android) {
            window.titi_js.callShare(JSON.stringify(obj));
        } else {
            window.webkit.messageHandlers.callShare.postMessage(JSON.stringify(obj));
        }
        $('footer .mask').click();
    });
}
/**
 * 唤起分享显示
 */
function callShowShare() {
    $('footer').show();
    $('.bulk').show();
}

/**
 * scheme 唤醒app
 * @param type 类型  1:新闻详情 2:视频详情 3:用户主页 4:游戏详情 5:点评详情 6:百科详情,7:圈子详情，8：帖子详情
 * @param id 主键id  
 * @param key 主键子id
 */
function goApp(type, id) {
  
    // var androidlink = 'tt://titi:8888/from?startType=' + type + '&id=' + id
    // var ioslink = 'tinytiger1325045766://?startType=' + type + '&id=' + id
    console.log('唤醒app')
    var key = arguments[2] ? arguments[2] : null
    var androidlink = 'tt://titi:8888/from?startType=' + type + '&id=' + id
    var ioslink = 'tinytiger1325045766://?startType=' + type + '&id=' + id
    // 如果有传入key值，则需要加上key
    if (key) {
      androidlink += '&key=' + key
      ioslink += '&key=' + key
    }

    var downloadUrl = 'https://h5.tinytiger.cn/web_app/new_information/download.html'
    // var downloadUrl = 'https://release.titipa.cn/web_app/new_information/download.html'

    
    if (browser.versions.android) {
        if (browser.versions.weixin) {
            $(".shareModal").show()
        } else {
            window.location = androidlink
            var loadDateTime = new Date()
            window.setTimeout(function () {
                var timeOutDateTime = new Date()
                if (timeOutDateTime - loadDateTime < 5000) {
                    window.location = downloadUrl
                } else {
                    window.close();
                }
            }, 500);
        }
    } else {
        if (browser.versions.weixin || browser.versions.qq) {
            $(".shareModal").show()
        } else {
            window.location = ioslink
            var loadDateTime = new Date()
            window.setTimeout(function () {
                var timeOutDateTime = new Date()
                if (timeOutDateTime - loadDateTime < 5000) {
                    window.location = downloadUrl
                } else {
                    window.close();
                }
            }, 500);
        }
    }
}

/**
 * 单位处理
 */
function returnNum(data) {
    if (Number(data) < 10000) {
        return data
    } else {
        var num = (Number(data) / 10000).toFixed(1) + 'w'
        return num
    }

}

/**
 * 时间处理方法
 */
function getDateDiff(endTime) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var oldtime = new Date(endTime.replace(/-/g, "/"));
    var now = new Date();
    var newMomth = now.getFullYear()
    var oldMonth = oldtime.getFullYear()
    var diffValue = now.getTime() - oldtime.getTime();
    if (diffValue < 0) {
        return;
    }
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (minC <= 10) {
        result = '刚刚'
    } else if (minC >= 10 && minC <= 60) {
        result = ' ' + parseInt(minC) + '分钟前'
    } else if (dayC < 1 && minC >= 60) {
        result = '今天' + endTime.substring(11, 16)
    } else if (newMomth == oldMonth && dayC >= 3) {
        result = endTime.substring(4, 16).replace(/-/g, "月").replace(/\s/g, "日 ").substr(1)
    } else if (dayC >= 1 && hourC >= 24 && newMomth == oldMonth) {
        result = '昨天' + endTime.substring(11, 16)
    } else {
        result = endTime.substring(0, 11).replace(/-/, "年").replace(/-/, "月").replace(/\s/, "日")
    }
    return result;
}

/**
 * 实名制
 * */
function goRealName() {
    if (browser.versions.android) {
        window.titi_js.callRealName();
    } else if (browser.versions.iPhone || browser.versions.iPad) {
        window.webkit.messageHandlers.callRealName.postMessage(null);
    }
}

/**
 * 绑定支付宝
 * @param name 真实姓名
 */
function goAliAccount(name) {
    if (browser.versions.android) {
        window.titi_js.callAliAccount(name);
    } else if (browser.versions.iPhone || browser.versions.iPad) {
        window.webkit.messageHandlers.callAliAccount.postMessage(null);
    }
}

/**
 * 申请陪玩
 */
function goPlayApply() {
    if (browser.versions.android) {
        window.titi_js.callPlayApply();
    } else if (browser.versions.iPhone || browser.versions.iPad) {
        window.webkit.messageHandlers.callPlayApply.postMessage(null);
    }
}

/**
 * 陪玩详情页
 * @param type 陪玩类型
 * @param uid 陪玩id
 * */
function goPlayUser(type, uid) {
    if (browser.versions.android) {
        window.titi_js.callPlayUser(type, uid);
    } else if (browser.versions.iPhone || browser.versions.iPad) {
        var data = { type: type, uid: uid };
        window.webkit.messageHandlers.callPlayUser.postMessage(JSON.stringify(data));
    }
}

/**
 * 验证手机号
 * @param m  手机号
 * @returns {boolean}
 */
function checkmobile(m) {
    return /^[1][3-9][0-9]{9}$/.test(m);
}

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
hasKey = (obj, key) => {
    if (key) return key in obj;
    else {
        let keysArr = Object.keys(obj);
        return keysArr.length
    }
}

/**
 * 替换指定地址
 * @param obj 请求返回的数据
 * @returns {*}
 */
function disposeJson(obj) {
    for (var k in obj) {
        if (Object.prototype.toString.call(obj[k]) === "[object String]") {
            obj[k] = urlReplace(obj[k]);
        } else {
            disposeJson(obj[k]);
        }
    }
    return obj;
}
/**
 * 复制文本内容
 * @param val 文本内容
 * @returns {*}
 */
function textCopy(val) {
    if (browser.versions.android) {
        window.titi_js.callCopy(val);
    } else if (browser.versions.iPhone || browser.versions.iPad) {
        window.webkit.messageHandlers.callCopy.postMessage(val);
    }
}
/**
 * 去充值(铜钱)
 * @returns {*}
 */
function coinsRecharge() {
    if (browser.versions.android) {
        window.titi_js.callRecharge();
    } else if (browser.versions.iPhone || browser.versions.iPad) {
        window.webkit.messageHandlers.callRecharge.postMessage(null);
    }
}

function urlReplace(str) {
    str = str.replace(/http:\/\/p72f3p8iq.bkt.clouddn.com\//g, "https://cdn.tinytiger.cn/");
    str = str.replace(/http:\/\/p37fikgho.bkt.clouddn.com\//g, "https://cdn.tinytiger.cn/");
    str = str.replace(/http:\/\/p1k6kyr34.bkt.clouddn.com\//g, "https://cdn.tinytiger.cn/");
    str = str.replace(/http:\/\/p1arvhkn5.bkt.clouddn.com\//g, "https://cdn.tinytiger.cn/");
    str = str.replace(/cdn.lsjdj.cn/g, "cdn.tinytiger.cn");
    str = str.replace(/http:/g, "http:");
    return str;
}

/**
 * 获取URL参数
 * */
function Request(strName) {
    var strHref = window.location.href;
    var intPos = strHref.indexOf("?");
    var strRight = strHref.substr(intPos + 1);
    var arrTmp = strRight.split("&");
    for (var i = 0; i < arrTmp.length; i++) {
        var arrTemp = arrTmp[i].split("=");
        if (arrTemp[0].toUpperCase() == strName.toUpperCase()) return arrTemp[1];
    }
    return "";
}

