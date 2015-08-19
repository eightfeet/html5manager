require(['avalon', 'css!vendor/uploader/webuploader.css', 'domReady!', 'upload'], function(avalon, css, domReady, upload) {
            var rootMd = avalon.vmodels.root,
    addpageMd = avalon.vmodels.addpage,
    editpageMd = avalon.vmodels.editpage;

    //数据请求方法
    var dataRequire = function(url,type,dataarg,callback) {
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

    //删除页面方法
    var delPage = function(page){
        var rootMd = avalon.vmodels.root,
    addpageMd = avalon.vmodels.addpage,
    editpageMd = avalon.vmodels.editpage;
            rootMd.pages.removeAt(page);
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


    //创建页面
    var dataNew = function(page) {
        var rootMd = avalon.vmodels.root,
    addpageMd = avalon.vmodels.addpage,
    editpageMd = avalon.vmodels.editpage;
        var dataTemp = {
            "pgName": 'page' + (page + 1),
            "pgAnimate": '',
            "pgBackgroundcolor": '',
            "pgBackgroundimage": '',
            "pgIndex": page,
            "pgEle": []
        };
        rootMd.pages.push(dataTemp);
    };

    //创建图层元素,type代表图层是图片还是文字类型
    var newLayout =function(type){
        var rootMd = avalon.vmodels.root,
    addpageMd = avalon.vmodels.addpage,
    editpageMd = avalon.vmodels.editpage;
        var dataTemp = {
            "elName": "未标题",
            "elType": type,
            "elContent": "未定义",
            "elBackgroundcolor": "",
            "elColor": "",
           "elZindex": "",
            "elSize": "",
            "elWidth": "",
            "elHeight": "",
            "elBorderradius": "",
            "elLeft": "",
            "elTop": "",
            "elPadding": "",
            "elAlign": "center",
            "elAnimentin": "",
            "elAnimentout": "",
            "elAnimentdelaytime": "",
            "elActive" : true
        };
        avalon.log(addpageMd.elementInfo);
        addpageMd.elementInfo.unshift(dataTemp);
        editpageMd.layoutInfo.unshift(dataTemp);
        rootMd.pages[rootMd.selecttab].pgEle.unshift(dataTemp);
    };

    //上传图片
    upload.initUpload({
        "uploadBtn": "#bgUpload",
        errorFile: function() {
            console.log('上传失败！');
        }
    });


    var msaddpage = avalon.define({

        $id: "addpage",
        editpage: 'modules/editpage/editpage.html',
        pgAnimates: [], //页面动画专场方式

        //当前页面vm
        pgName: '', //页面名称
        pgAnimate: '', //页面动画
        pgBackgroundcolor: '', //页面背景色
        pgBackgroundimage: '', //页面背景图片
        pgIndex: '', //页面顺序

        //vm显示视图监控数据（页面元素）
        elementInfo: [],

        //删除页面
        deletePage: function(){
            if(avalon.vmodels.root.pages.length>1){
                //删除一个页面
                delPage(rootMd.selecttab);
                //设置tab
                rootMd.selecttab=avalon.vmodels.root.pages.length-1;
                //重新回填一个页面，这里设为第一页
                dataFill(avalon.vmodels.root.pages.length-1);
            }else{
                alert('至少保留一个页面！');
            }
        },

        //创建一个图层元素
        newLayout: function(type){
            //创建图层
            newLayout(type);
            //保存到pages
            dataSave(avalon.vmodels.root.selecttab);
            //数据回填
            dataFill(avalon.vmodels.root.selecttab);
        },

        //页码长度
        pgNum : []

    });
    avalon.scan();

    //请求数据对页面下拉选择转场动画初始化
    //这里按接口方便以后后台
    dataRequire ('datatemp/animates.json',
        'Post',{},
        function(data){
            avalon.log("data ready!");
            //数据填充到动画
            avalon.vmodels.addpage.pgAnimates.pushArray(data.body);
    });

    //填充页面全局信息数据


});
