var config = {
    infoUrl: baseUrl + 'ReceiptReward/RewardInfo',
    rewardUrl: baseUrl + 'ReceiptReward/ReceiveReward',
    type: 'post',
    data: { token: getUserInfo().token}
};

requsetHttp(config.infoUrl,config.type,config.data,(res)=>{
    $('.ali_user').text(res.data.ali_user);
    $('.total_num').text(res.data.total_num);
    $('.reward_money').text(res.data.reward_money);
    $('.receive_money').text(res.data.receive_money);
    $('.canReceive_money').text(res.data.canReceive_money);
    $('.submit').click(function () {
        requsetHttp(config.rewardUrl,config.type,config.data,(res)=>{
            if(res.status){
                alert(res.msg);
                location.href = 'index.html';
            }else{
                alert(res.msg);
            }
        })
    })
})