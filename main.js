require.config({ //第一块，配置
    baseUrl: '',
    paths: {
        jquery: 'vendor/jquery/jquery-2.1.1',
        avalon: 'vendor/avalon/avalon',
        text: 'vendor/require/text',
        domReady: 'vendor/require/domReady',
        css: 'vendor/require/css',
        bootstrap: 'vendor/bootstrap/js/bootstrap.min',
        header: 'modules/header/header',
        colpick: 'vendor/require/colpick',
        //百度编辑器
        editor: 'vendor/ueditor/ueditor.all',
        editor_cfg: 'vendor/ueditor/ueditor.config',
        zh_cn: 'vendor/ueditor/lang/zh-cn/zh-cn',
        upload: 'vendor/uploader/upload',
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
            deps: ['editor', 'editor_cfg']
        },
        uploader: {
            dpes: ['jquery']
        }
    }
});

require(['avalon', 'domReady!', 'bootstrap', 'css', 'jquery'], function(avalon, domready, bs, css, $) {

    //window.UEDITOR_HOME_URL = "vendor/ueditor/";//暂时不用编辑器

    var msroot = avalon.define({
        $id: "root",
        webtitle: 'H5building',
        footer: '',
        header: 'modules/header/header.html', //头部模板
        addpage: 'modules/addpage/addpage.html', //添加页面模板
        editpage: 'modules/editpage/editpage.html', //编辑页面模板
        nav: [{
            url: '#',
            name: '首页'
        }, {
            url: '#',
            name: '介绍'
        }, {
            url: '#',
            name: '其他'
        }],

        //这里声明一个存放所有页面的数据
        pages: [],

        //当前选择页面，这个很有用以后针对对应页面做操作就是以他为索引
        selecttab: 0,

        //页面vm
        pgName: '', //页面名称
        pgAnimate: '', //页面动画
        pgBackgroundcolor: '', //页面背景色
        pgBackgroundimage: '', //页面背景图片
        pgIndex: '', //页面顺序
        pgEle: [], //页面图层


        //创建单个页面
        newpage: function() {
            msroot.pages.push({
                //默认命名为“page1，page2...”，暂时不允许修改页面名
                //当页面被删除是会有重名现象需要解决，暂时放一放
                'pgName': 'page' + (msroot.pages.length + 1)
            });

            //把当前选择索引值放到最新创建的页面上
            msroot.selecttab = msroot.pages.length - 1; //index从0开始，
        },

        //设置当前页的索引值
        msSelected: function($event, $index, el) {
            msroot.selecttab = $index;
        }

    });
    avalon.scan();

    //数据请求与填充
    $.ajax({
        url: 'datatemp/pages.json',
        type: 'POST',
        dataType: 'json',
        data: {},
        success: function(data) {
            avalon.log("data ready!");

            //数据填充到pages
            msroot.pages.pushArray(data.body);
            var page = msroot.pages[msroot.selecttab];
            msroot.pgName=page.pgName;
            msroot.pgAnimate=page.pgAnimate;
            msroot.pgBackgroundcolor=page.pgBackgroundcolor;
            msroot.pgBackgroundimage=page.pgBackgroundimage;
            msroot.pgIndex=page.pgIndex;
            msroot.pgEle=page.pgEle;
        },
        error: function(data) {
            avalon.log("bad connect!");
        }
    });

/*    A.$watch('a', function(v){      B.b = v        })
    B.$watch('b', function(v){      A.a = v        })*/

});
