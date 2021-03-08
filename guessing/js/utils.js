 /**
     * 日期格式化
     * @param str 日期
     * @returns {string}
     */
    function simpleDateFormat(str) {
        return str.split(" ")[0].replace(/-/g,".");
    }
    
    /**
     * 积分金币换算
     * @param str
     * @returns {string}
     */
    function getRedpacketType(obj){
        var des = '';
        if(obj.type == 1){
            des = '积分'
        }else{
            des = '金币'
        }
        return des
    }