define(['jquery','uploader'], function($,WebUploader) {

    var exports  = {};

    exports.initUpload = function(options){

        var configs = {
            "type":"img",
            "uploadBtn":"#upload",
            "limit":3,
            "fileName":"img",
            "title":"img",
            "extensions":'jpg,jpeg,png',
            "mimeTypes":"image/*",
            onSuccess: function() {
                return false;   //成功的回调事件
            },
            onProgress:function(){
                return false;  //进度条
            },
            beforeFile:function(){
                return false;  //上传开始时
            },
            errorFile:function(){
                return false;
            }
        }

        $.extend(configs, options);

        var serverUrl = 'channel/';
        var uploader = WebUploader.create({

            // swf文件路径
            swf: 'Uploader.swf',

            // 文件接收服务端。
            server: serverUrl,

            // 选择文件的按钮
            pick:configs.uploadBtn,

            //chunked:true,

            // 不压缩image
            resize: false,

            fileSingleSizeLimit: configs.limit*1024 * 1024,

            fileNumLimit: 1,

            fileVal: configs.fileName,//audio

            // 只允许选择图片文件。
            accept: {
                title: configs.title,
                extensions: configs.extensions,
                mimeTypes: configs.mimeTypes
            }

        });
        //选择文件
        uploader.on('beforeFileQueued', function(file){

            configs.beforeFile(file);

        });
        uploader.on('fileQueued', function(){
            uploader.upload();
        });
        //发送进度
        uploader.on('uploadProgress', function(file, percentage){
            filec = file.id;
            configs.onProgress(percentage);
        });
        uploader.on('uploadComplete', function(file) {

        });
        //发送失败
        uploader.on('uploadError', function(file){
            configs.errorFile();
            //ant.set('isUpload', false);
           // self.imMain.errorMsg(file.name + '上传失败');

        });
        uploader.on('error', function(handler){
            //console.log(handler);
            configs.errorFile(handler);
            switch(handler){
                case 'F_EXCEED_SIZE':
                    //alert('文件大于2M，不能发送 ^_^');
                    //self.imMain.errorMsg('文件大于1M，不能发送 ^_^');
                    break;
                case 'Q_EXCEED_NUM_LIMIT':
                    //self.imMain.errorMsg('只能同时发送一份文件 ^_^');
                    break;
            }
        });

        uploader.on('uploadSuccess', function(file, res){

            uploader.removeFile(file);

            configs.onSuccess(res,file);
        });
    };

    return exports;
});
