$(document).ready(function() {
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

    //初始化页面
    var proid =getQueryString("proid");
    //获取相关项目
    $.ajax({
        type:'get',
        url:'/godetail',
        data:{
            proid:proid
        },
        success:function(data){
            reset(data);
        },
        error:function(){
            alert('ajax error');
        }
    });
    //时间处理函数
    function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式
        var  aDate,  oDate1,  oDate2,  iDays
        aDate  =  sDate1.split("-")
        oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2006格式
        aDate  =  sDate2.split("-")
        oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
        iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数
        return  iDays
    }
    function reset(obj) {
        var now = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
        var ft = obj.finishTime.substr(0,10);
        //var t = Date.parse(now) / (60 * 60 * 24 * 1000) - Date.parse(obj.startTime) / (60 * 60 * 24 * 1000);
        //t = Math.round(t*100);
        var ccc= DateDiff(ft,now);
        var progress = Math.round(obj.currentMoney/obj.goalMoney*100)+ "%";
        $('.progress-bar').attr("aria-valuenow",Math.round(obj.currentMoney/obj.goalMoney*100));
        $('.progress-bar').css('width',progress);
        $('.progress-bar').text(progress);
        $(".project_title h1").html(obj.proTitle);
        $('.j_apply').html(obj.username);
        $('.j_attention').html(obj.attention.length);
        $('.j_support').html(obj.supportNum);
        $(".proDes").html(obj.proDescribe);
        $(".current-money .money").html(obj.currentMoney);
        $(".target-money .fTime").html(ft);
        $(".percentage").html(progress);
        $(".target-money .money").html(obj.goalMoney);
        $(".data-number.people").html(obj.supportNum);
        $(".data-number.time").html(ccc+"天");
        $(".repay1 span").html("￥"+obj.perSupport.payBack1.pbMoney);
        $(".repay2 span").html("￥"+obj.perSupport.payBack2.pbMoney);
        $(".repay3 span").html("￥"+obj.perSupport.payBack3.pbMoney);
        $(".repay1 .rpTitle").html(obj.perSupport.payBack1.pbTitle);
        $(".repay2 .rpTitle").html(obj.perSupport.payBack2.pbTitle);
        $(".repay3 .rpTitle").html(obj.perSupport.payBack3.pbTitle);
        $(".repay1 .rpCon").html(obj.perSupport.payBack1.pbCon);
        $(".repay2 .rpCon").html(obj.perSupport.payBack2.pbCon);
        $(".repay3 .rpCon").html(obj.perSupport.payBack3.pbCon);
        for (var i = 0; i < JSON.parse(obj.img).length; i++) {
            insertImg(JSON.parse(obj.img)[i]);
        }

        try{
            //项目进度相关
            if(obj.proTrend.length>0){
                $('.noneCon').css("display","none");
                $('.progressBox').css("display","block");
                for( var i= 0;i<obj.proTrend.length;i++){
                    var box = $('<div class="progressItem"></div>');
                    var pgsTitle ='<p class="pgsTitle">'+obj.proTrend[i].trendTime+'</p>';
                    var title =$('<div class="titleBox"><p class="titleLine"></p><div class="titleInner">'+pgsTitle+'</div></div>');
                    var pgsCon = $('<p class="pgsCon"></p>');
                    var pgsImg = $('<div class="pgsImg"></div>');
                    pgsCon.html(obj.proTrend[i].trendCon);
                    for (var i = 0; i < JSON.parse(obj.proTrend[i].trendImg).length; i++) {
                        var imgS =JSON.parse(obj.proTrend[i].trendImg)[i];
                        var img = "<img src=\" images\\" + imgS + "\"" + "alt=\"\">";
                        pgsImg.append(img);
                    }
                    box.append(title).append(pgsCon).append(pgsImg);
                    $('.progressBox').append(box);
                }
            }else{
                $('.noneCon').css("display","block");
                $('.progressBox').css("display","none");
            }
        }catch(e){}

    }

    //关注项目
    function payAttention(){
        if(username){
            $.ajax({
                type:'post',
                url:'/uAttentionPro',
                async: false,
                data:{
                    proId:proid,
                    username:username
                },
                success:function(data){
                   //$('.guanzhu').removeClass('glyphicon-star-empty')
                   //    .addClass('glyphicon glyphicon-star');
                },
                error:function(){
                    alert('ajax error');
                }
            });
            $.ajax({
                type:'post',
                url:'/pAttentionPro',
                async: false,
                data:{
                    proId:proid,
                    username:username
                },
                success:function(data){
                    $('.guanzhu').removeClass('glyphicon-star-empty')
                        .addClass('glyphicon glyphicon-star');
                    location.reload();
                    //var c = $('.j_attention').html();
                    //$('.j_attention').html(Number(c)+1);

                },
                error:function(){
                    alert('ajax error');
                }
            });

        }else{
            window.location.href="login";
        }
    }
    $('.j_payAtt').on('click',payAttention);



    //详情页tab选项卡的切换
    function tabchange() {
        $(".tabs_wrap li").click(function () {
            $(".tabs_wrap li").eq($(this).index())
                .addClass("selected")
                .siblings()
                .removeClass('selected');
            $(".project_content > div").eq($(this).index())
                .css('display', 'block')
                .siblings()
                .css('display', 'none');

        });
    }

    tabchange();

    //插入项目介绍的图片
    function insertImg(imgsrc) {
        var img = "<img src=\" images\\" + imgsrc + "\"" + "alt=\"\">";
        $(".cover").append(img);

    }

    //支持项目
    $('.support').on('click',function(){
        if(!username){
            window.location.href="login";
            return false;
        }
        var index = $(this).parent().index()+1;
        window.location.href="proPay?proid="+proid+"&index="+index;
    })
    function mySupport(pro){
        $(".support").click(function(){
            var sNum =pro.supportNum + 1;
            var num = 0;
            var cMoney = 0;
            if($(this).attr("id")=="repay1"){
                num = 20;
            }else{
                if($(this).attr("id")=="repay2"){
                    num = 100;
                }else{
                    num = 200;
                }

            }
            cMoney = pro.currentMoney + num;
            $(".current-money .money").html(cMoney);
            $.ajax({
                type: "post",
                url: "/supportPro",
                data:{
                    _id:pro._id,
                    money:cMoney,
                    sptNum:sNum
                },
                success: function(data) {
                    alert("成功");
                },
                error: function(data) {
                    alert("失败");
                }
            })
        })

    }

})