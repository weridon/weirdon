requirejs.config({
    baseUrl:'javascripts',
    paths: {
        "jquery":'jquery-2.2.1.min'
    }
});
requirejs(['jquery','tab'],function($,tab){
    var cfg = {
        tabNav:'.nav',//tabѡ���Ŀ¼��
        tabContent:'.con',//tabѡ���������
        actClass:'active'
    }
    tab.init(cfg);
})