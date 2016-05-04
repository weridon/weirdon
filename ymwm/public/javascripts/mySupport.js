$(function(){
    //获取缓存中的name，并替换节点，参数为替换节点的父节点
    function getStorage(ele){
        var username = window.localStorage.getItem("name");
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

    //点击后了解项目详情
    $('.J-detail').on('click',function(){
        var proid = $(this).parents('ul').next('input').val();
        window.location.href = "detail?proid="+proid;
    });
});