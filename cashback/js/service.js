// var baseUrl = 'http://47.106.94.208/xhdj/activity/server/index.php/';
var baseUrl = 'https://xhdj.lsjdj.cn/xhdj/activity/server/index.php/';

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
 * */
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
* 登录
* */
function goLogin() {
    if(browser.versions.android){
        window.titi_js.callLogin();
    }else if(browser.versions.iPhone || browser.versions.iPad ){
        window.webkit.messageHandlers.callLogin.postMessage(null);
    }
}

/**
* 实名制
* */
function goRealName() {
    if(browser.versions.android){
        window.titi_js.callRealName();
    }else if(browser.versions.iPhone || browser.versions.iPad ){
        window.webkit.messageHandlers.callRealName.postMessage(null);
    }
}

/**
 * 绑定支付宝
 * @param name 真实姓名
 */
function goAliAccount(name) {
    if(browser.versions.android){
        window.titi_js.callAliAccount(name);
    }else if(browser.versions.iPhone || browser.versions.iPad ){
        window.webkit.messageHandlers.callAliAccount.postMessage(null);
    }
}

/**
 * 申请陪玩
 */
function goPlayApply() {
    if(browser.versions.android){
        window.titi_js. callPlayApply();
    }else if(browser.versions.iPhone || browser.versions.iPad ){
        window.webkit.messageHandlers.callPlayApply.postMessage(null);
    }
}

/**
 * 陪玩详情页
 * @param type 陪玩类型
 * @param uid 陪玩id
 * */
function goPlayUser(type,uid) {
    if(browser.versions.android){
        window.titi_js.callPlayUser(type,uid);
    }else if(browser.versions.iPhone || browser.versions.iPad ){
        var data = { type:type,uid: uid};
        window.webkit.messageHandlers.callPlayUser.postMessage(JSON.stringify(data));
    }
}

/**
 * 联系客服
 * */
function callService() {
    if(browser.versions.android){
        window.titi_js.callCustomerService();
    }else if(browser.versions.iPhone || browser.versions.iPad ){
        window.webkit.messageHandlers.callCustomerService.postMessage(null);
    }
}
/**
 * requset请求
 * */
function requsetHttp(url, type, data ) {
    var ajax = $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        data: data,
        timeout: 30000,
        beforeSend: function() {},
        complete: function(XMLHttpRequest,status){},
        error: function(xmlHttpRequest, error) {},
        success: function(res) {return disposeJson(res);}
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
 * */
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