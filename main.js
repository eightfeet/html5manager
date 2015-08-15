
require.config({ //第一块，配置
    baseUrl: '',
    paths: {
        jquery: 'vendor/jquery/jquery-2.1.1',
        avalon: "vendor/avalon/avalon",
        text: 'vendor/require/text',
        domReady: 'vendor/require/domReady',
        css: 'vendor/require/css',
        bootstrap: 'vendor/bootstrap/js/bootstrap.min',
        header:'modules/header/header',
        colpick:'vendor/require/colpick',
        //百度编辑器
        editor: 'vendor/ueditor/ueditor.all',
        editor_cfg: 'vendor/ueditor/ueditor.config',
        zh_cn: 'vendor/ueditor/lang/zh-cn/zh-cn',
        upload:'vendor/uploader/upload',
        //百度上传
        uploader: 'vendor/uploader/webuploader'
    },
    priority: ['text', 'css'],
    shim: {
        jquery: {
            exports: "jQuery"
        },
        avalon: {
            exports: "avalon"
        },
        editor: {
            exportsx: 'UE'
        },
        editor_cfg: {
            exports: 'UEDITOR_CONFIG'
        },
        zh_cn: {
            deps:['editor','editor_cfg']
        },
        uploader: {
            dpes: ['jquery']
        }
    }
});

require(['avalon', 'domReady!',  'bootstrap', 'css'], function() {
        //window.UEDITOR_HOME_URL = "vendor/ueditor/";
       var msroot = avalon.define({
                $id: "root",
                webtitle: 'H5building',
                footer:'',
                header:'modules/header/header.html',//头部
                addpage:'modules/addpage/addpage.html',//添加页面模板
                nav:[{
                    url:'#',
                    name:'首页'
                },{
                    url:'#',
                    name:'介绍'
                },{
                    url:'#',
                    name:'其他'
                }],
                pages:[],
                newpage:function(){
                    msroot.pages.pushArray({
                    'name':'page'+msroot.pages.length+1
                });
                }
            });
        avalon.scan();
});
