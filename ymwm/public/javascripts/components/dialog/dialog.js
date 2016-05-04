define('dialog',function(){
    function Dialog(cfg){
        var self = this;
        self.dlgwrapper = cfg.dlgwrapper||'.jq-dialog';
        self.dlgcon = cfg.dlgcon||'.jq-dialog-con';
        self.msg = cfg.msg ||'';
        self.closeBtn = cfg.closeBtn||"[{tag:'.jq-sure-btn',callback:null},{tag:'.jq-cancel-btn',callback:null},{tag:'.jq-close-tag',callback:null}]";
        self._init();
    };

    Dialog.prototype._init = function(){
        var self = this;
        self._open();
        self._edit();
        self._close();
    };
    //show dialog
    Dialog.prototype._open = function(){
        var self = this;
        $(self.dlgwrapper).show();
    };
    //close dialog
    Dialog.prototype._close = function(){
        var self = this,
            $wrapper = $(self.dlgwrapper);
        for(var i=0,len=self.closeBtn.length;i<len;i++){
            (function savenum(num){
                (function execute(){
                    $wrapper.delegate(self.closeBtn[num].tag,'click',function(){
                        $wrapper.hide();
                        var eachcall = self.closeBtn[num].callback;
                        if(eachcall != null){
                            $wrapper.off();
                            eachcall();
                        }
                    });
                })();
            })(i);
        }
    };
    //edit dialog content
    Dialog.prototype._edit = function(){
        var self = this,
            $dlgcon = $(self.dlgcon);
        if(self.msg.length>0){
            $dlgcon.children().remove();
            var $p = $('<p>'+self.msg+'</p>');
            $dlgcon.append($p);
        }
    };
    return {
        init:function(cfg){
            new Dialog(cfg);
        }
    }
});