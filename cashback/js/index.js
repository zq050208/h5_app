var config = {
    url: baseUrl + '/ReceiptReward/Index',
    type: 'post',
    data: { token :  getUserInfo().token },
    user_info: {},
    date: new Date().getDay(),
};

var preHandler=function(e){e.preventDefault();};
$('.modal').on('touchmove',preHandler,false);
$('#alipayGroup').modal({backdrop: 'static', keyboard: false, show: false});

if(config.data.token){
    onLoad();
} else{
    goLogin();
}

$('.apply').click(function () {
    goPlayApply();
});

$('.rule').click(function () {
    $('#ruleGroup').modal('show');
});

$('.bindAlipay').click(function () {
    goAliAccount(config.user_info.real_name);
});

$('.idCard').click(function () {
    goRealName();
});

function onLoad(){
    requsetHttp(config.url,config.type,config.data,(res)=>{
        console.log(res);
        config.user_info = res.data;
        for(var i=0; i<res.data.rank_list.length;i++){
            if(i <= 2){
                $('#step'+(i+1)).attr('src',res.data.rank_list[i].avatar);
                $('#step'+(i+1)).attr('data-id',res.data.rank_list[i].user_id);
                $('#step'+(i+1)).attr('data-type',res.data.rank_list[i].jump_type);
                $('#lump'+(i+1)).find('.name').text(res.data.rank_list[i].nickname);
                $('#lump'+(i+1)).find('.time').find('span').text(res.data.rank_list[i].total_num);
            }else {
                if(i< 20){
                    $('.list').append('\<div class="axis">\
                        <span class="num">#'+(i+1)+'</span>\
                        <img class="goSearch" src='+res.data.rank_list[i].avatar+' data-id='+res.data.rank_list[i].user_id+' data-type='+res.data.rank_list[i].jump_type+' />\
                        <span class="axis-name">'+res.data.rank_list[i].nickname+'</span>\
                        <span class="axis-time">累计时长：<span>'+res.data.rank_list[i].total_num+'</span>小时</span>\
                    </div>');
                }
            }
        }

        if(res.data.rank_list.length > 3){
            $('.ranking-list,.fake').show();
        }

        $('.goSearch').click(function () {
            var uid = $(this).attr('data-id');
            var type = $(this).attr('data-type');
            goPlayUser(type,uid);
        });

        if(config.user_info.user_type == 1){
            //是否大神
            $('.aaa').show();
        }else{
            $('.bbb').show();
            return false;
        }

        $('.user-avatar').attr('src',res.data.user_info.avatar);
        $('.user-name').text(res.data.user_info.nickname);
        $('.user-time').text(res.data.user_info.total_num);
        $('.sum').text(res.data.user_info.reward_money);

        $('.send-btn').click(function () {
            if(config.user_info.user_info.order_num < 3){
                //是否满足三单
                $('#meetGroup .text').text('需要完成3单才能领取奖励哦~ ');
                $('#meetGroup').modal('show');
                return false;
            }
            if(config.date != 3 ){
                //是否周三
                $('#meetGroup .text').text('活动期间内每周三才可以领取奖励哦！');
                $('#meetGroup').modal('show');
                return false;
            }

            if(config.user_info.author_apply_status != 2){
                //是否实名认证
                $('#alipayGroup .card').css('display','inline-block');
                $('#alipayGroup .alipay').css('display','none');
                if(config.user_info.author_apply_status == 1){
                    $('#meetGroup .text').text('实名认证审核中！');
                    $('#meetGroup').modal('show');
                }else{
                    $('#alipayGroup .text').text('未完成实名认证！');
                    $('#alipayGroup').modal('show');
                }
                return false;
            }
            if(config.user_info.ali_status != 1){
                //是否绑定支付宝
                $('#alipayGroup .alipay').css('display','inline-block');
                $('#alipayGroup .card').css('display','none');
                $('#alipayGroup .text').text('未绑定支付宝！');
                $('#alipayGroup').modal('show');
                return false;
            }
            location.href = 'cashback.html'
        })
    });
}