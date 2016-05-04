var express = require('express');
var router = express.Router();
var Project = require('../models/project.js');
var User = require('../models/user.js');
var Order = require('../models/order.js');
var Money = require('../models/money.js');
var Admin = require('../models/admin.js');
var fs = require('fs');

//登录
router.get('/login',function(req,res){
    res.render('login');
});

//登录验证
router.post('/mylogin',function(req, res){
    var password = req.body.password;
    User.get(req.body.username, function (err, user) {
        if(user!=null){
            if(user.password!=password){
                return res.send({
                    isChecked: false,
                    text: 'password erro'
                });
            }else{
                res.send({
                    isChecked: true
                });
            }
        }else{
            return res.send({
                isChecked: false,
                text: 'user is not exist'
            });
        }
    });
});
//注册
router.get('/register',function(req,res){
    res.render('register');
});

//用户手册
router.get('/term',function(req,res){
    res.render('term');
});
//用户资料
router.get('/userinfo',function(req,res){
    res.render('userinfo');
});
//修改密码
router.get('/editPwd',function(req,res){
    res.render('editPwd');
});
//账户
router.get('/account',function(req,res){
    res.render('account');
});

//收货地址
router.get('/adress',function(req,res){
    res.render('adress');
});
//订单页面
router.get('/proPay',function(req,res){
    res.render('proPay');
});
//支付页面
router.get('/pay',function(req,res){
    res.render('pay');
});
//注册存储用户信息
router.post('/userIdentify',function(req,res){
    User.get(req.body.username,function(err,user){
        if(err!=null){
            res.redirect('./');
        }
        if(user!=null){
            res.send('用户名已存在');
        }else{
            res.send('success');
        }
    });
});
//存储新注册用户信�
router.post('/userSave',function(req,res){
    var newuser = new User({
        email: req.body.email,
        username:req.body.username,
        password:req.body.password
    });
    if(req.body.username == 'admin'){
        var admin = new Admin({
            email: req.body.email,
            username:req.body.username,
            password:req.body.password
        });
        admin.save(function(err){
            if(err!=null){
                res.redirect('./');
            }
            saveuser();
        });
    }else{
        saveuser();
    }
    function saveuser(){
        newuser.save(function(err){
            if(err!=null){
                res.redirect('./');
            }
            res.send('success');
        });
    }
});
//修改用户基本信息
router.post('/editUserinfo',function(req,res){
    var userinfo = req.body;
    User.editUserinfo(userinfo,function(err){
        if(err!=null){
            res.redirect('./');
        }
        res.send('success');
    });
});
//填写实名认证信息
router.post('/editRealName',function(req,res){
    var userinfo = req.body;
    User.editRealName(userinfo,function(err){
        if(err!=null){
            res.redirect('./');
        }
        res.send('success');
    });
});
//填写银行信息
router.post('/editBindBank',function(req,res){
    var userinfo = req.body;
    User.editBindBank(userinfo,function(err){
        if(err!=null){
            res.redirect('./');
        }
        res.send('success');
    });
});
//修改密码
router.post('/editPassword',function(req,res){
    var username = req.body.username,
        oldPwd = req.body.oldPwd,
        newPwd = req.body.newPwd;
    User.editPassword(username,oldPwd,newPwd,function(err,result){
        if(err!=null){
            res.redirect('./');
        }
        console.log(result);
        res.send(result.result);
    });
});
//修改地址
router.post('/editAddress',function(req,res){
    var username = req.body.username,
        adsData = {
            recipient:req.body.recipient,
            tele:req.body.tele,
            address:req.body.address,
            postcode:req.body.postcode
        };
    User.editAddress(username,adsData,function(err){
        if(err!=null){
            res.redirect('./');
        }
        res.send('success');
    });
});
//账户充�
router.post('/recharge',function(req,res){
    var username = req.body.username,
        password = req.body.password,
        money    = req.body.money;
    User.recharge(username,password,money,function(err,result){
        if(err!=null){
            res.redirect('./');
        }
        res.send(result.result);
    });
});
//获取用户信息
router.post('/getUser',function(req,res){
    var username = req.body.username;
    User.get(username,function(err,user){
        if(err!=null){
            res.redirect('./');
        }

        res.send(user);
    })
});
//浏览项目
router.get('/scan', function (req, res) {
    Project.getProAndId(function(err,project) {
        if (err) {
            return res.redirect('/');
        }
        res.render('scan',{
            group:project
        });
    });
});
//浏览项目点击后去项目详情
router.get('/godetail',function(req,res){
    var proid = req.query.proid;
    Project.findProById(proid,function(err,project){
        if(err != null){
            res.redirect('./');
        }
        res.send(project);
    });
})

