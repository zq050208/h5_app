$(function () {

    var config = {
        $tab : $('#J_Tab'),
        mescroll: initMescroll(),
        couponListUrl: 'RedPacketController/redPacketList',
        type: 'post',
        token: Request('token') ,
        data: { status: 1, page: 1 },
        up: 'up',
        flush: 'flush'
    };

    var load = {
        /**
         * 优惠券初始化
         * @param index //当前nav选中下标
         * @param type  //类型 up：加载  flush：刷新
         * @param callback //回调
         */
        init: function (index,type) {
            if(type == 'flush'){
                config.data.page = 1;
            }
            requsetHttp(config.couponListUrl, config.type, config.data, config.token,(res)=>{
                var str = '';
                var list = res.data.list;

                if(!list.length && config.data.page == 1){
                    config.mescroll.endSuccess();
                    $('.tab-panel .tab-panel-item').eq(index).html('<div class="default-ticket"><img src="image/icon-default-ticket.png"><span>暂无红包</span></div>');
                    config.mescroll.endByPage(res.data.list.length, res.data.page.totalPage);
                    config.mescroll.hideUpScroll(true);
                    return false;
                }
                for(var i=0; i< list.length; i++){
                    str += '<div class="ticket '+(config.data.status == 1 || config.data.status == 2 ? '' : 'opacity')+'">\
                                <div class="ticket-left">\
                                    <span class="font-16 ticket-left-top">'+parseFloat(list[i].amount)+'</span>\
                                    <span class="font-12">'+getRedpacketType(list[i])+'</span>\
                                </div>\
                                <div class="ticket-right">\
                                    <span class="font-16 ticket-right-top">'+list[i].desc+'</span>\
                                    <span class="font-12">有效期：'+simpleDateFormat(list[i].end_time)+'</span>\
                                </div>'
                            if(config.data.status == 1){
                                str += ' <div class="ticket-get"><div class="get" data-id='+list[i].red_packet_id+'>领取</div></div>\
                                </div>'
                            }
                            if(config.data.status == 2){
                                str += ' <div class="ticket-get"><div class="geted">已领取</div></div>\
                                </div>'
                            }
                            if(config.data.status == -1){
                                str += ' <div class="ticket-get"></div>\
                                </div>'
                            }

                }
                if(type == 'flush'){
                    config.mescroll.endSuccess();
                    config.mescroll.optUp.page.num = 1;
                    config.mescroll.endByPage(res.data.list.length, res.data.page.totalPage);
                    $('.tab-panel .tab-panel-item').eq(index).html(str);
                }else{
                    config.mescroll.endByPage(res.data.list.length, res.data.page.totalPage);
                    $('.tab-panel .tab-panel-item').eq(index).append(str);
                }
                $(".ticket-get .get").click(function(){
                    var obj = { redid : $(this).attr('data-id') };
                     // location.href = 'reddetail.html?redid=' + obj.redid;
                    if (browser.versions.android) {
                        window.titi_js.callRedInfo(JSON.stringify(obj));
                    } else {
                        window.webkit.messageHandlers.callRedInfo.postMessage(JSON.stringify(obj));
                    }
                });
                config.data.page ++;
            })
        }
    };

    //初始化顶部nav
    config.$tab.tab({ nav: '.tab-nav-item', panel: '.tab-panel-item', activeClass: 'tab-active'});
    config.$tab.find('.tab-nav-item').on('open.ydui.tab', function (e) {
        var index = e.index;
        if(index == 0) config.data.status = 1;
        else if(index == 1) config.data.status = 2;
        else if(index == 2) config.data.status = -1;
        config.data.page = 1; //初始化当前页数
        load.init(index,config.flush);
        config.mescroll.endUpScroll(false);
    });

    /**
     * mescroll 配置
     */
    function initMescroll() {
        var mescroll  =  new MeScroll("mescroll", {
            up: {
                callback: upCallback,
                isBounce: false,
                noMoreSize: 5,
                auto: false,
                htmlNodata: '<p class="upwarp-nodata">没有更多了</p>'
            },
            down: { callback: downCallback }
        });
        return mescroll;
    }

    /**
     * 下拉刷新的回调
     */
    function downCallback() {
        var index = $('.tab-nav .tab-active').index();
        load.init(index,config.flush);
    }

    /**
     * 上拉加载的回调
     */
    function upCallback() {
        var index = $('.tab-nav .tab-active').index();
        load.init(index,config.up);
    }
   
});