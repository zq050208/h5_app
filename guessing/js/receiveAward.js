
var listData = [];      //奖励列表
var currentPage = 1;    //当前页数
var totalPage = 1;      //总页数

$(function () {
    getRewardList(false);

    //滚动事件触发
    window.onscroll = function () {
        if (getScrollTop() + getClientHeight() === getScrollHeight()) {
            currentPage++;
            if(currentPage <= totalPage){
                getRewardList(false);
            }
        }
    };


    $(window).scroll(function () {

        var scrollTop = $(this).scrollTop();    //滚动条距离顶部的高度
        var scrollHeight = $(document).height();   //当前页面的总高度
        var clientHeight = $(this).height();    //当前可视的页面高度
        if (scrollTop + clientHeight >= scrollHeight) {   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 count++;         //每次滑动count加1
            //console.log('下拉bottom');
        } else if (scrollTop <= 0) {
            //滚动条距离顶部的高度小于等于0 TODO
            //console.log('上拉top');
            getRewardList(true)
        }
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






//--------------获取奖励列表BEGIN---------------
function getRewardList(pullDown) {


    var config = {
        gameInfoUrl: 'GuessController/rewardList',
        type: 'post',
        token: Request('token'),
        data: { page: pullDown ? 1 : currentPage }
    };

    RequsetHttp(config.gameInfoUrl, config.type, config.token, config.data, function (res) {
        //获取奖励列表信息成功
        if (res.status) {
            // 是否刷新
            if (pullDown) {
                currentPage=1,               //当前页数
                totalPage= 1,                //总页数
                listData=[]                  //奖励列表
            }

            if(currentPage == 1 && !res.data.list.length){
                $('#tbody').html(`<div class="noList"><img src="image/icon-default.png" /><p>暂无记录</p><span>快去竞猜赛事赢奖金吧</span></div>`);
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
                console.log(listData);
                InitData(listData);
                currentPage = res.data.page.page;//页码
                totalPage = res.data.page.totalPage;//总页数
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    });
};

// 渲染数据
function InitData(listData) {
    var html = "";
    for (var i = 0; i < listData.length; i++) {
        html += `<tr>
            <td class='guessAward'>
                <p class='guessAwardContent'>竞猜获奖</p>
                <p class='awardTime'>${listData[i].create_time}</p>
            </td>
            <td class='guessAwardMoney'>${listData[i].reward_amount}</td>
        </tr>`;
    }
    $('#tbody').html(html);
}
//--------------获取奖励列表END---------------