//浏览项目取得数据
router.get('/index.js', function (req, res) {
    var pro = req.query.q;
    Project.getOne(pro,function (err, proname) {
        if (err) {
            console.log(err);
        }
        res.send(proname);
    });
});
//获取项目统计信息
router.get('/getTotal', function (req, res) {
    Project.getTotalInfo(function (err, totalInfo) {
        if (err) {
            console.log(err);
        }
        res.send(totalInfo);
    });
});
//发起项目
router.get('/startProject', function (req, res) {
    var username = req.cookies.name;
    if(username){
        User.findOneUser(username,function(err,user){
            if(err!=null){
                res.redirect('./');
            }
            var check = user.isUsed;
            if(check!=1){
                res.render('nopass');  //未通过审核
            }else{
                res.render('startProject'); //通过审核后渲染页�
            }
        });
    }else{
        res.render('relogin');
    }
});

//发起项目存储信息
router.post('/startProject', function(req, res) {
    var date = new Date();
    //// 上传文件的临时路�
    //var tmp_path = req.files.path;
    //// 移动至硬盘路�
    //var target_path = './public/upload-images/' + req.files.name;
    //// 移动文件
    //fs.rename(tmp_path, target_path, function(err) {
    //    if (err) throw err;
    //    // 删除临时文件
    //    fs.unlink(tmp_path, function() {
    //        if (err) throw err;
    //    });
    //});
    var newPro = new Project({
        username:req.body.username||req.cookies.name,
        idcard:req.body.idcard,
        tele:req.body.tele,
        address:req.body.address,
        proType:req.param('proType'),
        proName: req.body.proName,
        proTitle: req.body.proTitle,
        goalMoney:req.body.goalMoney,
        during:req.body.during,
        proDescribe:req.body.proDescribe,
        proRisk:req.body.proRisk,
        startTime:date,
        finishTime:0,
        perSupport : {
            payBack1 : {
                pbMoney:req.body.pb1Money,
                pbTitle:req.body.pb1Title,
                pbCon:req.body.pb1Con
            },
            payBack2 : {
                pbMoney:req.body.pb2Money,
                pbTitle:req.body.pb2Title,
                pbCon:req.body.pb2Con
            },
            payBack3 :{
                pbMoney:req.body.pb3Money,
                pbTitle:req.body.pb3Title,
                pbCon:req.body.pb3Con
            }
        },
        img:req.body.img
    });
    newPro.save(function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        Project.findLastOne(function(err,selfid){
            if(err!=null){
                res.redirect('./');
            }
            console.log('tiaozhuan:'+selfid);
            res.redirect('preScan?proid='+selfid);
        });
    });
});

//预览项目
router.get('/preScan',function(req,res){
    var proid = req.query.proid;
    if(!proid){
        res.redirect('index');
    }
    Project.findProById(proid,function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        res.render('preScan',{
            group:project
        });
    });
});

//首页
router.get('/index',function(req,res){
    res.render('index');
});

