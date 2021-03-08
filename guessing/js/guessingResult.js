
var listData = [];      //奖励列表
var currentPage = 1;    //当前页数
var totalPage = 1;      //总页数
var isShow = false;      //弹窗状态
$(function () {
    getMyGuessList(false);//

    //滚动事件触发
    window.onscroll = function () {
        if (!isShow) {
            if (getScrollTop() + getClientHeight() === getScrollHeight()) {
                currentPage++;
                if(currentPage <= totalPage){
                    getMyGuessList(false);
                }
            }
        }
    };

    $(window).scroll(function () {
        if (!isShow)
        {
            var scrollTop = $(this).scrollTop();    //滚动条距离顶部的高度
            var scrollHeight = $(document).height();   //当前页面的总高度
            var clientHeight = $(this).height();    //当前可视的页面高度
            if (scrollTop + clientHeight >= scrollHeight)//距离顶部+当前高度 >=文档总高度 即代表滑动到底部 count++;         //每次滑动count加1
            {   

            } else if (scrollTop <= 0) {
                //滚动条距离顶部的高度小于等于0 TODO
                //console.log('上拉top');
                getMyGuessList(true)
                }
        }
    });
    
   
    $('#content').on('click', '.content_box', function (res) {

        isShow = true;
        var result = res.currentTarget.dataset.result
        if (result == 0 || result == 2) return false

        var html = ` <div class="out-modals ">
                        <div class="out-modals-content">
                            <div class='modal-content-title'>
                                <img src='image/icon-close.png' class='close' />
                                <span class='content-title-txt'>比赛截图</span>
                            </div>
                            <div class='modal-content-msg'>
                                <div class='boxImg'>
                                   <img  class='imgShow' src='${res.currentTarget.dataset.img}'/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mask"></div>
`;
        $('#showModel').html(html);

    })


    $("#showModel").on('click', '.mask', function () {
        $(".out-modals").hide();
        $(".mask").hide();
        isShow = false;
    });

    $("#showModel").on('click', '.out-modals .out-modals-content .modal-content-title .close', function () {
        $(".out-modals").hide();
        $(".mask").hide();
        isShow = false;
    });

})

//--------------上拉加载更多BEGIN---------------
//获取滚动条当前的位置
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

//获取当前可视范围的高度
function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
}

//获取文档完整的高度
function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}
//--------------上拉加载更多END---------------



//--------------获取我的竞猜列表BEGIN---------------
function getMyGuessList(pullDown) {

    var config = {
        gameInfoUrl: 'GuessController/myGuessList',
        type: 'post',
        token: Request('token'),
        data: { page: pullDown ? 1 : currentPage }
    };

    RequsetHttp(config.gameInfoUrl, config.type, config.token, config.data, function (res) {

        //获取我的竞猜列表信息成功
        if (res.status) {
            // 是否刷新
            if (pullDown) {
                currentPage = 1,               //当前页数
                    totalPage = 1,                //总页数
                    listData = []                  //奖励列表
            }

            if(currentPage == 1 && !res.data.list.length){
                $('body').html(`<div class="noList"><img src="image/icon-default.png" /><p>暂无记录</p><span>快去竞猜赛事赢奖金吧</span></div>`);
                $('body,.noList').css('background','#ffffff');
                return false
            }

            // 返回的数据不为空
            if (res.data != null && res.data.list != null) {
                // 第一次加载是否有数据，无数据则直接获取，否则为有数据，则合并之前的数据
                if (listData.length > 0) {
                    //有数据，则合并之前的数据
                    listData = listData.concat(res.data.list)
                } else {
                    //无数据则直接获取
                    listData = res.data.list
                }
                InitData(listData);
                currentPage = res.data.page.page;//页码
                totalPage = res.data.page.totalPage;//总页数

            } else {
                console.log(res.msg);
            }

        } else {
            console.log(res.msg);
        }
    })
};

// 渲染数据
function InitData(listData) {
  
    var html = "";
    for (var i = 0; i < listData.length; i++) {
        if(listData[i].result_image){
            listData[i].result_image = JSON.parse(listData[i].result_image);
        }
        html += `<div class="content_box"data-result='${listData[i].guess_result}' data-img='${listData[i].result_image[0]}'>
                    <div class="content_title">${toSub(listData[i].title,7)}</div>
                    <div class="content_msg">
                       <span class="line">|</span> <span class="sigle_double">${listData[i].guess_type == 1 ? "单" : "双"}</span> <span class="line">|</span>
                        <span class="num">${listData[i].amount}</span> <span class="line">|</span>
                        <div class="result">${guessResult(listData[i].guess_result,1)}</div>
                            ${guessResult(listData[i].guess_result,0) ?` <span class="iconfont icon-fanhui_you"></span>`:``}
                    </div>
                  </div>
                `;
    }
    $('#content').html(html);
}
//--------------获取我的竞猜列表END---------------


//guess_result 状态值 
//type         类型   0判断图标是否显示
function guessResult(guess_result, type) {
    if (type == 0) {
        if (guess_result == 0 || guess_result == 2) {
            return false
        } else {
            return true;
        }

    } else {
        if (guess_result == 0) {
            return '未开奖'
        } else if (guess_result == -1) {
            return '未中奖'
        } else if (guess_result == 1) {
            return '中奖'
        }
        else if (guess_result == 2) {
            return '流局'
        }
    }

  
}

function toSub(val, length) {
    // 长度为空或直接为undefined则直接返回
    if (val.length == 0 || val == undefined) {
        return "";
    }
    if (val.length > length) {
        return val.substring(0, length) + "...";
    }
    else {
        return val;
    }

}