/// <reference path="../jquery-2.0.3.intellisense.js" />
/// <reference path="jquery.aligulac.config.js" />
/// <reference path="jquery.aligulac.markup.js" />

$.fn.aligulacjq = function (params) {
	var domElement = this;
	params.selector = domElement;
	if (params.mode == null) {
		console.log('Aligulac plugin: Critical error! Mode isn\'t specified!');
	}

	$.aligulac.runModule(params);
};

$.aligulacjq = function () {
	for (var j = 0; j < modules.length; j++) {
		modules[j].load();
	}
};