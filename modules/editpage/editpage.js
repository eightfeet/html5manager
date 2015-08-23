require(['avalon', 'css!vendor/uploader/webuploader.css', 'parallax', 'colpick', 'domReady!', 'upload'], function(avalon, css, animShow, colpick, dom, upload) {

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
    var saveLocaldata = function(){
        localStorage.pages='';
        //创建一个数据
        var data ={
            "body":[],
            "errorMsg": "数据请求失败",
            "status": "0"
        };
        //替换body的数据
        data.body=avalon.vmodels.root.pages.$model;
        //然后转换为字符串
        str = JSON.stringify(data);
        //存入本地数据库
        localStorage.pages = str;
        //avalon.log(localStorage.pages);
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

    //保存当前单页面数据
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


    };

    //数据回填
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

        //当前页面元素信息
        editpageMd.layoutInfo.clear();
        addpageMd.elementInfo.clear();
        addpageMd.elementInfo = rootMd.pages[rootMd.selecttab].pgEle;
        editpageMd.layoutInfo = rootMd.pages[rootMd.selecttab].pgEle;

        animShow();
    };

    //删除图层方法
    var delPage = function($index) {
        var rootMd = avalon.vmodels.root,
            addpageMd = avalon.vmodels.addpage,
            editpageMd = avalon.vmodels.editpage;
        rootMd.pages[rootMd.selecttab].pgEle.removeAt($index);
        editpageMd.layoutInfo.removeAt($index);
        addpageMd.elementInfo.removeAt($index);
    };


    //upload.initUpload();


    //设置编辑页面元素的模块
    avalon.define({
        $id: 'editpage',
        editpage: 'modules/editpage/editpage.html',

        //创建元素时设置元素是图片(true)还是文字(false)
        picOrtext: true,
        layoutInfo: [],
        //当dom准备就绪才初始化上传图片和色彩操作的控件
        repeatReady: function() {
            //操作颜色
            $('.selectcolor').colpick({
                flat: false,
                layout: 'hex',
                onSubmit: function(hsb, hex, rgb, el) {
                    $(el).css('background-color', '#' + hex);
                    $(el).colpickHide();
                    $(el).next('input').val('#' + hex);
                }
            });
            $('.imgUpload').html('上传图片');
            //绑定事件
            $('.changeAnimate').change(function() {
                //保存当前页面信息
                animShow();
            });
            //上传图片
            upload.initUpload({
                "uploadBtn": ".imgUpload",
                errorFile: function() {
                    console.log('上传失败！');
                }
            });



            /*$('.fileupload').change(function() {
                $(this).css("background-color","#FFFFCC");

                var fileurl = $(this).val();
                readFile(fileurl);
            });*/


            $('.fileupload').on('change', readFile);
        },
        elActiveevent: function($event, el) {
            if (el.elActive) {
                el.elActive = false;
            } else {
                el.elActive = true;
            }
        },
        deleteLayout: function($index, el) {
            //删除图层
            delPage($index);

            //保存到pages
            dataSave(avalon.vmodels.root.selecttab);
            //数据回填
            dataFill(avalon.vmodels.root.selecttab);
            //切记播放所有动画，否则出现元素被隐藏

            saveLocaldata();

        },
        delBgcolor: function($index, el) {
            el.elBackgroundcolor = "";
        },
        delColor: function($index, el) {
            el.elColor = "";
        }
    });

    avalon.scan();
    //我们在这里处理图片上传，base64保存
    function readFile() {
        var file = this.files[0];
        var hideEle = $(this).next('input');
        //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
        if (!/image\/\w+/.test(file.type)) {
            alert("请确保文件为图像类型");
            return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            hideEle.val(this.result);
        };
    }


    //首次对数据创建存储和填充
    var dataManage = function() {
        var str = '';
        var data = {};

        var rootMd = avalon.vmodels.root,
            addpageMd = avalon.vmodels.addpage,
            editpageMd = avalon.vmodels.editpage;

        if (!localStorage.pages) {
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
                        "elContent": "未定义",
                        "elBackgroundcolor": "",
                        "elColor": "",
                        "elZindex": "1",
                        "elSize": "1.2",
                        "elWidth": "5",
                        "elHeight": "",
                        "elBorderradius": "3",
                        "elLeft": "0",
                        "elTop": "0",
                        "elPadding": "0",
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
        } else {
            //读取
            str = localStorage.pages;
            //重新转换为对象
            data = JSON.parse(str);

            rootMd.pages.pushArray(data.body);
            avalon.mix(true, rootMd.$pagesCopy, data.body);

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
        }
    };


    dataManage();


    /*
        //为了保证所有avalon modules完全准备我们选择在此请求页面数据
        dataRequire('datatemp/pages.json',
            'Post', {},
            function(data) {
                avalon.log("data ready!");
                //初始数据填充
                //这里把数据进行三次填充

                //首先是对rootmodule中的pages进行一次完整填充
                //深度拷贝一份数据备份
                //然后对addpagemodule中的当前页面全局信息进行填充
                //最后对editpagemodule中的当前页面图层信息填充
                var rootMd = avalon.vmodels.root,
                    addpageMd = avalon.vmodels.addpage,
                    editpageMd = avalon.vmodels.editpage;

                rootMd.pages.pushArray(data.body);
                avalon.mix(true, rootMd.$pagesCopy, data.body);

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

            });

        */
    avalon.scan();

});
