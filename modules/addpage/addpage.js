require(['avalon', 'css!vendor/uploader/webuploader.css', 'domReady!', 'upload'], function(avalon, css, domReady, upload) {

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
        test: function() {
            msroot.pages[0].pgBackgroundcolor = msaddpage.pgBackgroundcolor;
        }
    });
    avalon.scan();

    //数据对页面下拉选择专场动画初始化
    $.ajax({
        url: 'datatemp/animates.json',
        type: 'POST',
        dataType: 'json',
        data: {},
        success: function(data) {
            avalon.log("data ready!");
            avalon.log(data.body);
            //数据填充到动画
            avalon.vmodels.addpage.pgAnimates.pushArray(data.body);
        },
        error: function(data) {
            avalon.log("bad connect!");
        }
    });

});
