define('tab',function(){
    function Tab(cfg){
        var self = this;
            self.tabNav= cfg.tabNav||'';//tab选项卡的目录栏
            self.tabContent = cfg.tabContent||'';//tab选项卡的内容栏
            self.actClass = cfg.actClass||'';
        self._init();

    };

    Tab.prototype._init = function(){
        //获取相应节点与子元素
        var self = this,
            navList = $(self.tabNav).children(),
            contentList = $(self.tabContent).children();

        if(!navList.length||!contentList.length||navList.length!=contentList.length){
            alert("请确保导航栏和内容栏数量相等且不为空");
            return false;
        }
        //为目录栏绑定事件
        navList.on('click',function(){
            navList.eq($(this).index())
                .addClass(self.actClass)
                .siblings()
                .removeClass(self.actClass);
            contentList.eq($(this).index())
                .css('display', 'block')
                .siblings()
                .css('display', 'none');
        })
    };

    return {
        init:function(cfg){
            new Tab(cfg);
        }
    }

});