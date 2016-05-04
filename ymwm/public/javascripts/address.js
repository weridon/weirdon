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
    function getAds(){
        $.ajax({
            type:'POST',
            url:'/getUser',
            data: {
                username:username
            },
            success:function(data){
                $('.j_recipient').val(data.address.recipient);
                $('.j_recTele').val(data.address.tele);
                $('.j_address').val(data.address.address);
                $('.j_postcode').val(data.address.postcode);
            },
            error:function(){
                alert('ajax error');
            }
        });
    }
    getAds()
    function editAds(){
        var recipient = $('.j_recipient').val()||"",
            tele = $('.j_recTele').val()||"",
            address = $('.j_address').val()||"",
            postcode =$('.j_postcode').val()||"";


            $.ajax({
                type:'POST',
                url:'/editAddress',
                data: {
                    username:username,
                    recipient:recipient,
                    tele:tele,
                    address:address,
                    postcode:postcode
                },
                success:function(data){
                    alert("修改成功");
                },
                error:function(){
                    alert('ajax error');
                }
            });


    }

    $('.j_editAds').on('click',editAds);


});

