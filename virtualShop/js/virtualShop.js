var shopping_type = 1;        //shopping_tyep  赛事商城 1  兑换商城 2
var goodslist = {};
var getdata =  [];            // 数据列表
var currentPage =  1;         // 当前页
var totalPage = 1;            // 总页数
var priceArrow =  false;      // 价格排序
var hotArrow = true;          // 热门排序
var hotstate = true;          // 热门排序状态
var pricestate = false;       // 价格排序状态
var token = Request('token');
var goods_info = '';         // 详情页面路径
var ticketRecord = '';       // 兑奖记录页面路径
var myPrize = '';            // 我的奖品页面路径

$(function () {
    var mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id
        //如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
        //解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
        down: {
            callback: downCallback //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
        },
        up: {
            use: true,
            isBounce: false,
            callback: upCallback //上拉加载的回调
        }
    }); 
    window.onload = function () {
        var argsFromPageA = args();
        console.log(argsFromPageA);
        // app商城点击类型传参过来的数值
        if (argsFromPageA) {
            if (argsFromPageA.shopping_type) {
                shopping_type = argsFromPageA.shopping_type;
            }
        } 
    };
    refresh();//设置默认排序图标
    //点击热门热门
    $(".hotOrder").click(function () {
        hotArrow = true;                           // 操作热门选项
        priceArrow = false;                        // 未操作价格选项
        currentPage = 1;                           // 页数重置
        var hot_tag = clickhot();                  // 操作排序图标状态
        $('.order-hot').html(html);                // 设置图标
        goodsList(null, hot_tag, false);           // 设置数据
    });
    //点击价格排序
    $(".priceOrder").click(function () {
        priceArrow = true;                         // 操作价格选项
        hotArrow = false;                          // 未操作热门选项
        currentPage = 1;                           // 页数重置
        var price_tag = clickprice();              // 操作排序图标状态
        goodsList(price_tag, null, false);         // 设置数据
    });                                            
    //下拉刷新的回调
    function downCallback() {
        currentPage = 1;
        goodslist = {};
        getdata = [];  
        selectDataTpye(false); //下拉当前选择的排序数据
    }
    //上拉加载的回调 page = {num:1, size:10}; num:当前页 默认从1开始, size:每页数据条数,默认10
    function upCallback(page) {
        if (currentPage < totalPage) {
            currentPage += 1; // 页数+1
            selectDataTpye(true); // 上拉加载当前排序的排序数据
        }
    }
    //根据操作判断不同排序数据
    function selectDataTpye(refresh) {
        if (priceArrow) {
            var price_tag = pricestate ? 'ASC' : 'DESC';
            goodsList(price_tag, null, refresh);
        }
        if (hotArrow) {
            var hot_tag = hotstate ? 'ASC' : 'DESC';
            goodsList(null, hot_tag, refresh);
        }
    }
    //商城页面数据
    function goodsList(priceNum, hotNum, refresh) {
        var config = {
            gameInfoUrl: 'VirtualMallController/goodsList',
            type: 'post',
            token: token,
            data: { page: currentPage, shopping_type: shopping_type }
        };
        if (priceNum) {  //操作价格排序
            config.data.price_sort = priceNum
        }
        if (hotNum) {  //操作热门排序
            config.data.order_sort = hotNum
        }
        RequsetHttp(config.gameInfoUrl, config.type, config.token, config.data, function (res) {
            if (res.code == 200) {
                goodslist = res;
                totalPage = parseInt(goodslist.data.page.totalPage);             // 页数
                goods_info = goodslist.data.goods_info;                          // 详情页面路径
                console.log(goods_info)


                ticketRecord = goodslist.data.ticketRecord;                      // 兑奖记录页面路径
                myPrize = goodslist.data.myPrize;                                // 我的奖品页面路径

                var html = "";
                var goodscount = parseInt(goodslist.data.list.length);           // 当前页数据数量
                var amount = res.data.amount;                                    // 铜币数量
                if (goodscount > 0) {
                    if (refresh) { //是否为下拉
                        mescroll.endSuccess(goodscount); 
                        getdata = getdata.concat(res.data.list)
                    } else {
                        mescroll.endSuccess();
                        mescroll.optUp.page.num = 1;
                        mescroll.endByPage(goodslist.data.list.length, goodslist.data.page.totalPage);
                        getdata = goodslist.data.list;
                    }
                    html = "";
                    var params = function (args) {
                        var p = [];
                        for (var n in args)
                            p.push(n + '=' + args[n]);
                        return encodeURI('?' + p.join('&'));
                    };
                    var sales_volume = 0;
                    for (var i = 0; i < goodscount; i++) {
                        sales_volume = goodslist.data.list[i].sales_volume== null ? 0 : goodslist.data.list[i].sales_volume;
                        html += ` 
                            <div class='border-box' onclick='todetail(`+ res.data.page.page + `,` + i + `)'>
                            <div class="goods">
                                <div class="goodsimg"><img src="`+ goodslist.data.list[i].cover_map + `"/></div>
                                <div class='goodsname'>`+ goodslist.data.list[i].goods_name + `</div>
                                <div class='numcount'>已兑换：`+ sales_volume + `件</div>
                                <div class='goodspricetext'>价格：<span class="goodsprice">`+ parseInt(goodslist.data.list[i].price) + `铜钱</span></div>
                            </div>
                            </div>`;
                    }
                    $('.downwarp-tip').html('');
                    $('.upwarp-tip').html('');
                } else {
                    mescroll.endErr();
                    $('.downwarp-tip').html('');
                    $('.upwarp-tip').html('');
                }
              
                if (refresh) {
                    $('.content-footer').append(html);
                } else {
                    $('.content-footer').html(html);
                }
                $('.moneytq').html(`<div>` + amount + `</div>`);

            } else {
                mescroll.endErr();
            }
        });
    };
})
//热门点击状态处理
function clickhot() {
    priceArrow = false;
    if (hotArrow && (!hotstate)) {
        hotstate = true;
    } else {
        hotstate = false;
    }

    html = orderState(hotstate);
    $('.order-hot').html(html);

    return hot_tag = hotstate ? 'ASC' : 'DESC';
}
//价格点击状态处理
function clickprice() {
    hotArrow = false;

    if (priceArrow && (!pricestate)) {
        pricestate = true;
    } else {
        pricestate = false;
    }

    var html = orderState(pricestate);
    $('.order-price').html(html);

    return price_tag = pricestate ? 'ASC' : 'DESC';
}
//初始化，排序图标处理
function refresh() {
    if (hotArrow && hotstate) {
        hotstate = true;
    } else {
        hotstate = false;
    }
    if (priceArrow && pricestate) {
        pricestate = true;
    } else {
        pricestate = false;
    }
    html = orderState(hotstate);
    $('.order-hot').html(html);

    var html = orderState(pricestate);
    $('.order-price').html(html);
}
//图标设置
function orderState(state) {
    var html = '';
    if (state) {
        html =`<img src="https://cdn.tinytiger.cn/arrows-top1.png" />`
    } else {
        html = `<img src="https://cdn.tinytiger.cn/icon-arrows-botton1.png" />`
    }
    return html;
}
//跳转页面处理
function todetail(page, val) {
    var valindex = 0;
    if (page > 1) {
        val = parseInt((parseInt(page) - 1) *10) + val;
    } 
    console.log(val)
    var data = {
        'img': encodeURIComponent(getdata[val].detail_map),
        'info': getdata[val].goods_info,
        'ticketRecordinfo': encodeURIComponent(ticketRecord),
        'myPrizeinfo': encodeURIComponent(myPrize),
        'price': getdata[val].price,
        'volume': getdata[val].sales_volume == null ? 0 : getdata[val].sales_volume,
        'type': getdata[val].goods_type,
        'title': getdata[val].goods_name,
        'id': getdata[val].id,
        'shopping_type': shopping_type,
        'token': token
    }
    var param = params(data);
    var url = goods_info + param;
    // url = url.replace("https", "http");
    console.log(url)
    //location.href = url
    callNewWeb(url);
}
//携带参数处理
function params(args) {
    var p = [];
    for (var n in args)
        p.push(n + '=' + args[n]);
    return encodeURI('?' + p.join('&'));
};
//参数处理
function args(params) {
    var a = {};
    params = params || location.search;
    if (!params) return {};
    params = decodeURI(params);
    params.replace(/(?:^\?|&)([^=&]+)(?:\=)([^=&]+)(?=&|$)/g, function (m, k, v) { a[k] = v; });
    return a;
};
