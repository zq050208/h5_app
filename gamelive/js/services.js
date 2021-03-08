/**
 *
 * @param url 请求地址
 * @param type  请求方法
 * @param data  参数
 * @param token  token
 * @returns {*|{readyState, getResponseHeader, getAllResponseHeaders, setRequestHeader, overrideMimeType, statusCode, abort}}
 */
function requsetHttp(url, type, token, data ,callback) {
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
        success: function(res) { typeof callback == 'function' && callback(disposeJson(res));}
    });
    return ajax;
}

function loginHttp(url, type, data ) {
    var ajax = $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        data: data,
        timeout: 30000,
        beforeSend: function() {},
        complete: function(XMLHttpRequest,status){},
        error: function(xmlHttpRequest, error) {},
        success: function(res) { }
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
 * @param strName
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

/**
 * 验证手机号
 * @param m  手机号
 * @returns {boolean}
 */
function checkmobile(m) {
    return /^[1][3-9][0-9]{9}$/.test(m);
};