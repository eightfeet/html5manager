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
        uploader: 'vendor/uploader/webuploader',
        parallax: 'vendor/parallax/parallax'
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

require(['avalon', 'domReady!', 'bootstrap', 'css', 'jquery','parallax'], function(avalon, domready, bs, css, $,parallax) {

    //window.UEDITOR_HOME_URL = "vendor/ueditor/";//暂时不用编辑器

    //数据请求方法
    var dataRequire = function(url, type, dataarg, callback) {
        $.ajax({
            url: url,
            type: type,
            dataType: 'json',
            data: dataarg,
            success: callback,
            error: function(data) {
                avalon.log("bad connect!");
            }
        });
    };

    //每个单页面的数据回填
    var dataFill = function(page) {
        var rootMd = avalon.vmodels.root,
            addpageMd = avalon.vmodels.addpage,
            editpageMd = avalon.vmodels.editpage;

             //当前页面全局信息
            addpageMd.pgName = rootMd.pages[page].pgName;
            addpageMd.pgAnimate = rootMd.pages[page].pgAnimate;
            addpageMd.pgBackgroundcolor = rootMd.pages[page].pgBackgroundcolor;
            addpageMd.pgBackgroundimage = rootMd.pages[page].pgBackgroundimage;
            addpageMd.pgIndex = page;
            editpageMd.layoutInfo.clear();
            editpageMd.layoutInfo = rootMd.pages[page].pgEle;
            addpageMd.elementInfo.clear();
            addpageMd.elementInfo = rootMd.pages[page].pgEle;

            //当前页面元素信息
            //editpageMd.layoutInfo.clear();
            //addpageMd.elementInfo.clear();
    };

    //离开时保存当前单页面数据
    var dataSave = function(page) {
        var rootMd = avalon.vmodels.root,
            addpageMd = avalon.vmodels.addpage,
            editpageMd = avalon.vmodels.editpage;

        //离开时当前页面信息
        var pageTemp = {
            "pgName": addpageMd.pgName,
            "pgAnimate": addpageMd.pgAnimate,
            "pgBackgroundcolor": addpageMd.pgBackgroundcolor,
            "pgBackgroundimage": addpageMd.pgBackgroundimage,
            "pgIndex": addpageMd.pgIndex,
            "pgEle": editpageMd.pgEle
        };

        //rootMd.pages[page] = {};
        //rootMd.pages[page] = pageTemp;
        rootMd.pages.set(page, pageTemp);
        avalon.log(rootMd.pages.$model)
    };

    //创建单个页面时要向pages数据中存入一个页面对象元素
    //这个对象元素包含一个单页面的所有属性，这里把值设为空
    var dataNew = function(page) {
        var rootMd = avalon.vmodels.root;
        var dataTemp = {
            "pgName": '第' + (page + 1)+'页',
            "pgAnimate": '',
            "pgBackgroundcolor": '',
            "pgBackgroundimage": '',
            "pgIndex": page,
            "pgEle": []
        };
        rootMd.pages.push(dataTemp);
    };

    //页码数
    var getPagenum = function(){
        for (var i=0,l = avalon.vmodels.root.pages.length; i < l; i++) {
            avalon.vmodels.addpage.pgNum.push({"num":i,"name":"第"+(i+1)+"页"});
        }
    };

    var msroot = avalon.define({
        $id: "root",
        webtitle: 'H5building',
        footer: '',
        header: 'modules/header/header.html', //头部模板
        addpage: 'modules/addpage/addpage.html', //添加页面模板
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
        //同时备份一份页面数据
        $pagesCopy: [],

        //当前选择页面，这个很有用以后针对对应页面做操作就是以他为索引
        selecttab: 0,


        //创建单个页面
        newpage: function() {
            //新增页面时也要保存当前页面数据
            dataSave(msroot.selecttab);
            //默认命名为“page1，page2...”，暂时不允许修改页面名
            //当页面被删除是会有重名现象需要解决，暂时放一放
            dataNew(msroot.pages.length);

            //把当前选择索引值放到最新创建的页面上
            msroot.selecttab = msroot.pages.length - 1; //index从0开始，
            //清除旧页码
            avalon.vmodels.addpage.pgNum.clear();
            //生成页码
            getPagenum();
            //重新填充新页面数据
            $('#changerpage').val(msroot.pages.length);
            dataFill(msroot.selecttab);
            $('#changerpage').val(msroot.selecttab);
        },

        //页面点击时需要做以下事情
        //保存当前页面数据
        //对下一页面填充数据
        //设置当前页的索引值
        msSelected: function($event, $index, el) {
            dataSave(msroot.selecttab);
            $('#changerpage').val($index);
            dataFill($index);
            msroot.selecttab = $index;
        }

    });
    avalon.scan();



    /*  A.$watch('a', function(v){      B.b = v        })
        B.$watch('b', function(v){      A.a = v        })*/

});
