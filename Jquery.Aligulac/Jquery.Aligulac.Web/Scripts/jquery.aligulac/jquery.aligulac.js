/// <reference path="../jquery-2.0.3.intellisense.js" />
/// <reference path="jquery.aligulac.config.js" />
var modules = [];

$.aligulac = {};

$.aligulac.registerModule = function (moduleObject) {
	modules.push(moduleObject);
};
Math.percentToNumber = function (number) {
	return Math.round(number * 10000) / 100;
};

function getFullRaceName(raceSymbol) {
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
}

$.fn.selectValuableAttribute = function (aliases) {
	for (var i = 0; i < aliases.length; i++) {
		if ($(this).attr(aliases[i]) != null) {
			return $(this).attr(aliases[i]);
		}
	}
	return '';
};


$.aligulac.generateAttributeSelector = function (moduleName) {
	var selector = '';
	var module = selectModuleByName(moduleName);
	for (var i = 0; i < module.aliasesAttribute.length; i++) {
		selector += '[' + module.aliasesAttribute[i] + ']';
		if (i != module.aliasesAttribute.length - 1) {
			selector += ",";
		}
	}
	return selector;
};

$.aligulac.runModule = function (params) {
	var module = selectModuleByName(params.mode);
	params.selector.html('<img class="aligulac-ajax-loading" src="' + aligulacConfig.ajaxLoading + '" alt="ajax" />');
	$.each(module.parameters, function (key, defaultValue) {
		if (params.parameters[key] == null) {
			params.parameters[key] = defaultValue;
		}
	});
	console.log(module.moduleName + " run");
	module.logic(params);
};

function selectModuleByName(moduleName) {
	for (var j = 0; j < modules.length; j++) {
		if (modules[j].moduleName == moduleName) {
			return modules[j];
		}
	}
	return {};
}
$.fn.aligulacjq = function (params) {
	params.selector = this;
	$.aligulac.runModule(params);
};

$.aligulacjq = function () {
	for (var j = 0; j < modules.length; j++) {
		modules[j].load();
		console.log(modules[j].moduleName + " loaded");
	}
};