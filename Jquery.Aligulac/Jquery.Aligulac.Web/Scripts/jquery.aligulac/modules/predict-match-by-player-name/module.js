// description: module for jquery.aligulac. requires module player-link-by-id, player-link-by-name, predict-match-by-player-name
// used for display player info by name.
// parameters:
// bo - count of games default 3
// player1name - reqired. player name
// player2name - reqired. player name

// module initialization
var alogulac_predict_match_by_player_name_module_name = "predict-match-by-player-name";
$.aligulac.registerModule(
	{
		moduleName: alogulac_predict_match_by_player_name_module_name,
		moduleKey: alogulac_predict_match_by_player_name_module_name,
		aliasesAttribute: ["data-apmn", "data-aligulac-predict-match-by-name"],
		parameters: [{
			bo: 3
		}],
		logic: function(params) {
			$.aligulac.getPredictMatchByNames(params);
		},
		load: function() {
			var pmparams = $($.aligulac.generateAttributeSelector(alogulac_predict_match_by_player_name_module_name))
				.selectValuableAttribute(selectModuleByName(alogulac_predict_match_by_player_name_module_name).aliasesAttribute)
				.split(',');
			$.aligulac.runModule({
				mode: alogulac_predict_match_by_player_name_module_name,
				selector: $($.aligulac.generateAttributeSelector(alogulac_predict_match_by_player_name_module_name)),
				parameters: {
					player1name: pmparams[0],
					player2name: pmparams[1],
					bo: pmparams[2]
				}
			});
		}
	});
//module realization
$.aligulac.getPredictMatchByNames = function (params) {
	var domElement = params.selector;
	$.ajax({
		type: "GET",
		url: aligulacConfig.aligulacApiRoot +
			'player/' +
			'?callback=?',
		dataType: "json",
		data:
		{
			tag__iexact: params.parameters.player1name,
			apikey: aligulacConfig.apiKey
		},
	}).done(function (ajaxData) {
		params.parameters.player1 = ajaxData.objects[0].id;
		$.ajax({
			type: "GET",
			url: aligulacConfig.aligulacApiRoot +
				'player/' +
				'?callback=?',
			dataType: "json",
			data:
			{
				tag__iexact: params.parameters.player2name,
				apikey: aligulacConfig.apiKey
			},
		}).done(function (ajaxData2) {
			params.parameters.player2 = ajaxData2.objects[0].id;
			$.ajax({
				type: "GET",
				url: aligulacConfig.aligulacApiRoot +
					'predictmatch/' +
					params.parameters.player1 + ',' + params.parameters.player2 +
					'/?callback=?',
				dataType: "json",
				data:
			{
				apikey: aligulacConfig.apiKey,
				bo: params.parameters.bo
			},
			}).done(function (ajaxData3) {
				domElement.predictMatchTable(params, ajaxData3);
			});
		});
	});
};