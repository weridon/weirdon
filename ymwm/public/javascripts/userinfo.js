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

    //tab选项卡
    var cfg = {
        tabNav:'.tabNav',//tab选项卡的目录栏
        tabContent:'.tabCon',//tab选项卡的内容栏
        actClass:'cur'
    }
    tab.init(cfg);
    //获取用户信息
    $.ajax({
        type:'POST',
        url:'/getUser',
        data:{
            username:username
        },
        success:function(data){
            $('.j_tele').html(data.tele||"绑定手机");
            $('.j_email').html(data.email||"绑定邮箱");
            $('.j_img').attr("src",data.userImg);
            $('input[name=sex]').eq(data.sex).attr("checked",true);
            $('.j_username').val(data.username);
            $('.j_intro').val(data.intro);


            if(data.isRealName==0||data.isRealName==1){
                $('.j_realName').val(data.realName);
                $('.j_idCard').val(data.idCard);
            }else{
                $('.j_realName').attr('disabled','disabled');
                $('.j_idCard').attr('disabled','disabled');
                $('.j_editReal').css("display","none");
            }
            if(data.isBindBank==0||data.isRealName==1){
                $('.j_bankName').val(data.bankName);
                $('.j_bankNum').val(data.bankNum);
            }else{
                $('.j_bankName').attr('disabled','disabled');
                $('.j_bankNum').attr('disabled','disabled');
                $('.j_editBank').css("display","none");
            }
        },
        error:function(){
            alert('ajax error');
        }
    });
    //修改用户信息
    function editUserinfo(){
        var userinfo={};
            userinfo.username = username;
            userinfo.userImg = $('.j_img').val();
            userinfo.sex = $('input:radio[name="sex"]:checked').val();
            userinfo.intro = $('.j_intro').val();
        $.ajax({
            type:'POST',
            url:'/editUserinfo',
            data: userinfo,
            success:function(data){
                alert("修改成功");
            },
            error:function(){
                alert('ajax error');
            }
        });
    }
    //实名信息填写
    function editRealName(){
        var userinfo={};
        userinfo.username = username;
        userinfo.isRealName = 1;
        userinfo.realName = $('.j_realName').val();
        userinfo.idCard = $('.j_idCard').val();
        userinfo.idCardImg = $('.j_idCardImg').val();
        if(!userinfo.idCard||!userinfo.realName||!userinfo.idCardImg){
            alert("请完整的填写实名信息");
            return false;
        }
        $.ajax({
            type:'POST',
            url:'/editRealName',
            data: userinfo,
            success:function(data){
                alert("修改成功");
            },
            error:function(){
                alert('ajax error');
            }
        });
    }
    //银行信息填写
    function editBindBank(){

        var userinfo={};
        userinfo.username = username;
        userinfo.isBindBank = 1;
        userinfo.bankName = $('.j_bankName').val();
        userinfo.bankNum = $('.j_bankNum').val();
        var p1 = $('.j_dealPwd').val(),p2 = $('.j_dealPwdSd').val();
        if(!userinfo.bankName||!userinfo.bankNum||!p1||!p2){
            alert("请完整的填写银行卡信息");
            return false;
        }
        if(p1 != p2){
            alert("密码不一致");
            return false;
        }
        userinfo.dealPassword = p1;
        $.ajax({
            type:'POST',
            url:'/editBindBank',
            data: userinfo,
            success:function(data){
                alert("修改成功");
            },
            error:function(){
                alert('ajax error');
            }
        });
    }
    $('.j_edituser').on('click',editUserinfo);
    $('.j_editReal').on('click',editRealName);
    $('.j_editBank').on('click',editBindBank);

});

