/*require(['colpick'], function() {
$('.selectcolor').colpick({
            flat:false,
            layout:'hex',
            onSubmit:function(hsb,hex,rgb,el) {
                $(el).css('background-color', '#'+hex);
                $(el).colpickHide();
            }
        });
});
*/

require(['avalon', 'domReady!'], function() {
        avalon.define({
                $id: "addpage",
                editpage:'modules/editpage/editpage.html'

            });
        avalon.scan();
});
