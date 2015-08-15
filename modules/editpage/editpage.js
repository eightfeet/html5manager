require(['avalon','css!vendor/uploader/webuploader.css','colpick','domReady!' ,'upload'], function(avalon,css,colpick , dom ,upload) {

    console.log(arguments);


    upload.initUpload({
        errorFile:function(){
            console.log('上传失败！');
        }
    });


    //操作颜色
    $('.selectcolor').colpick({
        flat: false,
        layout: 'hex',
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).css('background-color', '#' + hex);
            $(el).colpickHide();
        }
    });

    //upload.initUpload();


    //设置编辑页面元素的模块
    avalon.define({
            $id: 'editpage',
            editpage: 'modules/editpage/editpage.html',

            //创建元素时设置元素是图片(true)还是文字(false)
            picOrtext: true
        });
        avalon.scan();

});
