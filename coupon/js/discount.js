$(function() {
    var config = {
        $tab: $('#J_Tab'),
        mescroll: initMescroll(),
        couponListUrl: 'CouponController/couponList',
        type: 'post',
        token: Request('token'),
        data: { status: 1, page: 1 },
        up: 'up',
        flush: 'flush',
    };

    var load = {
        /**
         * 优惠券初始化
         * @param index //当前nav选中下标
         * @param type  //类型 up：加载  flush：刷新
         * @param callback //回调
         */
        init: function(index, type) {
            if (type == 'flush') {
                config.data.page = 1;
            }
            requsetHttp(config.couponListUrl, config.type, config.data, config.token,(res)=>{
                var str = '';
                var list = res.data.list;
                if (!list.length && config.data.page == 1) {
                    config.mescroll.endSuccess();
                    $('.tab-panel .tab-panel-item').eq(index).html('<div class="default-ticket"><img src="image/icon-default-ticket.png"><span>暂无优惠券</span></div>');
                    config.mescroll.endByPage(res.data.list.length, res.data.page.totalPage);
                    config.mescroll.hideUpScroll(true);
                    return false;
                }
                for (var i = 0; i < list.length; i++) {
                    str += `<div class="${config.data.status == 1 ? 'ticket':'ticketOpcity '}"  data-discountid="${list[i].user_coupon_id}" data-module="${list[i].module}">
                    <div class="ticket-left">
                        <span class="font-16 ticket-left-top">${list[i].type == 2? '' : list[i].denomination}<span style="font-size: 10px">${list[i].type == 2? '' : "铜钱"}</span></span>
                        <span  style="${list[i].type == 2? 'font-size:20px':'font-size:10px'}">${list[i].type == 2 ||list[i].type == 3? getCouponsDescript(list[i]) : ""}<span style="font-size: 10px">${list[i].type == 2? '折' : ''}</span></span>
                    </div>`
                    if (config.data.status == 1) {
                        str += `<div class="ticket-right onceGetting" >
                               <div class="ticket-information">
                                   <span class="font-16 ticket-right-top" >${list[i].name}</span>
                                   <span class="ticket-time">${list[i].desc}</span>
                               </div> 
                               <div class="ticket-using">
                                   <span class="ticket-time">${simpleDateFormat(list[i].start_time)+"-"+simpleDateFormat(list[i].end_time)}</span> 
                                   <span class="usering" >立即使用</span>
                                   </div>
                                      </div>
                                  </div>`
                    }
                    if (config.data.status == -1) {
                        str += `<div class="ticket-right " >
                            <div class="ticket-information">
                                <span class="font-16 ticket-right-top">${list[i].name}</span>
                                <span class="ticket-time">${list[i].desc}</span>
                            </div> 
                            <div class="ticket-using">
                                <span class="ticket-time">${simpleDateFormat(list[i].start_time)+"-"+simpleDateFormat(list[i].end_time)}</span> 
                                <span class="usering" ></span>
                                </div>
                                   </div>
                               </div>`
                    }
                    if (config.data.status == -2) {
                        str += `<div class="ticket-right" >
                            <div class="ticket-information">
                                <span class="font-16 ticket-right-top">${list[i].name}</span>
                                <span class="ticket-time">${list[i].desc}</span>
                            </div> 
                            <div class="ticket-using">
                                <span class="ticket-time">${simpleDateFormat(list[i].start_time)+"-"+simpleDateFormat(list[i].end_time)}</span> 
                                <span class="usering" ></span>
                                </div>
                                   </div>
                               </div>`
                    }
                }
                $('.tab-panel-item').append(str)
                if (type == 'flush') {
                    config.mescroll.endSuccess();
                    config.mescroll.optUp.page.num = 1;
                    config.mescroll.endByPage(res.data.list.length, res.data.page.totalPage);
                    $('.tab-panel .tab-panel-item').eq(index).html(str);
                } else {
                    config.mescroll.endByPage(res.data.list.length, res.data.page.totalPage);
                    $('.tab-panel .tab-panel-item').eq(index).append(str);
                }
                config.data.page++;

                // 立即使用
                $(".ticket").click(function() {
                    var discount = $(this).attr("data-discountid")
                    var model = $(this).attr("data-module")
                    var obj = { discountid: discount, module: model }
                    if (browser.versions.android) {
                        window.titi_js.callModule(JSON.stringify(obj));
                    } else {
                        window.webkit.messageHandlers.callModule.postMessage(JSON.stringify(obj));
                    }
                })
            })
        }
    };

    //初始化顶部nav
    config.$tab.tab({ nav: '.tab-nav-item', panel: '.tab-panel-item', activeClass: 'tab-active' });
    config.$tab.find('.tab-nav-item').on('open.ydui.tab', function(e) {
        var index = e.index;
        if (index == 0) config.data.status = 1;
        else if (index == 1) config.data.status = -1;
        else if (index == 2) config.data.status = -2;
        config.data.page = 1; //初始化当前页数
        load.init(index, config.flush);
        config.mescroll.endUpScroll(false);
        $(".share-mask").hide();
    });


    /**
     * mescroll 配置
     */
    function initMescroll() {
        var mescroll = new MeScroll("mescroll", {
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
        load.init(index, config.flush);
    }

    /**
     * 上拉加载的回调
     */
    function upCallback() {
        var index = $('.tab-nav .tab-active').index();
        load.init(index, config.up);
    }

    /**
     * 折扣换算
     * @param obj { threshold: 优惠券使用门槛 ,denomination: 优惠券面额, type : 优惠券类型 1=直减券 2=折扣券 3=满减券, discount: 优惠券折扣 }
     * @returns {string}
     */
    function getCouponsDescript(obj) {
        var desc = '';
        var thr = parseFloat(obj.threshold);
        var den = parseFloat(obj.denomination);
        if (obj.type == 1) {
            desc = '减' + den + '铜钱';;
        } else if (obj.type == 2) {
            var dis = obj.discount;
            desc = dis * 10;
        } else if (obj.type == 3) {
            desc = '满' + thr + '可用'
        }
        return desc;
    }

});
/**
 * 日期格式化
 * @param str 日期
 * @returns {string}
 */
function simpleDateFormat(str) {
    return str.split(" ")[0].replace(/-/g, ".");
}