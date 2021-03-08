
var listData = null         //奖品集信息
var selectTab = 1;          //抽奖栏
var isToDraw = false;       //是否已开始抽奖
var prizes = null;          //中奖项
var drawNum = 0;            //剩余抽奖次数
var noticeDatalist = [];    //公告栏数据
var share_status = 0;       //分享状态
var share = null;           //分享信息
var inviteFriendsurl = "";  //邀请好友url
var token = Request('token');
var str = '?token=' + token + '&appversion=' + Request('appversion'); 
var gold = 0;
var inviteFriendsshare = {
    inviteFriends: false,
    inviteShare: null
};
var delay = false;         //是否延迟
$(function () {
    $(".draw_mask").hide();
    //默认选中项(1豪华抽奖-2幸运抽奖)
    drawTabClick(selectTab);
    inviteListShare();
    //点击抽奖栏目
    $(".luxuryOrLucky").click( function () {
        if (parseInt(selectTab) != parseInt($(this).attr('data-tab'))) {
            selectTab = $(this).attr('data-tab');
            drawTabClick(selectTab);
        }
    });

    //点击遮罩层，继续抽奖
    $("#showModel").on('click', '.mask, .continue', function (res) {
        var state = res.currentTarget.dataset.state;
        if (state == 1) {//中奖操作
            if (browser.versions.android) {
                window.titi_js.callYSFUnicorn();
            } else {
                window.webkit.messageHandlers.callYSFUnicorn.postMessage(null);
            }
        }
        $(".out-modals").hide();
        $(".share-mask").hide();
        $(".mask").hide();
    });

    $(".footer_mask").click(function () {
        $(".mask").hide();
        $(".footer_mask-modals").hide();
        $(".share-mask").hide();
    });

    //弹框分享点击出现分享项
    $("#showModel").on('click', '.share', function (res) {
        $(".footer_mask").show();
        $(".out-modals").hide();
        $(".share-mask").show()
    });

    //底部选择栏
    $(".navigation").click(function (res) {

        var bottomtab = res.currentTarget.dataset.bottomtab;
        switch (bottomtab) {
            case '1': //我的背包
                location.href = 'knapsack.html' + str;
                break;
            case '2'://排行榜
                location.href = 'rankingList.html' + str;
                break;
            case '3'://邀请好友
                inviteFriendsshare.inviteFriends = true;
                $(".mask").show();
                $(".out-modals").hide();
                $(".share-mask").show();
                break;
        }
    });

    //点击规则或获取幸运劵
    $(".rules").on('click', '.rulestext', function (res) {
        if (res.currentTarget.dataset.rules == "rules") {
            location.href = 'rules.html' + str;
        } else {
            location.href = 'getLuck.html' + str;
        }
    });

    //刷新
    $(".refresh").click(function (res) {
        location.reload();
    });

    //关闭
    $(".close").click(function () {
        if (browser.versions.android) {
            window.titi_js.callFinish();
        } else {
            window.webkit.messageHandlers.callFinish.postMessage(null);
        }
    });

    // 分享
    $(".share").click(function () {
        if (inviteFriendsshare.inviteFriends) {
            var obj = {
                type: $(this).index(),
                shareUrl: inviteFriendsshare.inviteShare.url + "?appversion=" + Request('appversion') + "&user_id=" + Request('user_id')+"",
                title: inviteFriendsshare.inviteShare.title,
                desc: inviteFriendsshare.inviteShare.content,
                img: inviteFriendsshare.inviteShare.image
            };
            inviteFriendsshare.inviteFriends = false;
        } else {
            if (share != null) {
                var obj = {
                    type: $(this).index(),
                    shareUrl: share.url + "?appversion=" + Request('appversion') + "&user_id=" + Request('user_id') + "",
                    title: share.title,
                    desc: share.content,
                    img: share.image
                };
                $(".out-modals").hide();
                $(".share-mask").hide();
                $(".mask").hide();
            }
        }
        if (browser.versions.android) {
            window.titi_js.callShare(JSON.stringify(obj));
        } else {
            window.webkit.messageHandlers.callShare.postMessage(JSON.stringify(obj));
        }
    });

    //中奖排行榜
    drawOrder();
})

//抽奖类型栏
function drawTabClick(selectTab) {
    if (selectTab == 1) { //豪华抽奖
        //豪华抽奖，跟新样式
        $("#luxuryOpacity").removeClass("drawitem");
        $("#luxuryText").removeClass("draw");
        $("#luxuryOpacity").addClass("drawSelectItem");
        $("#luxuryText").addClass("selectItem");

        //幸运抽奖跟新样式
        $("#luckyOpacity").removeClass("drawSelectItem");
        $("#luckyText").removeClass("selectItem");
        $("#luckyOpacity").addClass("drawitem");
        $("#luckyText").addClass("draw");

        var html = "<div class='rulestext' data-rules='rules'>规则</div>"; 
        $('.rules').html(html);
    } else if (selectTab == 2) {//幸运抽奖
        //幸运抽奖跟新样式
        $("#luckyOpacity").removeClass("drawitem");
        $("#luckyText").removeClass("draw");
        $("#luckyOpacity").addClass("drawSelectItem");
        $("#luckyText").addClass("selectItem");

        ////豪华抽奖，跟新样式
        $("#luxuryOpacity").removeClass("drawSelectItem");
        $("#luxuryText").removeClass("selectItem");
        $("#luxuryOpacity").addClass("drawitem");
        $("#luxuryText").addClass("draw");

        var html = "<div class='rulestext' style='color: rgba(255,190,5,1);' data-rules='getlucky'>获取幸运劵</div>";
        $('.rules').html(html);
    }
    //抽奖页面详情
    getMyGuessList(selectTab);
}

