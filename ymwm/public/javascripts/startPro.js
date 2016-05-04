/**
 * Created by 神盾局 on 2016/3/16.
 */
$(document).ready(function(){
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

    var $infostep = $('.J-info-step'),
        $basicinfo = $('.J-basic-info'),
        $projectinfo = $('.J-project-info'),
        $detailinfo = $('.J-detail-info'),
        $paybackinfo = $('.J-payback-info'),
        $nextbtn = $('.J-next'),
        $lastbtn = $('.J-last'),
        $type = $('.J-type'),
        $proimg =$('.J-proimg'),
        imgarr = [];     //上传的图片

    //tab点击
    $infostep.on('click',function(){
        var $self = $(this),
            moveIndex = $self.data('index'),
            conchilds = $('.J-content>form').children(),
            curIndex;
        for(var i=0;i<4;i++){
            if($(conchilds[i]).data('show')=='1'){
                curIndex = i+1;
                break;
            }
        }
        if(Math.abs(moveIndex-curIndex)==1){
            if(curIndex<moveIndex){
                slideToNext(curIndex,moveIndex);
            }else if(curIndex>moveIndex){
                slideToLast(curIndex,moveIndex);
            }else{

            }
        }
    });
    //下一步
    $nextbtn.on('click',function(){
        var $self = $(this),
            nextIndex = $self.data('next'),
            curIndex = nextIndex-1;
        slideToNext(curIndex,nextIndex);
    });
    //上一步
    $lastbtn.on('click',function(){
        var $self = $(this),
            lastIndex = $self.data('last'),
            curIndex = lastIndex+1;
        slideToLast(curIndex,lastIndex);
    });
    //滑向下一页
    function slideToNext(cur,move){
        $infostep.removeClass('info-item-active');
        $($infostep[move-1]).addClass('info-item-active');
        switch(cur){
            case 1:$basicinfo.removeClass('slide-recovery').addClass('slide-to-left').data('show','0');break;
            case 2:$projectinfo.removeClass('slide-recovery').addClass('slide-to-left').data('show','0');break;
            case 3:$detailinfo.removeClass('slide-recovery').addClass('slide-to-left').data('show','0');break;
            default:break;
        }
        switch(move){
            case 2:$projectinfo.removeClass('slide-to-right').addClass('slide-recovery').data('show','1');break;
            case 3:$detailinfo.removeClass('slide-to-right').addClass('slide-recovery').data('show','1');break;
            case 4:$paybackinfo.removeClass('slide-to-right').addClass('slide-recovery').data('show','1');break;
            default:break;
        }
    }
    //滑向上一页
    function slideToLast(cur,move){
        $infostep.removeClass('info-item-active');
        $($infostep[move-1]).addClass('info-item-active');
        switch(cur){
            case 2:$projectinfo.removeClass('slide-recovery').addClass('slide-to-right').data('show','0');break;
            case 3:$detailinfo.removeClass('slide-recovery').addClass('slide-to-right').data('show','0');break;
            case 4:$paybackinfo.removeClass('slide-recovery').addClass('slide-to-right').data('show','0');break;
            default:break;
        }
        switch(move){
            case 1:$basicinfo.removeClass('slide-to-left').addClass('slide-recovery').data('show','1');break;
            case 2:$projectinfo.removeClass('slide-to-left').addClass('slide-recovery').data('show','1');break;
            case 3:$detailinfo.removeClass('slide-to-left').addClass('slide-recovery').data('show','1');break;
            default:break;
        }
    }
    //图片上传
    $('.J-upload').on('click',function() {
        $('#upload-file').click();
    });
    var EventUtil = {
        addHandler:function(element,type,handler){
            if(element.addEventListener){
                element.addEventListener(type,handler,false);
            }else if(element.attachEvent){
                element.attachEvent("on"+type,handler);
            }else{
                element["on"+type] = handler;
            }
        }
    };
    readfile();
    function readfile(){
        var uploadf = document.getElementById("upload-file");
        EventUtil.addHandler(uploadf,"change",function(event){
            var files = event.currentTarget.files,
                filename = files[0].name,
                $img = $('<div class="prescan-item fl"><img alt="'+filename+'" src="./images/'+filename+'"><a class="del-btn J-del-btn" href="javascript:;">删除</a></div>');
            imgarr.push(filename);
            $proimg.val(JSON.stringify(imgarr));
            $('.J-prescan').append($img);
            event.stopPropagation();
        });
    };
    //删除图片
    $('.J-prescan').delegate('.J-del-btn','click',function(){
        var imgname = $(this).siblings('img').attr('alt'),
            index = imgarr.indexOf(imgname);
        imgarr.splice(index,1);
        $(this).parent('.prescan-item').remove();
    });
    //选择项目类型
    $type.on('click',function(){
        var $self = $(this);
        $type.children('span').removeClass('type-item-active');
        $self.children('span').addClass('type-item-active');
        $self.siblings().children('input').prop('checked',false);
        $self.children('input').prop('checked',true);
    });
    //添加回报设置
    $('.J-add-payback').on('click',function(){
        $(this).parents('.payback-outer').removeClass('payback-normal').addClass('payback-slide-up').next().removeClass('payback-slide-down').addClass('payback-normal');
    });
});