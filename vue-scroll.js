/**
 * @file vue iscroll diretive
 * @author lakb248@gmail.com
 */
;(function () {
    var vueScroll = {};
    var iScroll = typeof require === 'function' ? require('iScroll') : window.IScroll;
    if (!iScroll) {
        throw new Error('[vue-scroll] cannot locate iscroll.js');
    }
    vueScroll.install = function () {
        Vue.directive('scroll', {
            priority: Vue.directive('on').priority,
            bind: function () {
                var that = this;
                /* globals IScroll */
                this.el.config.useTransition = false;
                vueScroll.instance = new IScroll(this.el, this.el.config);
                vueScroll.instance.on('scroll', this.el.config.onScroll);
                vueScroll.instance.on('scrollEnd', function () {
                    var result = that.el.config.onScrollEnd();
                    if (result && result.then) {
                        result.then(function () {
                            setTimeout(function () {
                                vueScroll.instance.refresh();
                            }, 300);
                        });
                    }
                });
            },
            update: function (newValue, oldValue) {
                setTimeout(() => {
                    vueScroll.instance.refresh();
                }, 300);
                // vueScroll.instance.refresh();
            },
            unbind: function () {}
        });
        Vue.directive('scroll-config', {
            priority: Vue.directive('on').priority + 1,
            update: function (config) {
                this.el.config = config;
            }
        });
    };

    if (typeof exports == "object") {
        module.exports = vueScroll;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){return vueScroll;});
    } else if (window.Vue) {
        window.VueScroll = vueScroll;
        Vue.use(vueScroll);
    }
})();
