requirejs.config({
    baseUrl:'javascripts',
    paths: {
        "jquery":'jquery-2.2.1.min'
    }
});
requirejs(['jquery','tab'],function($,tab){
    var cfg = {
        tabNav:'.nav',//tab选项卡的目录栏
        tabContent:'.con',//tab选项卡的内容栏
        actClass:'active'
    }
    tab.init(cfg);
})