//抽奖页面详情
function getMyGuessList(drawType) {
    var config = {
        gameInfoUrl: 'LiveLotteryController/pageInfo',
        type: 'post',
        token: Request('token') ,
        data: { type: drawType }
    };
    $('.wheelDisc').html("");
    requsetHttp(config.gameInfoUrl, config.type, config.data, config.token,(res)=>{
        if (res.status) {
            listData = res.data.list;
            drawNum = res.data.lottery_chance;
            inviteFriendsurl = res.data.url;
            gold = res.data.gold;
            if (selectTab == 1) {//抽奖框重绘
                drawInterfaceInit("https://cdn.tinytiger.cn/icon-toDrawBack.png", "https://cdn.tinytiger.cn/icon-toDrawPointer.png");
            } else {//抽奖框重绘
                drawInterfaceInit("https://cdn.tinytiger.cn/icon-toDrawBack1.png", "https://cdn.tinytiger.cn/icon-toDrawPointer1.png");
            }
            var height = $(window).height() - $('.inform').height() - $('.drawTop').height() - $('.footer').height() - 10;
            $('.wheelDisc').css('height', height + 'px');
        } else {
            alert(res.msg);
        }
    });
};

//抽奖界面绘制
function drawInterfaceInit(url, url1) {
    var html = ` <div id="corona" style="background:url(` + url + `);background-size:cover; ">
                <div id="prize">
                </div>
             </div>
             <div id="toDrawBtn" class='pointer' onclick="btnToDraw()" style="background: url(`+ url1 + `);background-size: cover;">
              
             </div>`;
    $('.wheelDisc').html(html);

    var numberSecurities = "";
    if (selectTab == 1) {
        numberSecurities = "<div class='numberSecurities_'></div><div class='numberSecuritiestext'>剩余幸运劵：<span>" + drawNum + "张<span></div>";
    } else {
        numberSecurities = "<div class='numberSecurities_'></div><div class='numberSecuritiestext'>剩余幸运劵：<span>" + drawNum + "张<span></div>";
    }
    $('.numberSecurities').html(numberSecurities);
    InitData(listData);
};

// 奖品渲染数据
function InitData(listData) {
    var html = "";
    var name = "";
    for (var i = 0; i < listData.length; i++) {
        if (i > 7) {
            break;
        }
        if (listData[i].title.length > 8) {
            name = listData[i].title.substring(0, 7) + "..";
        } else {
            name = listData[i].title;
        }
        html += `<div id="m` + i + `" class='awardItem'> <img src="${listData[i].icon}" /> <span style='width: 70%;'>${name}</span></div>`;
    }
    $('#prize').html(html);
};

//点击抽奖
function btnToDraw() {
    if (selectTab == 1 && drawNum <= 0) {
        location.href = "pay.html" + str + "&gold="+gold;
        return false;
    }
    if(selectTab==2&&drawNum<=0)
    {
        location.href = "getLuck.html" + str;
        return false;
    }
    //已开始或者次数小于等于0则点击无效
    if (isToDraw) return false;

    if (drawNum <= 0) return false;

    $(".draw_mask").show();
    //开始抽奖
    isToDraw = true;

    var IsStop = false;

    var time = 0;

    $("#corona").rotate({
        angle: 0,
        duration: 10000,
        animateTo: 144000, //这里是设置请求超时后返回的角度，所以应该还是回到最原始的位置，144000是因为我要让它转40圈，
        callback: function () {
            alert('网络超时');
            stopRotate();
            isToDraw = false;
            delay = true;
        }
    });
    //请求抽奖项值
    drawing(selectTab);
};

