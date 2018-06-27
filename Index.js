/// <reference path="../../../jquery-2.2.3.js" />
/// <reference path="../../../scripts.js" />
/// <reference path="../../../Shared/helpers.js" />

//
// EsmaReport Index script
// Last Released: -
// v?
//



var pageManager = function (settings) {

    require("/scripts/shared/helpers.js?" + settings.version) // local helper
    require("/Content/js/global.function.js?" + settings.version)

    var Config = {
        Settings: { WaitingSpinnerEnabled: true },
        Containers: {},
        PageElements: {},
        Enum: {},
        Data: {},
        Url: {
            BaseUrl: '/',
            GetReport: '/'
        },

        Temp: {},
        Ajax: {
            I: function () {
                App = App || NewHelperApp();

                function NewHelperApp() {
                    var _app = {
                        blockUI: blockUI,
                        unblockUI: unblockUI
                    }

                    return _app;
                } 
            },
            HasActiveRequest: function () { return Config.Ajax.PendingReguest.Count > 0; },
            PendingReguest: { Count: 0, AddOneRequest: function () { Config.Ajax.PendingReguest.Count++; }, RemoveOneRequest: function () { Config.Ajax.PendingReguest.Count--; } }, OnBeforeSend: function () {

                if (!Config.Ajax.HasActiveRequest()) {
                    // page has request
                    App.blockUI({
                        animate: true
                    });
                }

                Config.Ajax.PendingReguest.AddOneRequest();

            }, OnAfterSend: function () {

                Config.Ajax.PendingReguest.RemoveOneRequest();

                if (!Config.Ajax.HasActiveRequest()) {
                    // page has no request
                    App.unblockUI();
                }
            }
        }
    };

    // merge user passed settings into global Settings object
    Object.assign(Config.Settings, settings)

    var Make = function () {




    }



    var functions = {
        GetReportData: function () {


            __REQUEST(Config.Url.GetReport, {}, true, "post", function () { }, Config.Ajax.OnBeforeSend, Config.Ajax.OnAfterSend)
        }
    }

    ///
    // helpers block
    var blockUI = function (options) {
        options = $.extend(true, {}, options);
        var html = '';
        if (options.animate) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
        } else if (options.iconOnly) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
        } else if (options.textOnly) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
        } else {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
        }

        if (options.target) { // element blocking
            var el = $(options.target);
            if (el.height() <= ($(window).height())) {
                options.cenrerY = true;
            }
            el.block({
                message: html,
                baseZ: options.zIndex ? options.zIndex : 1000,
                centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                css: {
                    top: '10%',
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                    opacity: options.boxed ? 0.05 : 0.1,
                    cursor: 'wait'
                }
            });
        } else { // page blocking
            $.blockUI({
                message: html,
                baseZ: options.zIndex ? options.zIndex : 1000,
                css: {
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                    opacity: options.boxed ? 0.05 : 0.1,
                    cursor: 'wait'
                }
            });
        }
    };

    // wrApper function to  un-block element(finish loading)
    var unblockUI = function (target) {
        if (target) {
            $(target).unblock({
                onUnblock: function () {
                    $(target).css('position', '');
                    $(target).css('zoom', '');
                }
            });
        } else {
            $.unblockUI();
        }
    };




    return {
        /* GLOBAL */
        Make: Make,
        Config: Config,
    };
}


