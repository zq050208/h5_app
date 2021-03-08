/**
 * 机型内核判断
 * @type {{versions: {trident, presto, webKit, gecko, mobile, ios, android, iPhone, iPad, webApp, weixin, qq}, language: string}}
 */
var browser={
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
};
                                                                                                                                                                                                  
/**
 * 获取用户信息
 * @returns {*}
 */
function getUserInfo() {
    var user_info;
    if(browser.versions.android){
        user_info = JSON.parse(window.titi_js.callTitiUserInfo());
    }else if(browser.versions.iPhone || browser.versions.iPad ){
        user_info = callTitiUserInfo();
    }
    return user_info;
}

/**
 * 联系客服
 */
function callService() {
    if(browser.versions.android){
        window.titi_js.callCustomerService();
    }else if(browser.versions.iPhone || browser.versions.iPad ){
        window.webkit.messageHandlers.callCustomerService.postMessage(null);
    }
}

/**
 *  requset请求 （ return .then() 接收 ）
 * @param url 请求地址
 * @param type  请求方法
 * @param data  参数
 * @param token  token
 * @returns {*|{readyState, getResponseHeader, getAllResponseHeaders, setRequestHeader, overrideMimeType, statusCode, abort}}
 */
function RequsetHttp(url, type, token, data ,callback) {
    var ajax = $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        headers: { token: token },
        data: data,
        timeout: 30000,
        beforeSend: function() {},
        complete: function(XMLHttpRequest,status){},
        error: function(xmlHttpRequest, error) {},
        success: function(res) {
            typeof callback == 'function' && callback(disposeJson(res));
        }
    });
    return ajax;
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

function urlReplace(str) {
    str = str.replace(/http:\/\/p72f3p8iq.bkt.clouddn.com\//g, "https://cdn.lsjdj.cn/");
    str = str.replace(/http:\/\/p37fikgho.bkt.clouddn.com\//g, "https://cdn.lsjdj.cn/");
    str = str.replace(/http:\/\/p1k6kyr34.bkt.clouddn.com\//g, "https://cdn.lsjdj.cn/");
    str = str.replace(/http:\/\/p1arvhkn5.bkt.clouddn.com\//g, "https://cdn.lsjdj.cn/");
    str = str.replace(/http:/g, "https:");
    return str;
}

/**
 * 获取URL参数
 * @param strName 参数名
 * @returns {string}
 * @constructor
 */
function Request(strName){
    var strHref = window.location.href;
    var intPos = strHref.indexOf("?");
    var strRight = strHref.substr(intPos + 1);
    var arrTmp = strRight.split("&");
    for(var i = 0; i < arrTmp.length; i++) {
        var arrTemp = arrTmp[i].split("=");
        if(arrTemp[0].toUpperCase() == strName.toUpperCase()) return arrTemp[1];
    }
    return "";
}