//抽奖请求
function drawing(drawType) {

    var config = {
        gameInfoUrl: 'LiveLotteryController/lottery',
        type: 'post',
        token: Request('token'),
        data: { lottery_type: drawType == 1 ? "luxury" :"luck" }
    };
    requsetHttp(config.gameInfoUrl, config.type, config.data, config.token,(res)=>{
        if (res.status) {
            prizes = res.data;
            share = res.data.share;
            var deg = angleDrawed(prizes.order_num);
            $('#corona').stopRotate();
            $("#corona").rotate({
                angle: 0,
                duration: 5000,
                animateTo: 2160 + deg, 
                callback: function () {
                    if (prizes.reward_status == "1") {
                        if (delay) {
                            stopRotate();
                            return false;
                        } else {
                            winning();
                            delay = false;
                        }
                    } else {
                        if (delay) {
                            stopRotate()
                            return false;
                        } else {
                            noWinning();
                            delay = false;
                        }
                    }
                    $(".draw_mask").hide();
                    isToDraw = false;
                    drawNum = drawNum - 1;

                    var numberSecurities = "";
                    if (selectTab == 1) {
                        numberSecurities = "<div class='numberSecurities_'></div><div class='numberSecuritiestext'>剩余幸运劵：<span>" + drawNum + "张<span></div>";
                    } else {
                        numberSecurities = "<div class='numberSecurities_'></div><div class='numberSecuritiestext'>剩余幸运劵：<span>" + drawNum + "张<span></div>";
                    }
                    $('.numberSecurities').html(numberSecurities);
                }
            });
        }
        else {
            $('#corona').stopRotate();
            $("#corona").rotate({
                angle: 90,
                duration: 1000,
                animateTo: 2160,
                callback: function () {
                    isToDraw = false;
                    alert(res.msg);
                }
            });
        }
    });
};

//中奖角度
function angleDrawed(number) {
    var angleValue = 0;
    var deg = function (number) {
        angleValue = 22.5 + 45 * (number - 1);
    }
    switch (number) {
        case '1':
            deg(8);
            break;
        case '2':
            deg(7);
            break;
        case '3':
            deg(6);
            break;
        case '4':
            deg(5);
            break;
        case '5':
            deg(4);
            break;
        case '6':
            deg(3);
            break;
        case '7':
            deg(2);
            break;
        case '8':
            deg(1);
            break;
        default:
    }
    return angleValue;
};

//中奖弹窗
function winning() {
    var html = ` <div class="out-modals ">
                        <div class="out-modals-content">
                            <div class='modal-content-title'>
                             <p> ${prizes.title}</p>
                             <p>已放入您的背包内</p>
                            </div>
                            <div class='modal-content-msg'>
                              `;
    if (share_status == "1") {
        html += `  <div class='boxImg'>
                                    <p style='margin: 5px 0;'>分享可获得一次幸运抽奖 </p>
                
                </div>`;
    }
        html+=  ` 
            </div>
            <div class='buttondiv'>
                <div class='continue' data-state='1'>
                    立即兑换
                </div>
                <div class='share winPrize'  data-statetype='1'>
                    奔走相告
                </div>
            </div>
        </div>
    </div>
    <div class="mask"></div>`;
    $('#showModel').html(html);
};

//未中奖弹窗
function noWinning() {
    var html = ` <div class="out-modals ">
                        <div class="out-modals-content">
                            <div class='modal-content-title'>
                              ${prizes.title}
                            </div>
                            <div class='modal-content-msg'>`;
    if (share_status = "1") {
        html += `   <div class='boxImg'> <p style='margin: 5px 0;'> 分享可获得一次幸运抽奖 </p>  </div > `;
    }
    html +=    ` </div>
                        <div class='buttondiv'>
                            <div class='continue' data-state='0'>
                                继续抽奖
                            </div>
                            <div class='share noPrize'  data-statetype='0'>
                                立刻分享
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mask"></div>`;
    $('#showModel').html(html);
};

//中奖排行榜
function drawOrder(drawType) {
    var config = {
        gameInfoUrl: 'LiveLotteryController/list',
        type: 'post',
        token: Request('token'),
        data: { lottery_type: 1}
    };
    requsetHttp(config.gameInfoUrl, config.type, config.data, config.token,(res)=>{
        if (res.status) {
            noticeDatalist = res.data.list;
            noticeDataInit();
        }
    });
};

//公告栏数据
function noticeDataInit() {

    var html = ` <ul>`;
    for (var i = 0; i < noticeDatalist.length; i++) {
        html += "<li>恭喜" +noticeDatalist[i].nickname +"用户抽到了" +noticeDatalist[i].title +"</li>";
    }

    html += `</ul>`;
    $('.notice').html(html);

    // 调用 公告滚动函数
    setInterval("noticeUp('.notice ul','-30px',500)", 2000);
};

//公告栏滚动
function noticeUp(obj, top, time) {
    $(obj).animate({
        marginTop: top
    }, time, function () {
        $(this).css({ marginTop: "0" }).find(":first").appendTo(this);
    })
};

//刷新
function refresh() {
    location.reload();
};

//分享信息
function inviteListShare() {

    var config = {
        gameInfoUrl: 'LiveLotteryController/inviteList',
        type: 'post',
        token: Request('token'),
        data: {}
    };
    requsetHttp(config.gameInfoUrl, config.type, config.data, config.token,(res)=>{
        if (res.status) {
            inviteFriendsshare.inviteShare = res.data.share;
        }
    })
};

//停止转动
function stopRotate() {
    $('#corona').stopRotate();
    $("#corona").rotate({
        angle: 90,
        duration: 1000,
        animateTo: 2160, //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
        callback: function () {
            isToDraw = false;
            $(".draw_mask").hide();
        }
    });
};