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

    var $liOfAll = $('.J-all'),
        $li = $('.classify-inner li');
    //跳转项目详情
    $(".scan-pro").delegate('.J-pro-item','click',function(){
        proid = $(this).children('input').val();
        window.location.href = 'detail?proid='+proid;
    });
    //限制只能按一种分类查询
    $('.classify-inner a').on('click',function(){
        $li.removeClass('classify-item-active');
        $liOfAll.addClass('classify-item-active');
        $(this).parent('li').addClass('classify-item-active').siblings().removeClass('classify-item-active');
    });
    //按项目类型筛选
    $('.J-classify-item').on('click',function(){
        var protype = $(this).data('classify');
        $.ajax({
            type:'POST',
            url:'/getProByType',
            data:{
                protype:protype
            },
            success:function(data){
                createPro(data);
            },
            error:function(){
                alert('ajax error');
            }
        });
    });
    //按项目进度筛选
    $('.J-pro-status').on('click',function(){
        var protype = $(this).data('classify');
        $.ajax({
            type:'POST',
            url:'/getProByStatus',
            data:{
                protype:protype
            },
            success:function(data){
                createPro(data);
            },
            error:function(){
                alert('ajax error');
            }
        });
    });
    //其他方式分类筛选
    $('.J-other-seperate').on('click',function(){
        var classify = $(this).data('classify');
        if(classify == 'time-down'){
            $.ajax({
                type:'get',
                url:'/getProByTime',
                success:function(project){
                    createPro(project);
                },
                error:function(){
                    alert('ajax error!')
                }
            });
        }else if(classify == 'money-down'){
            $.ajax({
                type:'get',
                url:'/getProByMoney',
                success:function(project){
                    createPro(project);
                },
                error:function(){
                    alert('ajax error!')
                }
            });
        }
    });
    function createPro(data) {
        var $main = $('.main');
        $main.children().remove();
        for(var i= 0,len=data.length;i<len;i++){
            var $child = $('<div class="J-pro-item fl">' +
                '<div class="view view-ninth">' +
                '<img class="J-proimg" src="">' +
                '<div class="mask mask-1"></div>' +
                '<div class="mask mask-2"></div>' +
                '<div class="content"><h2 class="J-title"></h2><p class="J-describe"></p><a href=""></a></div>'+
                '</div>' +
                '<div class="view-info clearfix">' +
                '<div class="fl"><span class="glyphicon glyphicon-heart"></span><span class="J-support"></span></div>' +
                '<div class="fr"><span class="glyphicon glyphicon-yen"></span><span class="J-goalmoney"></span></div>' +
                '</div><input class="J-objectid" type="hidden" value="">'+
                '</div>');
            $main.append($child);
            var savesrc = data[i].img?JSON.parse(data[i].img)[0]:'noimg.jpg',
                proname = data[i].proName||'暂无',
                protitle = data[i].proTitle||'暂无',
                support = data[i].supportNum|| 0,
                goalmoney = data[i].goalMoney||0;
            $($('.J-proimg')[i]).attr('src','./images/'+savesrc);
            $($('.J-title')[i]).text(proname).next().text(protitle);
            $($('.J-support')[i]).text(support);
            $($('.J-goalmoney')[i]).text(goalmoney);
            $($('.J-objectid')[i]).val(data[i].selfid);
        }
    }
});