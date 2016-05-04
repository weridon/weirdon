define('tab',function(){
    function Tab(cfg){
        var self = this;
            self.tabNav= cfg.tabNav||'';//tabѡ���Ŀ¼��
            self.tabContent = cfg.tabContent||'';//tabѡ���������
            self.actClass = cfg.actClass||'';
        self._init();

    };

    Tab.prototype._init = function(){
        //��ȡ��Ӧ�ڵ�����Ԫ��
        var self = this,
            navList = $(self.tabNav).children(),
            contentList = $(self.tabContent).children();

        if(!navList.length||!contentList.length||navList.length!=contentList.length){
            alert("��ȷ������������������������Ҳ�Ϊ��");
            return false;
        }
        //ΪĿ¼�����¼�
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