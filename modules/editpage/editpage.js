require(['avalon', 'css!vendor/uploader/webuploader.css', 'colpick', 'domReady!', 'upload'], function(avalon, css, colpick, dom, upload) {


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




    //upload.initUpload();


    //设置编辑页面元素的模块
    avalon.define({
        $id: 'editpage',
        editpage: 'modules/editpage/editpage.html',

        //创建元素时设置元素是图片(true)还是文字(false)
        picOrtext: true,
        layoutInfo: [],
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
            //上传图片
            upload.initUpload({
                "uploadBtn":".imgUpload",
                errorFile: function() {
                    console.log('上传失败！');
                }
            });
        }
    });

    avalon.scan();

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

        });
    avalon.scan();

});
