// description: module for jquery.aligulac. requires module player-link-by-id
// used for display player info by name.
// parameters:
// bo - count of games default 3
// player1 - reqired. player id
// player2 - reqired. player id

// module initialization
var alogulac_predict_match_by_player_id_module_name = "predict-match-by-player-id";
$.aligulac.registerModule(
	{
		moduleName: alogulac_predict_match_by_player_id_module_name,
		moduleKey: alogulac_predict_match_by_player_id_module_name,
		aliasesAttribute: ["data-apmi", "data-aligulac-predict-match-by-id"],
		parameters: [{
			bo: 3
		}],
		logic: function(params) {
			$.aligulac.getPredictMatchByIds(params);
		},
		load: function () {
			var pmparams = $($.aligulac.generateAttributeSelector(alogulac_predict_match_by_player_id_module_name))
				.selectValuableAttribute(selectModuleByName(alogulac_predict_match_by_player_id_module_name).aliasesAttribute)
				.split(',');
			$.aligulac.runModule({
				mode: alogulac_predict_match_by_player_id_module_name,
				selector: $($.aligulac.generateAttributeSelector(alogulac_predict_match_by_player_id_module_name)),
				parameters: {
					player1: pmparams[0],
					player2: pmparams[1],
					bo: pmparams[2]
				}
			});
		}
	});
//module realization
$.aligulac.getPredictMatchByIds = function (params) {
		var domElement = $(this);
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
	}).done(function(ajaxData) {
			domElement.predictMatchTable(params, ajaxData);
		});
};

$.fn.predictMatchTable = function (params, ajaxData) {
	var domElement = params.selector;
		ajaxData.pla.id = params.parameters.player1;
		ajaxData.plb.id = params.parameters.player2;
	domElement.html(aligulacMarkupPredictMatchByPlayerId.predictMatch);
		domElement.find('.player1').playerLink({
				mode: 'player-link-by-id',
				parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false }
		}, ajaxData.pla);
	domElement.find('.player2').playerLink({
			mode: 'player-link-by-id',
			parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false }
	}, ajaxData.plb);

	var aligulacResult = domElement.html();

	var scorePredictions = '';
	for (var i = 0; i < ajaxData.outcomes.length / 2; i++) {
		scorePredictions += aligulacMarkupPredictMatchByPlayerId.scorePredictionLine.replace('{aligulac-score1}', ajaxData.outcomes[i].sca + '-' + ajaxData.outcomes[i].scb)
				.replace('{aligulac-score2}', ajaxData.outcomes[(ajaxData.outcomes.length / 2) + i].sca + '-' + ajaxData.outcomes[(ajaxData.outcomes.length / 2) + i].scb)
				.replace('{aligulac-percent1}', Math.percentToNumber(ajaxData.outcomes[i].prob ))
				.replace('{aligulac-percent2}', Math.percentToNumber(ajaxData.outcomes[(ajaxData.outcomes.length / 2) + i].prob ));
		}
	aligulacResult = aligulacResult.replace('{score-predictions}', scorePredictions)
		.replace('{aligulac-score-summary-prediction1}', Math.percentToNumber(ajaxData.proba))
		.replace('{aligulac-score-summary-prediction2}', Math.percentToNumber(ajaxData.probb));
	domElement.html(aligulacResult);
};
