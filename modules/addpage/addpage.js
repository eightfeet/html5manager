require(['avalon', 'css!vendor/uploader/webuploader.css', 'domReady!', 'upload'], function(avalon, css, domReady, upload) {

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
    var delPage = function(){
        var rootMd = avalon.vmodels.root,
            addpageMd = avalon.vmodels.addpage,
            editpageMd = avalon.vmodels.editpage;
            rootMd.pages.removeAt(rootMd.selecttab);
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
        editpageMd.layoutInfo = rootMd.pages[page].pgEle;
    };

    //创建页面
    var dataNew = function(page) {
        var rootMd = avalon.vmodels.root;
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

        //删除页面
        deletePage: function(){
            if(avalon.vmodels.root.pages.length>1){
                //删除一个页面
                delPage();
                //重新回填一个页面，这里设为第一页
                dataFill(0);
                //设置tab
                avalon.vmodels.root.selecttab=0;
            }else{
                alert('至少保留一个页面！');
            }

        }

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
