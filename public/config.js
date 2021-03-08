var practicalVersion = '3.3.0';
var baseUrl = getRequestUrl();
/**
 * 根据版本号获取当前域名
 * @returns {string}
 */
function getRequestUrl() {
    var url = '';
    var currentVersion = Request('appversion');
    var v = Version(currentVersion, practicalVersion);
    if (v == 1) { //旧版本
        url = 'http://192.168.1.241/tinytiger_app/public/index.php/'  //测试环境
        // url = 'http://tinytiger_app.titipa.cn/xhdj/tinytiger_app/public/index.php/';            //预发布
        // url = 'https://app.tinytiger.cn/xhdj/tinytiger_app/public/index.php/'; //正式

        // 以下地址暂时用不到
        // url = 'http://aladdin_api.titipa.cn/tinytiger_app/public/index.php/'
        // url = 'https://testapi.lsjdj.cn/'
        // url = 'https://apitest.lsjdj.cn/' //测试（LIN）
        // url = 'https://apirelease.lsjdj.cn/';            //预发布
        // url = 'http://47.95.206.26:9093/';            //预发布ip
        // url = 'http://120.78.247.123/'; //正式ip
    } else { //新版本
        url = 'http://192.168.1.241/tinytiger_app/public/index.php/'  //测试环境
        // url = 'http://tinytiger_app.titipa.cn/xhdj/tinytiger_app/public/index.pxhp/';            //预发布
        // url = 'https://app.tinytiger.cn/xhdj/tinytiger_app/public/index.php/'; //正式

        // 以下地址暂时用不到
        // url = 'http://aladdin_api.titipa.cn/tinytiger_app/public/index.php/'
        // url = 'https://testapi.lsjdj.cn/'
        // url = 'https://apitest.lsjdj.cn/' //测试（LIN）
        // url = 'https://apirelease.lsjdj.cn/';            //预发布
        // url = 'http://47.95.206.26:9093/';            //预发布ip
        // url = 'http://120.78.247.123/'; //正式ip
    }
    return url;
}

/**
 * 版本号对比
 * @param curV 当前版本号
 * @param reqV 实际版本号
 * @returns {number}
 * @constructor
 */
function Version(curV, reqV) {
    var arr1 = curV.split('.');
    var arr2 = reqV.split('.');
    //将两个版本号拆成数字
    var minL = Math.min(arr1.length, arr2.length);
    var pos = 0; //当前比较位
    var diff = 0; //当前为位比较是否相等

    //逐个比较如果当前位相等则继续比较下一位
    while (pos < minL) {
        diff = parseInt(arr1[pos]) - parseInt(arr2[pos]);
        if (diff != 0) {
            break;
        }
        pos++;
    }

    if (diff > 0) {
        //新版本
        return 0;
    } else if (diff == 0) {
        //稳定版
        return 0;
    } else {
        //旧版本
        return 1;
    }
}

/**
 * 获取URL参数
 * @param strName 参数名
 * @returns {string}
 * @constructor
 */
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