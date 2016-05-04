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
    //项目审核状态图表
    var proCheck = echarts.init(document.getElementById('pro-check-data'));
    proCheck.setOption({
        series:[
            {
                name:'审核状态',
                type:'pie',
                radius:'55%',
                roseType:'angle',
                data:[
                    {value:0,name:'待审核'},
                    {value:0,name:'审核通过'},
                    {value:0,name:'未通过'}
                ]
            }
        ]
    });
    //项目进行状态统计
    var proState = echarts.init(document.getElementById('pro-finish-data'));
    proState.setOption({
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
        $.ajax({
            method:'get',
            url:'/getProChartsData',
            dataType:'json',
            success:function(data){
                var waitnum = data.waitnum,
                    passnum = data.passnum,
                    unpassnum = data.unpassnum;
                proCheck.setOption({
                    series:[
                        {
                            name:'审核状态',
                            type:'pie',
                            radius:'55%',
                            roseType:'angle',
                            data:[
                                {value:waitnum,name:'待审核'},
                                {value:passnum,name:'审核通过'},
                                {value:unpassnum,name:'未通过'}
                            ]
                        }
                    ]
                });
            },
            error:function(){
                alert('ajax error!')
            }
        });
    }
    //删除项目
    $('table').delegate('.J-delete','click',function(){
        var $self = $(this),
            $tr = $self.parents('tr'),
            proid = $tr.children('td:first-child').children('input').val();
        console.log(proid);
        var cfg = {
            dlgwrapper:'.sec-dialog',
            dlgcon:'.sec-dialog-con',
            closeBtn:[
                {
                    tag:'.sec-sure-btn',
                    callback:function(){
                        deletePro(proid,$tr);
                    }
                },{
                    tag:'.sec-cancel-btn',
                    callback:null
                },{
                    tag:'.sec-close-tag',
                    callback:null
                }
            ]
        };
        dialog.init(cfg);
    });
    //删除项目请求
    function deletePro(proid,ele){
        $.ajax({
            method:'delete',
            url:'/deletePro',
            data:{proid:proid},
            success:function(data){
                if(data=='success'){
                    ele.remove();
                }
            },
            error:function(){
                alert('ajax error!')
            }
        });
    }
    //筛选项目
    $('#find-pro-btn').on('click',function(){
        var type = $(this).siblings('select').val();
        if(type != 'all'){
            $.ajax({
                method:'get',
                url:'/findProByCheckState',
                data:{state:type},
                success:function(project){
                    createProTable(project);
                },
                error:function(){
                    alert('ajax error!');
                }
            });
        }else{
            $.ajax({
                method:'get',
                url:'/getAllPro',
                success:function(project){
                    createProTable(project);
                },
                error:function(){
                    alert('ajax error!');
                }
            });
        }
    });
    var $proInfo = $('#J-pro-info');  //用户信息tbody
    //创建项目信息table
    function createProTable(project){
        $proInfo.children().remove();
        project.forEach(function(item,index,user){
            var proname = item.proName||'暂无',
                proid = item.selfid,
                proimg = item.img?JSON.parse(item.img)[0]:'noimg.jpg',
                username = item.username||'未知',
                protype = item.proType,
                protitle = item.proTitle||'暂无',
                during = item.during,
                mny = item.goalMoney;
            var $newele = $('<tr><td class="protitle">'+proname+'<input type="hidden" value="'+proid+'"></td><td><img src="/images/'+proimg+' "alt="proimg"></td><td>'+username+'</td>' +
                '<td>'+protype+'</td><td class="protitle">'+protitle+'</td><td class="text-center">'+during+'</td>' +
                '<td class="text-center">'+mny+'</td><td><a href="javascript:;" class="btn btn-sm btn-success J-find-more">查看</a></td>' +
                '<td><a class="btn btn-info btn-sm J-check" href="#">审核</a>' +
                '<a class="btn btn-warning btn-sm J-delete" href="#">删除</a></td></tr>');
            $newele.appendTo($proInfo);
            switch (item.isCheck){
                case 0:$state=$('<td class="waiting-check"><span class="glyphicon glyphicon-question-sign"></span>待审核</td>');break;
                case 1:$state=$('<td class="check-pass"><span class="glyphicon glyphicon-ok"></span>已通过</td>');break;
                case 2:$state=$('<td class="check-unpass"><span class="glyphicon glyphicon-remove"></span>未通过</td>');break;
                default:break;
            }
            $state.appendTo($('tbody tr:last-child'));
        });
    }
    //查看项目更多信息 蒙层出现
    $('table').delegate('.J-find-more','click',function(){
        var $self = $(this);
        var proid = $self.parent('td').siblings('.protitle').children('input').val();
        $.ajax({
            method:'get',
            url:'/findProById',
            data:{proid:proid},
            success:function(data){
                creatDtl(data);
            },
            error:function(){
                alert('ajax error!')
            }
        });
    });
    var $prodtl = $('.J-pro-dtl'),
        $prorisk = $('.J-pro-risk'),
        $payback = $('.J-pro-payback'),
        $dtlmask = $('.detail-mask');
    function creatDtl(pro){
        var prodtl = pro.proDescribe,
            prorisk = pro.proRisk,
            payback = pro.perSupport;
        $prodtl.text(prodtl);
        $prorisk.text(prorisk);
        $payback.children().remove();
        for(var i in payback){
            var mny = payback[i].pbMoney,
                con = payback[i].pbCon;
            var $pbitem = $('<div class="payback-item"><p><span class="item-title">支持：</span><span>'+mny+'</span>元</p>' +
                '<p><span class="item-title">回报：</span><span>'+con+'</span></p></div>');
            $payback.append($pbitem);
        }
        $dtlmask.show();
    }
    $('.J-dtl-close').on('click',function(){
        $dtlmask.hide();
    });
});