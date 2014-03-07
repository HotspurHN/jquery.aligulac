/// <reference path="../jquery-2.0.3.intellisense.js" />
/// <reference path="jquery.aligulac.config.js" />

/* jquery.aligulac core libriary.
    Usage on client:
    $.aligulacjq(); // to run plugin for each object on page
    $('jqueryselector').aligulacjq(); // to run plugin for elements with specific selectors
*/
$(document).ready(function () {
    if (window.$) {
        //modules construction functions
        $.aligulac = {};
        $.aligulac.extensions = {};
        $.fn.aligulac = {};
        $.fn.aligulac.extensions = {};
        $.aligulac.modules = [];
        $.aligulac.registerModule = function (moduleObject) {
            $.aligulac.modules.push(moduleObject);
        };
        $.aligulac.generateAttributeSelector = function (moduleName) {
            var selector = '';
            var module = $.aligulac.selectModuleByName(moduleName);
            for (var i = 0; i < module.aliasesAttribute.length; i++) {
                selector += '[' + module.aliasesAttribute[i] + ']';
                if (i !== module.aliasesAttribute.length - 1) {
                    selector += ',';
                }
            }
            return selector;
        };
        $.aligulac.selectModuleByName = function (moduleName) {
            for (var j = 0; j < $.aligulac.modules.length; j++) {
                if ($.aligulac.modules[j].moduleName === moduleName) {
                    return $.aligulac.modules[j];
                }
            }
            return {};
        };
        $.aligulac.runModule = function (params) {
            params.deferred = $.Deferred();
            var module = $.aligulac.selectModuleByName(params.mode);

            $.each(module.parameters, function (key, defaultValue) {
                params.parameters[key] = params.parameters[key] || defaultValue;
            });

            $($.aligulac.generateAttributeSelector(params.mode)).each(function () {
                if ($(this).selectValuableAttribute($.aligulac.selectModuleByName(params.mode).aliasesAttribute) === params.compareParams()) {
                        $(this).html($.aligulac.getCachedDOM($.aligulac.getModuleKey(params)));
                    }
                });


            $.when(module.logic(params)).then(function (res) {
                if (res) {
                    $.aligulac.saveCachedDOM($.aligulac.getModuleKey(params), res.result);
                    $($.aligulac.generateAttributeSelector(params.mode)).each(function () {
                        if ($(this).selectValuableAttribute($.aligulac.selectModuleByName(params.mode).aliasesAttribute) === params.compareParams()) {
                            $(this).html(res.result);
                        }
                    });
                }
            });
        };
        $.fn.selectValuableAttribute = function (aliases) {
            for (var i = 0; i < aliases.length; i++) {
                if ($(this).attr(aliases[i])) {
                    return $(this).attr(aliases[i]);
                }
            }
            return '';
        };

        //helpers
        Math.percentToNumber = function (number) {
            return Math.round(number * 10000) / 100;
        };
        $.aligulac.getFullRaceName = function (raceSymbol) {
            var raceName = '';
            switch (raceSymbol) {
                case 'Z':
                    raceName = 'Zerg';
                    break;
                case 'P':
                    raceName = 'Protoss';
                    break;
                case 'T':
                    raceName = 'Terran';
                    break;
                case 'R':
                    raceName = 'Random';
                    break;
                case 'S':
                    raceName = 'Switcher';
                    break;
            }
            return raceName;
        };

        //client functions
        $.fn.aligulacjq = function (params) {
            params.selector = this;
            $.aligulac.runModule(params);
        };
        $.aligulacjq = function () {
            for (var j = 0; j < $.aligulac.modules.length; j++) {
                $($.aligulac.generateAttributeSelector($.aligulac.modules[j].moduleName))
                    .each(function() {
                        $.aligulac.modules[j].load($(this));
                    });
            }
        };

        $.aligulac.getCachedDOM = function (key) {
            if ((typeof (Storage) !== 'undefined') && (localStorage[key])) {
                return localStorage.getItem(key);
            } else {
                return '<img class="aligulac-ajax-loading" src="{aligulac-ajaxLoading}" alt="ajax" />'
                    .replace('{aligulac-ajaxLoading}', aligulacConfig.ajaxLoading);
            }
        };
        $.aligulac.saveCachedDOM = function (key, DOM) {
            if (typeof (Storage) !== 'undefined') {
                localStorage.setItem(key, DOM);
            }
        };
        $.aligulac.getModuleKey = function (params) {
            var key = '';
            var keys = Object.keys(params);
            var keysparameters = Object.keys(params.parameters);
            var paramsLength = keys.length;
            var parameterssLength = keysparameters.length;
            for (var i = 0; i < paramsLength; i++) {
                key += keys[i] + params[keys[i]];
            }
            for (var j = 0; j < parameterssLength; j++) {
                key += keysparameters[j] + params.parameters[keysparameters[j]];
            }
            return key;
        };


    } else {
        console.log('jQuery not loaded.');
    }
});