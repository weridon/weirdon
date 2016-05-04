requirejs.config({
    baseUrl:'javascripts',
    paths: {
        "jquery":'jquery-2.2.1.min'
    }
});
requirejs(['jquery','tab'],function($,tab){
    var perMoney = 0;
    var username;
    //获取缓存中的name，并替换节点，参数为替换节点的父节点
    function getStorage(ele){
        username = window.localStorage.getItem("name");
        if(username){
            $(ele).children().remove();
            var $user = $('<span class="name-item">hi，'+username+'</span>'),
                $exit = $('<a class="nav-item J-exit" href="javascript:;">退出登录</a>');
            $(ele).append($user).append($exit);
        }
    }
    getStorage('.J-user-info');
    //退出登录
    function exit(){
        document.cookie = "name=\"\"";
        window.localStorage.removeItem("name");
        window.location.href="login";
    }
    $('header').on('click','.J-exit',exit);

    //获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    function getAds(){
        $.ajax({
            type:'POST',
            url:'/getUser',
            async: false,
            data: {
                username:username
            },
            success:function(data){
                $('.j_recipient').val(data.address.recipient);
                $('.j_recTele').val(data.address.tele);
                $('.j_address').val(data.address.address);
                $('.j_postcode').val(data.address.postcode);
                perMoney = Number(data.moneyAccount);
            },
            error:function(){
                alert('ajax error');
            }
        });
    }
    getAds();
    //初始化页面
    var proid =getQueryString("proid");
    var index =getQueryString("index");



    //获取项目回报信息
    $.ajax({
        type:'GET',
        url:'/godetail',
        async: false,
        data:{
            proid:proid
        },
        success:function(data){
            createRepay(data.perSupport);
            $('.repayBox .repay').eq(index).addClass("cur");
            var money = 0;
            if($('.repay.cur').hasClass('free')){
                money = $('.repay.cur .j_rem').val();
            }else{
                money = $('.repay.cur .rpMoney').html();
            }
            $('.j_payMoney').html(money);
        },
        error:function(){
            alert('ajax error');
        }
    });

    //创建回报
    function createRepay(data){

        var arr = [];
        for(x in data){
           arr.push(data[x]);
        }
        for(var i = 0;i<arr.length;i++) {
            var repayFt = $('<div class="repayFooter"><p>配送费用：<b>免运费</b></p> <p>预计回报发送时间：<b>项目成功结束后30天内</b></p> </div>');
            var repay = $('<div class="repay"></div>'),
                money = $('<p class="rpMoney"></p>'),
                title = $('<p class="rpTitle"></p>'),
                con = $('<p class="rpCon"></p>');
            money.html(arr[i].pbMoney||"");
            title.html(arr[i].pbTitle||"");
            con.html(arr[i].pbCon||"");
            repay.append(money).append(title).append(con).append(repayFt);
            $('.repayBox').append(repay);

        }
    }

    $('.repayBox').on('click','.repay',function(){
        $(this).addClass('cur').siblings().removeClass('cur');
        var money = 0;
        if($('.repay.cur').hasClass('free')){
            money = $('.j_rem').val();
        }else{
            money = $('.repay.cur .rpMoney').html();
        }
        $('.j_payMoney').html(money);
    })
    $('.j_rm' ).on('keyup',function(){

        var money = 0;
        if($('.repay.cur').hasClass('free')){
            money = $('.repay.cur .j_rm').val();
        }else{
            money = $('.repay.cur .rpMoney').html();
        }
        $('.j_payMoney').html(money);
    })
    //提交支持
    function selectR(){
        var dealPwd = $('.j_dealPwd').val();
        var money = 0;
        if($('.repay.cur').hasClass('free')){
            money = $('.repay.cur .j_rem').val();
        }else{
            money = $('.repay.cur .rpMoney').html();
        }
        money = Number(money);
        if(money>perMoney){
            alert("您的账户余额不足请充值");
            return false;
        }
        $.ajax({
            type:'POST',
            url:'/uSupportPro',
            async: false,
            data:{
                proId:proid,
                money:money,
                username:username,
                dealPassword:dealPwd
            },
            success:function(data){
                if(data.nModified===1){
                    alert("支持成功");

                }else{
                    alert("密码错误，请重新输入密码");
                    $('.j_dealPwd').val("").focus();
                    return false;

                }
            },
            error:function(){
                alert('ajax error');
            }
        });
        $.ajax({
            type:'POST',
            url:'/pSupportPro',
            async: false,
            data:{
                proId:proid,
                money:money,
                username:username

            },
            success:function(data){

            },
            error:function(){
                alert('ajax error');
                return false;
            }
        });

        $.ajax({
            type:'POST',
            url:'/saveOrder',
            async: false,
            data:{
                proId:proid,
                money:money,
                username:username

            },
            success:function(data){
                window.location.href="detail?proid="+proid;
                console.log("成功");
            },
            error:function(){
                //alert('ajax error');
                return false;
            }
        });

    }
    $('.j_sendSupport').on('click',selectR);
});

