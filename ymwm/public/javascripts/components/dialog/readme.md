#dialog插件使用
## html
`<div class="jq-dialog">
    <div class="jq-dialog-inner">
        <div class="jq-close-tag fr">
            <span class="glyphicon glyphicon-remove"></span>
        </div>
        <div class="jq-dialog-con"></div>
        <div class="jq-btn-group">
            <a class="jq-sure-btn" href="javascript:;">确定</a>
            <a class="jq-cancel-btn" href="javascript:;">取消</a>
        </div>
    </div>
</div>`
或直接引用模板 views/dialog.ejs

##scss
scss/_dialog.scss

##javascript配置
`
var cfg = {
    dlgwrapper:'',         //最外层div，可不配置，默认为'.jq-dialog'
    dlgcon:'',            //承载要显示信息的容器，可不配置，默认为'.jq-dialog-con'
    msg:'blabla',         //要显示的信息
    closeBtn:[            //关闭弹窗的按钮数组，格式必须为[{tag:'',callback:function(){}},{tag:'',callback:null}]。可不配置,默认为[{tag:'.jq-sure-btn',callback:null},{tag:'.jq-cancel-btn',callback:null},{tag:'.jq-close-tag',callback:null}]
        {
            tag:'.jq-sure-btn',
            callback:function(){
                conosle.log('hello');
            }
        }, {
            tag:'.jq-cancel-btn',
            callback:null
        },{
            tag:'.jq-close-tag',
            callback:null
        }
    ]
};
dialog.init(cfg);
`

created by liyan
2016-04-05
