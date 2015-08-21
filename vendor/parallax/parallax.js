/**
 * @author  : hahnzhu
 * @version : 0.2.2
 * @date    : 2014-09-28
 * @repository: https://github.com/hahnzhu/parallax.js
 */

define(["jquery"], function($) {

    // 当前页动画显示
    // ==============================
    function animShow() {
        $('.page [set-animation]').each(function(index, element) {
            var $element = $(element),
                $animation = $element.attr('set-animation'),
                $duration = $element.attr('set-duration') || 500,
                $timfunc = $element.attr('set-timing-function') || 'ease',
                $delay = $element.attr('set-delay') ? $element.attr('set-delay') : 0;

            $element.css({
                //              '-webkit-animation': $animation +' '+ $duration + 'ms ' + $timfunc + ' '+ $delay + 'ms both',

                'display': 'block',

                // 为了兼容不支持贝塞尔曲线的动画，需要拆开写
                // 严格模式下不允许出现两个同名属性，所以不得已去掉 'use strict'
                '-webkit-animation-name': $animation,
                '-webkit-animation-duration': $duration + 'ms',
                '-webkit-animation-timing-function': 'ease',
                '-webkit-animation-timing-function': $timfunc,
                '-webkit-animation-delay': $delay + 'ms',
                '-webkit-animation-fill-mode': 'both'
            })
        });
    }

    return animShow;


});
