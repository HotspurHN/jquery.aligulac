/// <reference path="../jquery-2.0.3.intellisense.js" />
/// <reference path="jquery.aligulac.config.js" />

/* jquery.aligulac core libriary.
    Usage on client:
    $.aligulacjq(); // to run plugin for each object on page
    $('jqueryselector').aligulacjq(); // to run plugin for elements with specific selectors
*/
$(document).ready(function () {
    if (window.$)
    {
        //modules construction functions
        $.aligulac = {};
        $.aligulac.extentions = {};
        $.fn.aligulac = {};
        $.fn.aligulac.extentions = {};
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
                selector += ",";
            }
        }
        return selector;
    };
        $.aligulac.selectModuleByName = function(moduleName) {
            for (var j = 0; j < $.aligulac.modules.length; j++) {
                if ($.aligulac.modules[j].moduleName === moduleName) {
                    return $.aligulac.modules[j];
                }
            }
            return {};
        };
        $.aligulac.runModule = function (params) {
            var module = $.aligulac.selectModuleByName(params.mode);
            $($.aligulac.generateAttributeSelector(params.mode)).html('<img class="aligulac-ajax-loading" src="{aligulac-ajaxLoading}" alt="ajax" />'.replace('{aligulac-ajaxLoading}', aligulacConfig.ajaxLoading));
            $.each(module.parameters, function (key, defaultValue) {
                params.parameters[key] = params.parameters[key] || defaultValue;
            });
            module.logic(params);
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
                case "Z":
                    raceName = "Zerg";
                    break;
                case "P":
                    raceName = "Protoss";
                    break;
                case "T":
                    raceName = "Terran";
                    break;
                case "R":
                    raceName = "Random";
                    break;
                case "S":
                    raceName = "Switcher";
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
                $.aligulac.modules[j].load();
            }
        };

    } else {
        console.log("jQuery not loaded.");
    }
});