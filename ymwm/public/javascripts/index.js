requirejs.config({
    baseUrl:'javascripts',
    paths: {
        "jquery":'jquery-2.2.1.min'
    }
});
requirejs(['jquery','tab'],function($,tab){
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

    //ͼƬ�õƲ���
    var index = $(".img_list li").children($(this)).index();
    var index = $(".img_list li").children($(this)).index();
    function switchPhoto(flag){
        $(".img_list li").css("display","none");
        if (!flag) {
            index++;
            if (index > 2) {index = 0}
        }else {
            index--;
            if (index < 0) {index = 2}
        }
        $(".img_list li").eq(index).css("display","block");
    }
    //�Զ�����bannerͼ
    function autoPlay(){
        focus=setInterval(function(){
            switchPhoto(false);},2000);
    }
    autoPlay();

    function stopPlay(){
        clearInterval(focus);
    }
    $('.img_list img').on('mouseover',stopPlay());
    $('.img_list li').on('mouseout',autoPlay());


    //�½���Ŀ
    function createPro(npro){
        var progress = Math.round(npro.currentMoney/npro.goalMoney*100)+ "%";
        var img3src ="images\\" + npro.img[0];
        //������Ŀ�ڵ�
        var item = $('<li class="item"></li>'),
            itemLink = $(' <a class="item-link" href="javascript:void(0)" target="_blank"></a>');
        var otherInfo = $('<div class="other-info"></div>'),
            itemInfo = $('<div class="item-info"></div>'),
            title = $('<p class="title">'+npro.proName+'</p>');
        var support = $('<div class="every-info info-support"><p class="info-name">֧������</p></div>'),
            dollar  = $('<div class="every-info info-dollar"><p class="info-name">�ѳ���</p></div>'),
            deal    = $('<div class="every-info info-dollar"><p class="info-name">�����</p></div>');
        support.append('<p class="info-num">'+npro.supportNum+'</p>');
        dollar.append('<p class="info-num">'+npro.currentMoney+'</p>');
        deal.append('<p class="info-num">'+progress+'</p>');
        otherInfo.append(deal).append(dollar).append(support);
        itemInfo.append(title).append(otherInfo);
        itemLink.append('<img src="'+img3src+'">').append(itemInfo);
        item.append(itemLink);
        $('#hot_list').append(item);

    }

    initPage();
    function initPage(){
        //��ȡ������Ŀ
        $.ajax({
            type: "get",
            url: "/getprolist",
            success: function(data) {
                projects = data;
                var proNum = data.length;
                for(var i = 0;i<proNum;i++){
                    createPro(data[i]);

                }
                goDetail(data);

            },
            error: function(data) {
                alert("ʧ��");
            }
        });


    }
    function goDetail(data){
        $("#hot_list li").click(function(){
            index = $(this).index();
            project =data[index-1];
            window.open("detail").focus();
        })
    }
    //tabѡ�
    var cfg = {
        tabNav:'.typeNav',//tabѡ���Ŀ¼��
        tabContent:'.typeCon',//tabѡ���������
        actClass:'active'
    }
    tab.init(cfg);
})