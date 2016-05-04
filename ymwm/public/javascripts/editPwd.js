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

    function editPwd(){
        var oldPwd = $('.j_oldPwd').val(),
            newPwd = $('.j_newPwd').val(),
            newPwdScd = $('.j_newPwdScd').val();
        if(!newPwdScd||!newPwd||!oldPwd){
            alert("请完整的填写???�码信息");
            return false;
        }
        if(newPwd==newPwdScd){
            $.ajax({
                type:'POST',
                url:'/editPassword',
                data: {
                    username:username,
                    oldPwd:oldPwd,
                    newPwd:newPwd
                },
                success:function(data){
                    if(data.nModified===1){
                        alert("修改成功");
                    }else{
                        alert("原密�??��误，请重新输�?");
                        $('.j_oldPwd').val("").focus();

                    }

                },
                error:function(){
                    alert('ajax error');
                }
            });
        }else{
            alert("两次输入的密码不相�??");
            $('.j_newPwdScd').val("").focus();
        }

    }

    $('.j_sendPwd').on('click',editPwd);


});

