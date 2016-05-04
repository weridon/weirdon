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
    //资金发放状态图表
    var mnyGrantState = echarts.init(document.getElementById('money-grant-data'));
    mnyGrantState.setOption({
        series:[
            {
                name:'审核通过的项目状态',
                type:'pie',
                radius:'55%',
                roseType:'angle',
                data:[
                    {value:0,name:'未发放'},
                    {value:0,name:'已发放'},
                    {value:0,name:'已返还'}
                ]
            }
        ]
    });
    //资金总量统计
    var mnyCountState = echarts.init(document.getElementById('money-raise-data'));
    mnyCountState.setOption({
        legend: {
            data:['资金总量']
        },
        xAxis: {
            data: ["今天","昨天","前天","最近一周"]
        },
        yAxis: {},
        series: [{
            name: '资金总量',
            type: 'bar',
            data: [5, 4, 6, 18]
        }]
    });
    updateCharts();

    //更新图表
    function updateCharts(){
        var alreadyGrant = 0,    //已发放
            alreadySendBack = 0, //已返还
            notGrant = 0;        //未发放
        $.ajax({
            type:'get',
            url:'/updateMnyGrantData',
            success:function(data){
                alreadySendBack = data.alreadySendBack;
                alreadyGrant = data.alreadyGrant;
                notGrant = data.notGrant;
                mnyGrantState.setOption({
                    series:[
                        {
                            name:'审核状态',
                            type:'pie',
                            radius:'55%',
                            roseType:'angle',
                            data:[
                                {value:notGrant,name:'未发放'},
                                {value:alreadyGrant,name:'已发放'},
                                {value:alreadySendBack,name:'已返还'}
                            ]
                        }
                    ]
                });
            },
            error:function(){
                alert('ajax error!');
            }
        });
    }

    var $grantMnyMask = $('.grant-mny-mask');
    //点击发放回报 管理员输入发放金额
    $('table').delegate('.J-grant-to-user','click',function(){
        var $self = $(this);
        var proid = $self.next().val(),
            targetIndex = $self.data('index');
        //获取该项目账户金额
        $.ajax({
            method:'get',
            url:'/getProAccount',
            data:{proid:proid},
            success:function(data){
                var proAccount = data.proAccount,
                    currentmny = data.currentMny;
                $('#J-can-grant').val(currentmny-proAccount);
                $grantMnyMask.show();
                $('#J-mny-grant-proid').val(proid);
                $('#J-target-index').val(targetIndex);
            },
            error:function(){
                alert('ajax error!');
            }
        });
    });
    //发放回报给发起人
    $('.J-sure-grant').on('click',function(){
        var proid = $('#J-mny-grant-proid').val(),
            attendGrant = Number($('#J-attend-grant').val()),
            canGrant = Number($('#J-can-grant').val()),
            targetIndex = Number($('#J-target-index').val())+1;
        if(attendGrant<canGrant){
            //发放项目资金
            $.ajax({
                method:'post',
                url:'/updateBothAccount',
                data:{
                    proid:proid,
                    attendGrant:attendGrant,
                    isGrant:0
                },
                success:function(data){
                    if(data=="success"){
                        alert('发放成功！');
                    }
                },
                error:function(){
                    alert('ajax error!')
                }
            });
        }else if(attendGrant==canGrant){
            $.ajax({
                method:'post',
                url:'/updateBothAccount',
                data:{
                    proid:proid,
                    attendGrant:attendGrant,
                    isGrant:1
                },
                success:function(data){
                    if(data=="success"){
                        alert('发放成功！');
                        var $curtr = $('tr').eq(targetIndex);
                        $curtr.children('td').eq(6).children('a').removeClass('J-grant-to-user').addClass('J-already-grant');
                        $curtr.children('td').eq(7).removeClass('notyet-grant').addClass('raise-success').text('已发放');
                    }
                },
                error:function(){
                    alert('ajax error!')
                }
            });
        }else{
            alert('发放金额大于可发放金额，请重新输入！');
        }
        $grantMnyMask.hide();
    });
    $('.J-cancel-grant').on('click',function(){
        $grantMnyMask.hide();
    });
    //返还支持金额给支持者
    $('table').delegate('.J-grant-to-supporter','click',function(){
        var $self = $(this);
        var proid = $self.next().val();
        $.ajax({
            method:'post',
            url:'/updateSupporterAccount',
            data:{proid:proid},
            success:function(data){
                if(data=="success"){
                    alert('发放成功！');
                    $self.removeClass('J-grant-to-supporter').addClass('J-already-grant');
                    $self.parent('td').next().removeClass('notyet-grant').addClass('raise-success').text('已返还');
                }
            },
            error:function(){
                alert('ajax error!')
            }
        });
    });
    //已发放、返还再次点击按钮
    $('table').delegate('.J-already-grant','click',function(){
        var cfg = {
            msg:'该项目所筹资金已发放/返还'
        };
        dialog.init(cfg);
    });
    //筛选
    $('#mny-grant-btn').on('click',function(){
        var type = $(this).siblings('select').val();
        if(type!='all'){
            $.ajax({
                method:'get',
                url:'/findProByGrant',
                data:{type:type},
                success:function(data){
                    console.log(data);
                },
                error:function(){
                    alert('ajax error!');
                }
            });
        }else{
            $.ajax({
                method:'get',
                url:'/getgoodlist',
                success:function(data){
                    console.log(data);
                },
                error:function(){
                    alert('ajax error!');
                }
            });
        }
    })
});