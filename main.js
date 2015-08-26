/*!
 * H5master v0.7
 * @author eightfeet
 * @Open source https://github.com/eightfeet/html5manager.git/
 * @Includes avalon，jquery&plugin(colpick)，Bootstrap，parallax，& more...
 * @Copyright 2015 copyright eightfeet
 * @http://eightfeet.github.io/html5master/
 * @http://eightfeet.cn
 * @Date: 2015-08-24
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
                "pgIndex": 0,
                "pgEle": [{
                    "elName": "元素1",
                    "elType": "text",
                    "elContent": "<a href='#' style='text-shadow:.1em .1em .1em rgba(0, 0, 0, .5) '>hellow,world!</a>",
                    "elBackgroundcolor": "#d90d25",
                    "elColor": "#fff",
                    "elZindex": "1",
                    "elSize": "1",
                    "elRight": "2",
                    "elBottom": "",
                    "elBorderradius": "3",
                    "elLeft": "2",
                    "elTop": "10",
                    "elPadding": "2",
                    "elAlign": "center",
                    "elAnimentin": "fadeIn",
                    "elAnimentout": "balanceOut",
                    "elAnimentcount": "1",
                    "elAnimentdelaytime": "500",
                    "elAnimenttime": "500",
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

    //返回给html5的数据
    var  h5Data = function(){
            var rootMd = avalon.vmodels.root;
            var str = '';
            var strB = '';
            var temp=[];

            avalon.each(rootMd.pages,function(index, el) {

                str = '<section class="page" style="background-color: '+
                el.pgBackgroundcolor+
                ';background-image: url('+
                el.pgBackgroundimage+'); ">';

                temp.push(str);

                avalon.each(el.pgEle, function(indexB, elB) {

                        if(elB.elType=='img'){
                            str='<div class="viewobj" data-animation="'+
                            elB.elAnimentin+
                            '" data-delay="'+
                            elB.elAnimentdelaytime+
                            '" data-duration="'+
                            elB.elAnimenttime+
                            '" data-count="'+
                            elB.elAnimentcount+
                            '" style="'+
                            'z-index:'+
                            elB.elZindex+
                            '; background-color:'+
                            elB.elBackgroundcolor+
                            ';right:'+
                            elB.elRight+
                            'em;bottom:'+
                            elB.elBottom+
                            'em;left:'+
                            elB.elLeft+
                            'em;top:'+
                            elB.elTop+
                            'em;padding:'+
                            elB.elPadding+
                            'em;text-align:'+
                            elB.elAlign+
                            ';">';
                            temp.push(str);

                            str = '<img src="'+
                            elB.elContent+
                            '" style="border-radius:'+
                            elB.elBorderradius+'em';
                            temp.push(str);

                            str =';"/>';
                            temp.push(str);
                        }else{
                            str='<div class="viewobj" data-animation="'+
                            elB.elAnimentin+
                            '" data-delay="'+
                            elB.elAnimentdelaytime+
                            '" data-duration="'+
                            elB.elAnimenttime+
                            '" data-count="'+
                            elB.elAnimentcount+
                            '" style="background-color:'+
                            elB.elBackgroundcolor+
                            ';z-index:'+
                            elB.elZindex+
                            ';right:'+
                            elB.elRight+
                            'em;bottom:'+
                            elB.elBottom+
                            'em;border-radius:'+
                            elB.elBorderradius+
                            'em;left:'+
                            elB.elLeft+
                            'em;top:'+
                            elB.elTop+
                            'em;padding:'+
                            elB.elPadding+
                            'em;text-align:'+
                            elB.elAlign+
                            ';">';
                            temp.push(str);

                            str ='<span style="color:'+
                            elB.elColor+
                            '; font-size: '+elB.elSize+'em;">';
                            temp.push(str);

                            str =elB.elContent;
                            temp.push(str);

                            str ='</span>';
                            temp.push(str);
                        }

                    str='</div>';
                    temp.push(str);
                });

                str = '</section>';
                temp.push(str);
            });

            rootMd.html5master.h5content = temp.join('');
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

    var setH5parallax = function(){
        var rootMd = avalon.vmodels.root;
        rootMd.html5master.h5parallax = '<script src="http://eightfeet.github.io/html5master/vendor/parallax/dist/zepto.min.js"></script>'+
                '<script src="http://eightfeet.github.io/html5master/vendor/parallax/dist/parallax.js"></script>'+
                '<script>'+
                    '$(".pages").parallax({ '+
                        'direction: "'+rootMd.isdirection+'"  , ' + // horizontal (水平翻页)
                        'swipeAnim:"'+rootMd.isswipeAnim+'",  ' + // 滚动动画，"default/cover"
                        'drag:      false,        ' + // 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
                        'loading:   '+rootMd.isLoading+', ' + // 有无加载页
                        'indicator: '+rootMd.isIndicator+',       ' + // 有无指示点
                        'arrow:     '+rootMd.isArrow+',       ' + // 有无指示箭头
                   ' });'+
                '</script>';
    };
    var setH5music = function(){
        var rootMd = avalon.vmodels.root;
         rootMd.html5master.h5music = '<i class="music mon"></i>'+
                '<audio id="myaudio" src="'+rootMd.h5musicpath+'" loop autoplay preload="preload" class="hide"></audio>'+
                '<script>'+
                 '$(".music").click(function() {'+//背景音乐播放器
                        /* Act on the event */
                           ' var $t = $(this);'+
                            'if($t.hasClass("mon")){'+
                            //用户开始播放
                                '$t.removeClass("mon");'+
                                'document.getElementById("myaudio").pause();'+
                            '}else{'+
                            //用户暂停播放
                                '$t.addClass("mon");'+
                                'document.getElementById("myaudio").play();'+
                            '};'+
                    '});'+
                '</script>';
    };

    $(function() {
        $('#isLoading').change(function(){
            if($(this).prop("checked")){
                avalon.vmodels.root.isLoading='true';
            }else{
                avalon.vmodels.root.isLoading='false';
            }
        });
        $('#direction').change(function(){
            if($(this).prop("checked")){
                avalon.vmodels.root.isdirection='horizontal';
            }else{
                avalon.vmodels.root.isdirection='vertical';
            }
        });
        $('#isIndicator').change(function(){
            if($(this).prop("checked")){
                avalon.vmodels.root.isIndicator='true';
            }else{
                avalon.vmodels.root.isIndicator='false';
            }
        });
        $('#isArrow').change(function(){
            if($(this).prop("checked")){
                avalon.vmodels.root.isArrow='true';
            }else{
                avalon.vmodels.root.isArrow='false';
            }
        });
        $('#isMusic').change(function(){
            if($(this).prop("checked")){
                avalon.vmodels.root.isMusic='true';
                avalon.vmodels.root.h5musicpath='http://evt.dianping.com/5370/sounds/bg.mp3';
            }else{
                avalon.vmodels.root.isMusic='false';
                avalon.vmodels.root.h5musicpath='';
            }
        });
    });



    var msroot = avalon.define({
        $id: "root",
        webtitle: 'H5master',

        //发布设置
        isLoading:'true',
        isdirection:'vertical',//是否垂直滚动,（horizontal水平）
        isswipeAnim:'cover',// 滚动动画，"default/cover"
        isIndicator:'true',// 有无指示点
        isArrow:'true',//有无指示箭头
        isMusic:'false',//有无音乐

        h5musicpath:'',

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
        html5master:{
            h5header: '<!doctype html>'+
                    '<html lang="en">'+
                    '<head>'+
                        '<meta charset="utf-8">'+
                        '<meta name="format-detection" content="telephone=no" />'+
                        '<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>'+
                        '<meta name="apple-mobile-web-app-capable" content="yes" />'+
                        '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />'+
                        '<title>Demo</title>'+
                        '<link rel="stylesheet" href="http://eightfeet.github.io/html5master/vendor/parallax/dist/parallax.css">'+
                        '<link rel="stylesheet" href="http://eightfeet.github.io/html5master/vendor/parallax/dist/parallax-animation.css">'+
                         '<link rel="stylesheet" href="http://eightfeet.github.io/html5master/vendor/parallax/dist/custom.css">'+
                    '</head>'+
                    '<body>'+
                    '<div class="wrapper">'+
                    '<div class="pages">',
            h5music:'',
            h5parallax: '',
            h5footer:'</div></div>' +
                            '</body>'+
                            '</html>',
            h5content:''
        },


        stagePublish: function() {
            h5Data();
            setH5parallax();//配置滚动
            setH5music();//配置背景音乐

            if(msroot.isMusic=='true'){
                avalon.log(
                msroot.html5master.h5header+
                msroot.html5master.h5content+
                msroot.html5master.h5parallax+
                msroot.html5master.h5music+
                msroot.html5master.h5footer);
            }else{
                avalon.log(
                msroot.html5master.h5header+
                msroot.html5master.h5content+
                msroot.html5master.h5parallax+
                msroot.html5master.h5footer);
            }

        },
        //保存为Html页面,
        saveHtmlcontent:'',
        saveHtml: function() {
            h5Data();
            setH5parallax();//配置滚动
            setH5music();//配置背景音乐
            msroot.saveHtmlcontent='';//清空数据
            if(msroot.isMusic=='true'){
                msroot.saveHtmlcontent=msroot.html5master.h5header+
                msroot.html5master.h5content+
                msroot.html5master.h5parallax+
                msroot.html5master.h5music+
                msroot.html5master.h5footer;
            }else{
                msroot.saveHtmlcontent=msroot.html5master.h5header+
                msroot.html5master.h5content+
                msroot.html5master.h5parallax+
                msroot.html5master.h5footer;
            }
        },

        //导入pages数据
        importContent:'',
        ImportPages: function() {
            var tempData =  JSON.parse(msroot.importContent);

            var isArray = function (o) {
                return Object.prototype.toString.call(o) === '[object Array]';
            };

            var rootMd = avalon.vmodels.root,
            addpageMd = avalon.vmodels.addpage,
            editpageMd = avalon.vmodels.editpage;

            if(isArray(tempData.body)){
                var str = '';
                var data = {};

                rootMd.pages.clear();
                addpageMd.pgNum.clear();

                rootMd.pages.pushArray(tempData.body);
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

                getPagenum();

                animShow();
            }else{
                alert('数据不正确！');
            };
        },

        //导出pages数据
        exportContent:'',
        exportPages: function() {
            msroot.exportContent=localStorage.pages;
        },

        //loading
        loading:true,




    });
    avalon.scan();

});
