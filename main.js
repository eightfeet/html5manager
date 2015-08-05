
require.config({ //第一块，配置
    baseUrl: '',
    paths: {
        jquery: 'vendor/jquery/jquery-2.1.1',
        avalon: "vendor/avalon/avalon",
        text: 'vendor/require/text',
        domReady: 'vendor/require/domReady',
        css: 'vendor/require/css',
        bootstrap: 'vendor/bootstrap/js/bootstrap.min',
        header:'modules/header/header',
        colpick:'vendor/require/colpick'
    },
    priority: ['text', 'css'],
    shim: {
        jquery: {
            exports: "jQuery"
        },
        avalon: {
            exports: "avalon"
        },
        bootstrap: {
            exports: "jQuery"
        },
        colpick: {
            exports: "jQuery"
        }
    }
});

require(['avalon', 'domReady!',  'bootstrap', 'css'], function() {

        avalon.define({
                $id: "root",
                webtitle: 'H5building',
                footer:'',
                header:'modules/header/header.html',
                addpage:'modules/addpage/addpage.html',
                nav:[{
                    url:'#',
                    name:'首页'
                },{
                    url:'#',
                    name:'介绍'
                },{
                    url:'#',
                    name:'其他'
                }]
            });
        avalon.scan();
});
