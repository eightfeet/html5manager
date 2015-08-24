/*!
 * H5master v0.7
 * author eightfeet
 * Open source https://github.com/eightfeet/html5manager.git/
 * Includes avalon，jquery&plugin(colpick)，Bootstrap，parallax，& more...
 * Copyright 2015 copyright eightfeet
 * http://eightfeet.github.io/html5master/
 * http://eightfeet.cn
 * Date: 2015-08-24
 */
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

require(['avalon', 'domReady!', 'bootstrap', 'css', 'jquery', 'parallax'], function(avalon, domready, bs, css, $, animShow) {

    //本地文件操作申请
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem; //文件系统请求标识
    window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL; //根据URL取得文件的读取权限

    //文件操作失败回调
    var errorHandler = function(e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        }

        console.log('Error: ' + msg);
    };

    //请求存储配额
    window.webkitStorageInfo.requestQuota(PERSISTENT, 5 * 1024 * 1024, function(grantedBytes) {
        window.requestFileSystem(PERSISTENT, grantedBytes, function() {}, errorHandler);
    }, function(e) {
        console.log('Error', e);
    });






    //window.UEDITOR_HOME_URL = "vendor/ueditor/";//暂时不用编辑器
    //关联页码
    //页码数
    var getPagenum = function() {
        for (var i = 0, l = avalon.vmodels.root.pages.length; i < l; i++) {
            avalon.vmodels.addpage.pgNum.push({
                "num": i,
                "name": "第" + (i + 1) + "页"
            });
        }
    };

    //页码数
    var getPagenum = function() {
        for (var i = 0, l = avalon.vmodels.root.pages.length; i < l; i++) {
            avalon.vmodels.addpage.pgNum.push({
                "num": i,
                "name": "第" + (i + 1) + "页"
            });
        }
    };

    //新建场景视图
    var newStage = function() {

        var rootMd = avalon.vmodels.root,
            addpageMd = avalon.vmodels.addpage,
            editpageMd = avalon.vmodels.editpage;

        //清空旧数据
        localStorage.pages = '';
        rootMd.pages.clear();
        data = {
            "body": [{
                "pgName": "",
                "pgAnimate": "",
                "pgBackgroundcolor": "",
                "pgBackgroundimage": "",
                "pgIndex": "0",
                "pgEle": [{
                    "elName": "元素1",
                    "elType": "text",
                    "elContent": "<a href='#' style='text-shadow:.1em .1em .1em rgba(0, 0, 0, .5) '>hellow,world!</a>",
                    "elBackgroundcolor": "#d90d25",
                    "elColor": "#fff",
                    "elZindex": "1",
                    "elSize": "2",
                    "elWidth": "35",
                    "elHeight": "",
                    "elBorderradius": "3",
                    "elLeft": "2",
                    "elTop": "10",
                    "elPadding": "2",
                    "elAlign": "center",
                    "elAnimentin": "fadeIn",
                    "elAnimentout": "balanceOut",
                    "elAnimentcount": "1",
                    "elAnimentdelaytime": "500",
                    "el.elAnimenttime": "500",
                    "elActive": false
                }]
            }],
            "errorMsg": "数据请求失败",
            "status": "0"
        };


        str = JSON.stringify(data);

        //存入本地数据库
        localStorage.pages = str;

        rootMd.pages.pushArray(data.body);

        avalon.mix(true, rootMd.$pagesCopy, data.body);

        //清除旧页码
        avalon.vmodels.addpage.pgNum.clear();
        //生成页码
        getPagenum();

        msroot.selecttab = 0;

        //当前页面全局信息
        addpageMd.pgName = rootMd.pages[rootMd.selecttab].pgName;
        addpageMd.pgAnimate = rootMd.pages[rootMd.selecttab].pgAnimate;
        addpageMd.pgBackgroundcolor = rootMd.pages[rootMd.selecttab].pgBackgroundcolor;
        addpageMd.pgBackgroundimage = rootMd.pages[rootMd.selecttab].pgBackgroundimage;
        addpageMd.pgIndex = rootMd.selecttab;

        //当前页面元素信息
        //editpageMd.layoutInfo.clear()
        //这里做两分数据，
        //一份是为左边视图绑定的，一份是为右边操作绑定的
        addpageMd.elementInfo = rootMd.pages[rootMd.selecttab].pgEle;
        editpageMd.layoutInfo = rootMd.pages[rootMd.selecttab].pgEle;
        animShow();
    };

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

    //数据存储
    var saveLocaldata = function() {
        localStorage.pages = '';
        //创建一个数据
        var data = {
            "body": [],
            "errorMsg": "数据请求失败",
            "status": "0"
        };
        //替换body的数据
        data.body = avalon.vmodels.root.pages.$model;
        //然后转换为字符串
        str = JSON.stringify(data);
        //存入本地数据库
        localStorage.pages = str;
        avalon.log(localStorage.pages);
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
            "pgName": '第' + (page + 1) + '页',
            "pgAnimate": '',
            "pgBackgroundcolor": '',
            "pgBackgroundimage": '',
            "pgIndex": page,
            "pgEle": []
        };
        rootMd.pages.push(dataTemp);
    };


    var msroot = avalon.define({
        $id: "root",
        webtitle: 'H5master',
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

        newstage: function() {
            newStage();
        },
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

            animShow();
            saveLocaldata();
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
            animShow();
            saveLocaldata();
        },
        //发布到服务器。这里需要服务器上作相应处理
        h5header: '<!doctype html>'+
                '<html lang="en">'+
                '<head>'+
                    '<meta charset="utf-8">'+
                    '<meta name="author" content="hahnzhu" />'+
                    '<meta name="format-detection" content="telephone=no" />'+
                    '<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>'+
                    '<meta name="apple-mobile-web-app-capable" content="yes" />'+
                    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />'+
                    '<title>Demo</title>'+
                    '<link rel="stylesheet" href="http://eightfeet.github.io/html5master/vendor/parallax/dist/parallax.css">'+
                    '<link rel="stylesheet" href="http://eightfeet.github.io/html5master/vendor/parallax/dist/parallax-animation.css">'+
                '</head>'+
                '<body>'+
                '<div class="wrapper">',
        h5footer: '</div>' +
            '<script src="http://eightfeet.github.io/html5master/vendor/parallax/dist/zepto.min.js"></script>'+
            '<script src="http://eightfeet.github.io/html5master/vendor/parallax/dist/parallax.js"></script>'+
            '<script>'+

                '$(".pages").parallax({ '+
                    'direction: "vertical"  , ' + // horizontal (水平翻页)
                    'swipeAnim: "cover",  ' + // cover (切换效果)
                    'drag:      true,        ' + // 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
                    'loading:   false,       ' + // 有无加载页
                    'indicator: false,       ' + // 有无指示点
                    'arrow:     false,       ' + // 有无指示箭头

               ' });'+

            '</script>'+
            '</body>'+
            '</html>',
        stagePublish: function() {
            avalon.log(msroot.h5header+$('.temporary').html() + msroot.h5footer);
        },
        //保存为Html页面,
        saveHtml: function() {


        },
        //导入pages数据
        ImportPages: function() {

        },
        //导chupages数据
        exportPages: function() {

        }

    });
    avalon.scan();

});
