requirejs.config({
    baseUrl:'javascripts',
    paths: {
        "jquery":'jquery-2.2.1.min',
        "dialog":'components/dialog/dialog'
    }
});
requirejs(['jquery','dialog'],function($,dialog){
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

    var $protitle = $('.pro-title-bar'),
        $nopro = $('.J-nopro');
    //检测是否有pro-item 如果没有则显示相应版块
    if($protitle.siblings('.pro-item').length==0){
        $nopro.show();
    }
    //删除项目
    $('.my-start-pro').delegate('.J-trash','click',function(){
        var $self = $(this),
            deletpro = $self.parents('.pro-item'),
            delproid = deletpro.children('input').val();
        var cfg = {
            msg:'确定删除该项目吗？',
            closeBtn:[
                {
                    tag:'.jq-sure-btn',
                    callback:function(){
                        deletePro(delproid,deletpro);
                    }
                }, {
                    tag:'.jq-cancel-btn',
                    callback:null
                },{
                    tag:'.jq-close-tag',
                    callback:null
                }
            ]
        };
        dialog.init(cfg);
    });
    //删除项目
    function deletePro(proid,deletpro){
        $.ajax({
            method:'delete',
            url:'/deletePro',
            data:{proid:proid},
            success:function(data){
                if(data=='success'){
                    deletpro.remove();
                }else{
                    alert('请稍后再试~');
                }
            },
            error:function(data){
                alert('ajax error');
            }
        });
    }
    //跳转项目详情
    $('.J-proimg').on('click',function(){
        var $self = $(this),
            proid = $self.parents('ul').next('input').val();
        window.location.href = "detail?proid="+proid;
    });
    //跳转添加项目动态
    $('.J-go-trend').on('click',function(){
        var $self = $(this),
            proid = $self.parents('ul').next('input').val();
        window.location.href = "addProTrends?proid="+proid;
    });
});