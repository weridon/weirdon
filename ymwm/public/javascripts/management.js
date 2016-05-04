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
    //用户审核状态图表
    var userCheck = echarts.init(document.getElementById('user-check-data'));
    userCheck.setOption({
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
    //用户注册数统计
    var userRegister = echarts.init(document.getElementById('user-regist-data'));
    userRegister.setOption({
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
            username = $tr.children('td:first-child').text();
        var cfg = {
            closeBtn:[
                {
                    tag:'.jq-sure-btn',
                    callback:function(){
                        check(username,1,function(result){
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
                        check(username,2,function(result){
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
    //更改用户审核状态
    function check(username,state,callback){
        $.ajax({
            method:'post',
            url:'/check',
            data:{
                username:username,
                isUsed:state
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
            url:'/getChartsData',
            dataType:'json',
            success:function(data){
                var waitnum = data.waitnum,
                    passnum = data.passnum,
                    unpassnum = data.unpassnum;
                userCheck.setOption({
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
    //删除用户
    $('table').delegate('.J-delete','click',function(){
        var $self = $(this),
            $tr = $self.parents('tr'),
            username = $tr.children('td:first-child').text();
        console.log(username);
        var cfg = {
            dlgwrapper:'.sec-dialog',
            dlgcon:'.sec-dialog-con',
            closeBtn:[
                {
                    tag:'.sec-sure-btn',
                    callback:function(){
                        deleteUser(username,$tr);
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
    //删除用户请求
    function deleteUser(username,ele){
        $.ajax({
            method:'delete',
            url:'/deleteUser',
            data:{username:username},
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
    //筛选用户
    $('#find-user-btn').on('click',function(){
        var type = $(this).siblings('select').val();
        if(type != 'all'){
            $.ajax({
                method:'get',
                url:'/findUserByState',
                data:{state:type},
                success:function(user){
                    createUserTable(user);
                },
                error:function(){
                    alert('ajax error!');
                }
            });
        }else{
            $.ajax({
                method:'get',
                url:'/findAllUser',
                success:function(user){
                    createUserTable(user);
                },
                error:function(){
                    alert('ajax error!');
                }
            });
        }
    });
    var $userInfo = $('#J-user-info');  //用户信息tbody
    //创建用户信息table
    function createUserTable(user){
        $userInfo.children().remove();
        user.forEach(function(item,index,user){
            var sex = (item.sex==1)?'女':((item.sex==2)?'男':'保密'),
                $state;
            var $newele = $('<tr><td>'+item.username+'</td><td>'+item.tele+'</td><td>'+item.idCard+'</td>' +
                '<td>'+item.email+'</td><td>'+item.realName+'</td><td>'+sex+'</td>' +
                '<td>'+item.bankName+'</td><td>'+item.bankNum+'</td>' +
                '<td><a class="btn btn-info btn-sm J-check" href="#">审核</a> <a class="btn btn-warning btn-sm J-delete" href="#">删除</a></td></tr>');
            $newele.appendTo($userInfo);
            switch (item.isUsed){
                case 0:$state=$('<td class="waiting-check"><span class="glyphicon glyphicon-question-sign"></span>待审核</td>');break;
                case 1:$state=$('<td class="check-pass"><span class="glyphicon glyphicon-ok"></span>已通过</td>');break;
                case 2:$state=$('<td class="check-unpass"><span class="glyphicon glyphicon-remove"></span>未通过</td>');break;
                default:break;
            }
            $state.appendTo($('tbody tr:last-child'));
        });
    }
});