//项目详情�
router.get('/detail',function(req,res){
    res.render('detail');
});
//获取所有项目
router.get('/getAllPro', function(req, res) {
    Project.getAll(function(err,project) {
        if (err!=null) {
            return res.redirect('/');
        }
        res.send(project);
    });
});
//获取所有审核通过项�
router.get('/getprolist', function(req, res) {
    Project.get(function(err,project) {
        if (err!=null) {
            return res.redirect('/');
        }
        res.send(project);
    });
});
//获取已完成项�
router.get('/getgoodlist', function(req, res) {
    Project.getOver(function(err,project) {

        if (err) {
            return res.redirect('/');
        };

        res.send(project);
    })
});
//关注项目
router.post('/uAttentionPro',function(req, res){
    var proId = req.body.proId,
        username = req.body.username;
    User.payAttention(username,proId,function(err){
        if (err) {
            return res.redirect('/');
        };
        res.send("success");
    });
});
//关注项目
router.post('/pAttentionPro',function(req, res){
    var proId = req.body.proId,
        username = req.body.username;
    Project.payAttention(proId,username,function(err){
        if (err) {
            return res.redirect('/');
        };
        res.send("success");
    })
});
//支持项目
router.post('/pSupportPro',function(req, res){
    var proId = req.body.proId,
        userData= {
            money : req.body.money,
            username : req.body.username};
    Project.supportPro(proId,userData,function(err){
        if (err) {
            return res.redirect('/');
        };
        res.send("success");
    })
});
//支持项目
router.post('/uSupportPro',function(req, res){
    var username = req.body.username,
        dealPassword = req.body.dealPassword,
        supportData={
            money : req.body.money,
            proId : req.body.proId
        };
    User.supportPro(username,dealPassword,supportData,function(err,result){
        if (err) {
            return res.redirect('/');
        };
        res.send(result.result);
    })
});
//按项目类型分�
router.post('/getProByType',function(req,res){
    var protype = req.body.protype;
    if(protype !== '全部'){
        Project.findProByType(protype,function(err,project){
            if(err != null){
                res.redirect('./');
            }
            res.send(project);
        });
    }else{
        Project.get(function(err,project){
            if(err != null){
                res.redirect('./');
            }
            res.send(project);
        });
    }
});
//按项目进度分�
router.post('/getProByStatus',function(req,res){
    var protype = req.body.protype;
    switch(protype){
        case'all':Project.get(function(err,project){
                        if(err != null){
                            res.redirect('./');
                        }
                        res.send(project);
                    });break;
        case'raising':Project.findRaisingPro(function(err,project){
                        if(err != null){
                            res.redirect('./');
                        }
                        res.send(project);
                    });break;
        case'finished':Project.getOver(function(err,project){
                        if(err != null){
                            res.redirect('./');
                        }
                        res.send(project);
                    });break;
        default:break;
    }
});
//按发起项目时间排�
router.get('/getProByTime',function(req,res){
    Project.findProOrderDown(function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        res.send(project);
    });
});
//按项目金额排�
router.get('/getProByMoney',function(req,res){
    Project.findProMoneyDown(function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        res.send(project);
    });
});
//我的众筹 我发起的
router.get('/personal',function(req,res){
    var username = req.cookies.name;
    if(username){
        Project.getUserAllPro(username,function(err,project){
            if(err!=null){
                res.redirect('./');
            }
            res.render('personal',{
                group:project
            });
        });
    }else{
        res.render('relogin');
    }
});
// 我的众筹 我支持的
router.get('/mySupport',function(req,res){
    var username = req.cookies.name;
    if(username) {
        User.findOneUser(username, function (err, user) {
            if (err != null) {
                res.redirect('./');
            }
            var supportPro = user.support,
                suparr = [];
            Project.get(function (err, project) {
                if (err != null) {
                    res.redirect('./');
                }
                supportPro.forEach(function (sitem, si, spro) {
                    project.forEach(function (pitem, pi, pro) {
                        if (pitem.selfid == sitem.proId) {
                            suparr.push(pitem);
                        }
                    });
                });
                res.render('mySupport', {
                    group: suparr
                });
            });
        });
    }else{
        res.render('relogin');
    }
});
// 我的众筹 我关注的
router.get('/myAttention',function(req,res){
    var username = req.cookies.name;
    if(username){
        User.findOneUser(username,function(err,user){
            if(err!=null){
                res.redirect('./');
            }
            var attPro=user.attention,
                attarr = [];
            Project.get(function(err,project){
                if(err!=null){
                    res.redirect('./');
                }
                attPro.forEach(function(aitem,ai,apro){
                    project.forEach(function(pitem,pi,pro){
                        if(pitem.selfid == aitem){
                            attarr.push(pitem);
                        }
                    });
                });
                res.render('myAttention',{
                    group:attarr
                });
            });
        });
    }else{
        res.render('relogin');
    }

});
//项目动�
router.get('/addProTrends',function(req,res){
    var proid = req.query.proid;
    Project.findProById(proid,function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        res.render('addProTrends',{
            group:project
        });
    });
});
//存储项目动�
router.post('/addProTrends',function(req,res){
    var proid = req.body.proid,
        proTrend = {
            trendTime:req.body.trendTime,
            trendCon:req.body.trendCon,
            trendImg:req.body.trendImg
        };
    Project.saveProTrend(proid,proTrend,function(err){
        if(err!=null){
            res.redirect('./');
        }
        res.send('success');
    });
});
//删除项目
router.delete('/deletePro',function(req,res){
    var proid = req.body.proid;
    Project.delete(proid,function(err){
        if(err!=null){
            res.redirect('./');
        }
        res.send('success');
    });
});
//后台管理系统首页-用户管理
router.get('/management',function(req,res){
    var username = req.cookies.name;
    if(username){
        User.getAll(function(err,user){
            if(err!=null){
                res.redirect('./');
            }
            res.render('management',{
                group:user
            });
        });
    }else{
        res.render('login');
    }
});
//用户审核
router.post('/check',function(req,res){
    var username = req.body.username,
        state = req.body.isUsed;
    User.updateCheck(username,state,function(err){
        if(err!=null){
            res.redirect('./');
        }
        res.send('success');
    });
});
//项目审核
router.post('/checkPro',function(req,res){
    var proid = req.body.proid,
        isCheck = req.body.isCheck;
    Project.updateCheck(proid,isCheck,function(err){
        if(err!=null){
            res.redirect('./');
        }
        res.send('success');
    });
});
//获取用户图表信息 通过、未通过、待审核用户�
router.get('/getChartsData',function(req,res){
    var unpassNum = 0,passNum = 0,waitNum = 0;
    User.getAll(function(err,user){
        if(err!=null){
            res.redirect('./');
        }
        user.forEach(function(item,index,user){
            if(item.isUsed == 0){
                waitNum++;
            }else if(item.isUsed == 1){
                passNum++;
            }else{
                unpassNum++;
            }
        });
        var data = {
            waitnum:waitNum,
            passnum:passNum,
            unpassnum:unpassNum
        };
        res.send(data);
    });
});
//获取项目图表信息 通过、未通过、待审核项目
router.get('/getProChartsData',function(req,res){
    var unpassNum = 0,passNum = 0,waitNum = 0;
    Project.get(function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        project.forEach(function(item,index,user){
            if(item.isCheck == 0){
                waitNum++;
            }else if(item.isCheck == 1){
                passNum++;
            }else{
                unpassNum++;
            }
        });
        var data = {
            waitnum:waitNum,
            passnum:passNum,
            unpassnum:unpassNum
        };
        res.send(data);
    });
});
//后台管理 项目审核页面
router.get('/projectAudit',function(req,res){
    var username = req.cookies.name;
    if(username){
        Project.getAll(function(err,project){
            if(err!=null){
                res.redirect('./');
            }
            res.render('projectAudit',{
                group:project
            });
        });
    }else{
        res.render('login');
    }
});
//根据项目审核状态筛�
router.get('/findProByCheckState',function(req,res){
    var state = req.query.state;
    Project.findProByState(state,function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        res.send(project);
    });
});
//后台管理 资金管理
router.get('/manageMoney',function(req,res){
    var username = req.cookies.name;
    if(username){
        Project.getOver(function(err,project){
            if(err!=null){
                res.redirect('./');
            }
            res.render('manageMoney',{
                group:project
            });
        });
    }else{
        res.render('login');
    }
});
//删除用户信息
router.delete('/deleteUser',function(req,res){
    var username = req.body.username;
    User.deleteOne(username,function(err){
        if(err!=null){
            res.redirect('./')
        }
        res.send('success');
    });
});
//根据审核状态筛选用�
router.get('/findUserByState',function(req,res){
    var state = req.query.state;
    User.findUserByState(Number(state),function(err,user){
        if(err!=null){
            res.redirect('./');
        }
        res.send(user);
    });
});
//获得全部用户信息
router.get('/findAllUser',function(req,res){
    User.getAll(function(err,user){
        if(err!=null){
            res.redirect('./');
        }
        res.send(user);
    });
});
//后台管理 项目追踪页面
router.get('/manageProTrend',function(req,res){
    var username = req.cookies.name;
    if(username){
        Project.findCheckPass(function(err,project){
            if(err!=null){
                res.redirect('./');
            }
            res.render('manageProTrend',{
                group:project
            });
        });
    }else{
        res.render('login');
    }
});
//后台管理-资金管理 给发起者发放回�
router.post('/updateBothAccount',function(req,res){
    var proid = req.body.proid,
        attendGrant = req.body.attendGrant,
        isGrant = req.body.isGrant,
        username;
    Project.findProById(proid,function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        username = project.username;
        updateUser(username,attendGrant);
    });
    //用户账户moneyAccount更新
    function updateUser(username,mny){
        User.updateAccount(username,mny,function(err){
            if(err!=null){
                res.redirect('./');
            }
            updateProjectGrant(proid);
        });
    }
    //项目资金发放状态isGrant更新
    function updateProjectGrant(proid){
        if(isGrant==0){
            updateProAccount(proid,attendGrant);
        }else{
            Project.updateGrant(proid,1,function(err){
                if(err!=null){
                    res.redirect('./');
                }
                updateProAccount(proid,attendGrant);
            });
        }
    }
    //项目账户金额proAccount更新
    function updateProAccount(proid,mny){
        Project.updateProAccount(proid,mny,function(err){
            if(err!=null){
                res.redirect('./');
            }
            res.send('success');
        });
    }
});
//后台管理-资金管理 给支持者返还支持金�
router.post('/updateSupporterAccount',function(req,res){
    var proid = req.body.proid,
        supporterArr;
    Project.findProById(proid,function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        supporterArr = project.support;
        var temp = 1,
            count = 0;
        for(var i= 0,len=supporterArr.length;i<len;i++){
            for(var g=0;count<temp;){
                if(g<1){
                    User.updateAccount(supporterArr[i].username,supporterArr[i].money,function(err){
                        if(err!=null){
                            res.redirect('./');
                        }
                        count++;
                    });
                }
                g++;
            }
            temp++;
        }
        updateProject(proid,2);
        res.send('success');
    });
    function updateProject(proid,state){
        Project.updateGrant(proid,state,function(err){
            if(err!=null){
                res.redirect('./');
            }
        });
    }
});
//后台管理-资金管理 图表更新
router.get('/updateMnyGrantData',function(req,res){
    Project.getOver(function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        var alreadyGrant = 0,
            alreadySendBack = 0,
            notGrant = 0;
        project.forEach(function(item,index,arr){
            if(item.isGrant==0){
                notGrant++;
            }else if(item.isGrant==1){
                alreadyGrant++;
            }else{
                alreadySendBack++
            }
        });
        var result = {
            alreadyGrant:alreadyGrant,
            alreadySendBack:alreadySendBack,
            notGrant:notGrant
        };
        res.send(result);
    });
});
//根据资金发放状态筛选项�
router.get('/findProByGrant',function(req,res){
    var type = req.query.type;
    Project.findProByGrant(type,function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        res.send(project);
    });
})
//项目支持order
router.post('/saveOrder',function(req, res){
    var time = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    var neworder = new Order({
        username:req.body.username,
        proId:  req.body.proId,
        money: req.body.money,
        date: time
    });

    neworder.save(function(err){
        if(err!=null){
            res.redirect('./');
        }
        res.send('success');
    })
});
//账户资金流水
router.post('/saveMoneyRecord',function(req, res){
    var time = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    var newMoney = new Money({
        username:req.body.username,
        money: req.body.money,
        date: time
    });

    newMoney.save(function(err){
        if(err!=null){
            res.redirect('./');
        }
        res.send('success');
    })
});
//后台管理-项目追踪 查看项目动�
router.get('/findProTrend',function(req,res){
    var selfid = req.query.selfid;
    Project.findProById(selfid,function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        res.send(project.proTrend);
    });
});
//后台管理-资金管理 获取项目账户金额
router.get('/getProAccount',function(req,res){
    var proid = req.query.proid;
    console.log(proid);
    Project.findProById(proid,function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        console.log(project);
        var account = {
            proAccount:project.proAccount||0,  //项目账户金额
            currentMny:project.currentMoney //已筹资金
        };
        console.log(project);
        console.log(account);
        res.send(account);
    });
});
//后台管理-项目管理 根据id获取某项目
router.get('/findProById',function(req,res){
    var proid = req.query.proid;
    Project.findProById(proid,function(err,project){
        if(err!=null){
            res.redirect('./');
        }
        res.send(project);
    });
});
module.exports = router;
