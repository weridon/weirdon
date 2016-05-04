requirejs.config({
    baseUrl:'javascripts',
    paths: {
        "jquery":'jquery-2.2.1.min'
    }
});
requirejs(['jquery','tab'],function($,tab){
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

    var cfg = {
        tabNav:'.tabNav',//tab选项卡的目录栏
        tabContent:'.tabCon',//tab选项卡的内容栏
        actClass:'cur'
    }
    tab.init(cfg);

    function getAds(){
        $.ajax({
            type:'POST',
            url:'/getUser',
            data: {
                username:username
            },
            success:function(data){
                $('.j_account').html(data.moneyAccount);
                if(!data.isRealName||!data.isBindBank){
                    alert("请先完善实名信息与绑定银行卡");
                    window.location.href ="userinfo";
                }
            },
            error:function(){
                alert('ajax error');
            }
        });
    }
    getAds()
    function recharge(){
        var money = $('.j_recharge').val(),
            pwd   = $('.j_pwd').val();
        if(!money||!pwd){
            alert("请填写完整的信息");
            return false;
        }
        $.ajax({
            type:'POST',
            url:'/recharge',
            async: false,
            data: {
                username:username,
                money:money,
                password:pwd
            },
            success:function(data){
                if(data.nModified===1){
                    alert("充值成功");

                }else{
                    alert("密码错误，请重新输入密码");
                    $('.j_pwd').val("").focus();

                }
            },
            error:function(){
                alert('ajax error');
            }
        });
        $.ajax({
            type:'POST',
            url:'/saveMoneyRecord',
            async: false,
            data: {
                username:username,
                money:money
            },
            success:function(data){
                console.log("写入成功");
                location.reload();
            },
            error:function(){
                alert('ajax error');
            }
        });


    }
    function withdraw(){
        var money = "-"+$('.j_withdraw').val(),
            pwd   = $('.j_wdPwd').val();
        if(!money||!pwd){
            alert("请填写完整的信息");
            return false;
        }else if((Number(money)+Number($('.j_account').html()))){
            alert("账户余额不足");
            return false;

        }else{

        }
        $.ajax({
            type:'POST',
            url:'/recharge',
            async: false,
            data: {
                username:username,
                money:money,
                password:pwd
            },
            success:function(data){
                if(data.nModified===1){
                    alert("提现成功");

                }else{
                    alert("密码错误，请重新输入密码");
                    $('.j_pwd').val("").focus();

                }
            },
            error:function(){
                alert('ajax error');
            }
        });
        $.ajax({
            type:'POST',
            url:'/saveMoneyRecord',
            async: false,
            data: {
                username:username,
                money:money

            },
            success:function(data){
                console.log("写入成功");
                location.reload();
            },
            error:function(){
                alert('ajax error');
            }
        });



    }

    $('.j_sendWd').on('click',withdraw);
    $('.j_sendRe').on('click',recharge);


});

