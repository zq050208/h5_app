    /**
     * 时间转换为N 时间段 前
     * @param dateTimeStamp 时间毫秒
     * @returns {*}
     */
    function timeago(dateTimeStamp) {   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
        var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
        var hour = minute * 60;
        var day = hour * 24;
        var week = day * 7;
        var halfamonth = day * 15;
        var month = day * 30;
        var now = new Date().getTime();   //获取当前时间毫秒
        var diffValue = now - dateTimeStamp;//时间差
        if (diffValue < 0) {
            return;
        }
        var minC = diffValue / minute;  //计算时间差的分，时，天，周，月
        var hourC = diffValue / hour;
        var dayC = diffValue / day;
        var weekC = diffValue / week;
        var monthC = diffValue / month;
 
        if (monthC >= 1 && monthC <= 3) {
            result = " " + parseInt(monthC) + "月前"
        } else if (weekC >= 1 && weekC <= 3) {
            result = " " + parseInt(weekC) + "周前"
        } else if (dayC >= 1 && dayC < 7) {
            result = " " + parseInt(dayC) + "天前"
        } else if (hourC >= 1 && hourC < 24) {
            result = " " + parseInt(hourC) + "小时前"
        } else if (minC >= 1 && minC < 60) {
            result = " " + parseInt(minC) + "分钟前"
        } else if (diffValue >= 0 && diffValue <= minute) {
            result = "刚刚"
        } else {
            var datetime = new Date();
            datetime.setTime(dateTimeStamp);
            var Nyear = datetime.getFullYear();
            var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
            var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
            var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
            var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
            var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
            result = Nyear + "-" + Nmonth + "-" + Ndate
        }
        return result;
    }


      /**
     * 时间转换为N 时间段 前
     * @param dateTimeStamp 时间毫秒
     * @returns {*}
     */
    function timeagoNew(dateTimeStamp) {   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
       
        var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
        var hour = minute * 60;
        var day = hour * 24;
        var week = day * 7;
        var halfamonth = day * 15;
        var month = day * 30;
        var now = new Date().getTime();   //获取当前时间毫秒
        var diffValue = now - dateTimeStamp;//时间差
      
        if (diffValue < 0) {
            return;
        }



        var time = new Date(dateTimeStamp);
        // 展示用的
        var Nmonth = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
        var Ndate = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
       
        var Nhour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
        var Nminute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
        var birthD=Nhour+":"+Nminute;
        var birthMonth=Nmonth+"月"+Ndate+"日"+birthD;
        // 判断用
        var isDate = new Date().getDate()-time.getDate()
        var isYe = new Date().getFullYear()-time.getFullYear()
        // 获取小时
        var getH =Math.abs(new Date().getHours()-time.getHours())
        // 获取分钟
        var getF =Math.abs(new Date().getMinutes()-time.getMinutes())

        var minC = (diffValue / minute);  //计算时间差的分，时，天，周，月
        // var hourC = diffValue / hour;
        // var dayC = diffValue / day;
        // var weekC = diffValue / week;
        // var monthC = diffValue / month;
 
        if (isYe>=1) {
            var datetime = new Date();
            datetime.setTime(dateTimeStamp);
            var Nyear = datetime.getFullYear();
            var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
            var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
            result = Nyear + "年" + Nmonth + "月" + Ndate+'日'
        }else if (isYe == 0&&isDate !== 1&&isDate !== 0) {
            result =birthMonth
        } else if (isYe == 0&&isDate === 1) {
            result  = '昨天'+birthD
        }else if (isYe == 0&&isDate == 0&&minC>=60) {
            result  = '今天'+birthD
        // } else if (10<getF&&getF<60&&isYe == 0&&isDate == 0&&getH<=1) {
        } else if (10<minC&&minC<60) {
            result = " " + Math.round(minC) + "分钟前"
        } else if (0<=getF&&getF<=10&&isYe == 0&&isDate == 0&&getH===0) {
            result = "刚刚"
        } else {
            debugger
            var datetime = new Date();
            datetime.setTime(dateTimeStamp);
            var Nyear = datetime.getFullYear();
            var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
            var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
            var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
            var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
            var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
            result = Nyear + "年" + Nmonth + "月" + Ndate+'日'
        }
        return result;
    }
    
    /**
     * 获取富文本内容
     * @param html 富文本内容
     * @returns {*}
     */
    function getSimpleText(html) {
        var re1 = new RegExp("<.+?>", "g");//匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
        if (html) {
            var msg = html.replace(re1, '');//执行替换成空字符
            return msg;
        }
        return msg;
    }

    /**
     * 获取富文本图片链接
     * @param html 富文本内容
     * @returns {*}
     */
    function getSimpleImgList(htmlstr) {
        htmlstr = (htmlstr).replace(/<img/gi, "<img class='richImg'style='display: none;width:auto!important;height:auto!important;max-height:100%;width:100%;'");
        htmlstr = htmlstr.replace(/<p>/gi, '')
        htmlstr = htmlstr.replace(/<\/p>/gi, '')
        let html = `<div>${htmlstr}</div>`
        htmlstr = html.replace(/<div/gi, "<div class='rich-text'")
        let imgReg = /<img.*?(?:>|\/>)/gi
        let nameReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
        let arrstr = htmlstr.match(imgReg)
        var photos = []
        if (arrstr) {
            for (var j = 0; j < arrstr.length; j++) {
                let names = arrstr[j].match(nameReg)
                if (names[1]) {
                    photos.push(names[1])
                }
            }
        }
        return photos
    }

    /**
     * replaceClass 替换样式
     * para1：element 类标签
     * para2：removeclass 移除样式
     * para3：addclass 新增样式
     */
    function replaceClass(element,removeclass,addclass){
        // 获取元素对象
        var eleObject = document.getElementsByClassName(element);
        // 移除样式
        eleObject[0].classList.remove(removeclass);
        // 新增样式
        eleObject[0].classList.add(addclass);
    }