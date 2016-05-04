requirejs.config({
    baseUrl:'javascripts',
    paths: {
        "jquery":'jquery-2.2.1.min',
        'echarts':'echarts.min',
        "dialog":'components/dialog/dialog'
    }
});
requirejs(['jquery','dialog','echarts'],function($,dialog,echarts){
    //退出登录
    function exit(){
        document.cookie = "name=\"\"";
        window.localStorage.removeItem("name");
        window.location.href="login";
    }
    $('nav').on('click','.J-exit',exit);
    //项目进行状态图表
    var proState = echarts.init(document.getElementById('pro-check-data'));
    proState.setOption({
        series:[
            {
                name:'审核通过的项目状态',
                type:'pie',
                radius:'55%',
                roseType:'angle',
                data:[
                    {value:0,name:'进行中'},
                    {value:0,name:'已结束'}
                ]
            }
        ]
    });
    //项目进行状态统计
    var proStart = echarts.init(document.getElementById('pro-finish-data'));
    proStart.setOption({
        legend: {
            data:['用户注册数']
        },
        xAxis: {
            data: ["今天","昨天","前天","最近一周"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 4, 6, 18]
        }]
    });
    updateCharts();

    //审核按钮点击事件
    $('table').delegate('.J-check','click',function(){
        var $self = $(this),
            $checkstatus = $self.parent('td').next(),
            $tr = $self.parents('tr'),
            proid = $tr.children('td:first-child').children('input').val();
        var cfg = {
            closeBtn:[
                {
                    tag:'.jq-sure-btn',
                    callback:function(){
                        check(proid,1,function(result){
                            if(result == 'success'){
                                $checkstatus.remove();
                                var $pass = $('<td class="check-pass"><span class="glyphicon glyphicon-ok"></span>已通过</td>');
                                $tr.append($pass);
                                updateCharts();
                            }
                        });
                    }
                }, {
                    tag:'.jq-cancel-btn',
                    callback:function(){
                        check(proid,2,function(result){
                            if(result=='success'){
                                $checkstatus.remove();
                                var $pass = $('<td class="check-unpass"><span class="glyphicon glyphicon-remove"></span>未通过</td>');
                                $tr.append($pass);
                                updateCharts();
                            }
                        });
                    }
                },{
                    tag:'.jq-close-tag',
                    callback:null
                }
            ]
        };
        dialog.init(cfg);
    });
    //更改项目审核状态
    function check(proid,state,callback){
        $.ajax({
            method:'post',
            url:'/checkPro',
            data:{
                proid:proid,
                isCheck:state
            },
            success:function(data){
                if(data=='success'){
                    callback('success');
                }
            },
            error:function(){
                alert('ajax error');
            }
        });
    }
    //更新图表
    function updateCharts(){
        var raisingnum = $('.waiting-check').length,
            finishnum = $('.check-pass').length;
        proState.setOption({
            series:[
                {
                    name:'审核状态',
                    type:'pie',
                    radius:'55%',
                    roseType:'angle',
                    data:[
                        {value:raisingnum,name:'进行中'},
                        {value:finishnum,name:'已结束'}
                    ]
                }
            ]
        });
    }
    //筛选项目
    var $allpro = $('tbody').children(),
        $finishpro = $('.check-pass').parent('tr'),
        $rasingpro = $('.waiting-check').parent('tr');
    $('#select-state-btn').on('click',function(){
        $allpro.hide();
        var type = $(this).siblings('select').val();
        switch (type){
            case 'all':$allpro.show();break;
            case '0':$rasingpro.show();break;
            case '1':$finishpro.show();break;
            default:break;
        }
    });
    //关闭项目动态弹窗
    $('#close-trend-btn').on('click',function(){
        $('.trend-mask').hide();
    });
    var $trendmask = $('.trend-mask'),  //项目动态蒙层
        $notrend = $('.no-trend'),      //暂无项目动态
        $trendlist = $('.trend-list');  //项目动态列表
    //点击查看项目动态
    $('.J-find-trend').on('click',function(){
        var selfid = $(this).parent().siblings('.protitle').children('input').val();
        $.ajax({
            method:'get',
            url:'/findProTrend',
            data:{selfid:selfid},
            success:function(data){
                if(data.length>0){
                    $trendmask.show();
                    $notrend.hide();
                    $trendlist.show().children().remove();
                    creatTrend(data);
                }else{
                    $trendmask.show();
                    $notrend.show();
                    $trendlist.hide();
                }
            },
            error:function(){
                alert('ajax error!')
            }
        });
    });
    //插入项目动态
    function creatTrend(protrend){
        protrend.forEach(function(item,index,arr){
            var $trenditem = $('<li class="trend-item"><p  class="trend-time">'+item.trendTime+'</p>' +
                '<span class="glyphicon glyphicon-volume-up news"></span>' +
                '<p class="trend-con">'+item.trendCon+'</p></li>');
            if(index==0){
                $trendlist.append($trenditem);
            }else{
                $trenditem.insertBefore($trendlist.children());
            }
        });
        var $lastline = $('<li><div class="last-no-line"></div></li>');
        $trendlist.append($lastline);
    }
});