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
    //获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    //赋值添加时间
    function addTime(){
        var today = new Date(),
            year = today.getFullYear(),
            month = today.getMonth()+1,
            day = today.getDate();
        $('#J-trend-time').val(year+'-'+month+'-'+day);
    }
    addTime();
    var proid =getQueryString("proid"), //项目id
        imgarr = [],                    //保存图片
        $trendimg = $('.J-trend-img');
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
            if($trendimg.children('.no-pro-bg').length>0){
                $trendimg.children().remove();
            }
            $trendimg.append($img);
            event.stopPropagation();
        });
    };
    //删除图片
    $('.J-trend-img').delegate('.J-del-btn','click',function(){
        var imgname = $(this).siblings('img').attr('alt'),
            index = imgarr.indexOf(imgname);
        imgarr.splice(index,1);
        $(this).parent('.prescan-item').remove();
    });
    //提交
    $('.J-submit').on('click',function(){
        var trendtime = $('#J-trend-time').val(),
            trendcon = $('#J-trend-con').val(),
            trendimg = JSON.stringify(imgarr);
        $.ajax({
            method:'post',
            url:'/addProTrends',
            data:{
                proid:proid,
                trendTime:trendtime,
                trendCon:trendcon,
                trendImg:trendimg
            },
            success:function(data){
                if(data == 'success'){
                    alert('添加成功！');
                    window.location.href = 'detail?proid='+proid;
                }
            },
            error:function(){
                alert('ajax error!')
            }
        });
    });
});