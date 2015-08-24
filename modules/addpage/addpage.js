require(['avalon', 'css!vendor/uploader/webuploader.css', 'parallax', 'domReady!', 'upload'], function(avalon, css, animShow, domReady, upload) {
    var rootMd = avalon.vmodels.root,
        addpageMd = avalon.vmodels.addpage,
        editpageMd = avalon.vmodels.editpage;

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
        avalon.log(localStorage.pages);
    };

    //删除页面方法
    var delPage = function(page) {
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
        animShow();
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
    var newLayout = function(type) {
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
            "elRight": "25",
            "elBottom": "",
            "elBorderradius": "",
            "elLeft": "",
            "elTop": "",
            "elPadding": "",
            "elAlign": "center",
            "elAnimentin": "",
            "elAnimentout": "",
            "elAnimentcount":"1",
            "elAnimentdelaytime": "0",
            "elAnimenttime": "500",
            "elActive": true
        };
        avalon.log(addpageMd.elementInfo);
        addpageMd.elementInfo.unshift(dataTemp);
        editpageMd.layoutInfo.unshift(dataTemp);
        rootMd.pages[rootMd.selecttab].pgEle.unshift(dataTemp);
    };

    //页码数
    var getPagenum = function() {
        var rootMd = avalon.vmodels.root,
            addpageMd = avalon.vmodels.addpage,
            editpageMd = avalon.vmodels.editpage;
        //根据pages的索引值生成新页码
        for (var i = 0, l = rootMd.pages.length; i < l; i++) {
            rootMd.pages[i].pgName = "第" + (i + 1) + "页";
            avalon.vmodels.addpage.pgNum.push({
                "num": i,
                "name": "第" + (i + 1) + "页"
            });
        }
    };

    //上传图片
    upload.initUpload({
        "uploadBtn": "#bgUpload",
        errorFile: function() {
            console.log('上传失败！');
        }
    });

    //
/*    Object.prototype.toString = function() {
        var str = '';
        for (var item in this) {
            str += item + ":" + this[item] + ",";
        }
        return str.length ? str.substr(0, str.length - 1) : str;
    };*/





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

        delPgbgcolor:function(){
            msaddpage.pgBackgroundcolor="";
        },

        delPgbackgroundimage:function(){
            msaddpage.pgBackgroundimage="";
        },

        //删除页面
        deletePage: function() {
            if (avalon.vmodels.root.pages.length > 1) {
                //删除一个页面
                delPage(rootMd.selecttab);
                //设置tab
                rootMd.selecttab = avalon.vmodels.root.pages.length - 1;
                //重新回填一个页面，这里设为第一页
                dataFill(avalon.vmodels.root.pages.length - 1);
                //切记播放所有动画，否则出现元素被隐藏
                animShow();
                //存储本地数据
                saveLocaldata();
            } else {
                alert('至少保留一个页面！');
            }
        },

        //创建一个图层元素
        newLayout: function(type) {
            //创建图层
            newLayout(type);
            //保存到pages
            dataSave(avalon.vmodels.root.selecttab);
            //数据回填
            dataFill(avalon.vmodels.root.selecttab);
            //切记播放所有动画，否则出现元素被隐藏
            animShow();
            //存储本地数据
            saveLocaldata();
        },

        //页码长度
        pgNum: [],

        //页面元素被选择的时候
        selectedElement: function($index,el){
            avalon.each(avalon.vmodels.editpage.layoutInfo, function(ind, ele) {
                 if($index==ind){
                    ele.elActive=true;
                 }else{
                    ele.elActive=false;
                 }
            });

        }

    });




    avalon.scan();

    $(document).ready(function() {

        //首次运行页面动画


        //调整页面
        var oldValue = null,
            value = null;

        $('#changerpage').click(function() {
            oldValue = $(this).val();
            dataSave(oldValue);
        }).change(function() {
            value = $(this).val();

            var rootMd = avalon.vmodels.root,
                addpageMd = avalon.vmodels.addpage,
                editpageMd = avalon.vmodels.editpage;

            rootMd.pages[parseInt(oldValue)].pgIndex = value;
            //rootMd.pages[parseInt(oldValue)].pgName = '第'+(parseInt(oldValue)+1)+'页';
            rootMd.pages[parseInt(value)].pgIndex = oldValue;
            //rootMd.pages[parseInt(value)].pgName =  '第'+(parseInt(value)+1)+'页';
            //对pages进行排序
            rootMd.pages.sort(function(a, b) {
                return a.pgIndex - b.pgIndex;
            });
            //保存当前页面信息
            dataSave(value);
            //重新回填
            dataFill(value);
            //切记播放所有动画，否则出现元素被隐藏
            animShow();
            //设置索引值
            rootMd.selecttab = value;
            //存储本地数据
            saveLocaldata();
        });

    });

/*
    //请求数据对页面下拉选择转场动画初始化
    //这里按接口方便以后后台
    dataRequire('datatemp/animates.json',
        'Post', {},
        function(data) {
            avalon.log("data ready!");
            //数据填充到动画
            avalon.vmodels.addpage.pgAnimates.pushArray(data.body);
        });

    //填充页面全局信息数据*/


});
