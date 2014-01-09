// description: module for jquery.aligulac. requires module player-link-by-id
// used for display player info by name.
// parameters:
// showFlag - display country flag of player (default true)
// showRace - display race of player (default true)
// showTeam - display primary team of player (default true)
// showPopup - default true
// eventName - reqired
// matchesCount - default 20

// module initialization
var aligulac_event_results_module_name = 'event-results';
$.aligulac.registerModule(
{
	moduleName: aligulac_event_results_module_name,
	aliasesAttribute: ["data-aligulac-event-results", "data-aer"],
	parameters: [{
		limit: 20
	}],
	logic: function (params) {
		$.aligulac.getEventResults(params);
	},
	load: function () {
		$.aligulac.runModule({
			mode: aligulac_event_results_module_name,
			selector: $($.aligulac.generateAttributeSelector(aligulac_event_results_module_name)),
			parameters: {
				eventName: $($.aligulac.generateAttributeSelector(aligulac_event_results_module_name))
					.selectValuableAttribute(selectModuleByName(aligulac_event_results_module_name).aliasesAttribute),
				limit: 20
			}
		});
	},
	markup: {
		results: "<table><tr><th>Date</th><th>Player 1</th><th></th><th></th><th>Player 2</th></tr>{aligulac-scores-match}</table>",
		scores: "<tr class='{aligulac-match-id}'><td>{aligulac-match-date}</td><td>{aligulac-player1-link}</td><td>{aligulac-score1}</td><td>{aligulac-score2}</td><td>{aligulac-player2-link}</td></tr>"
	}
});
//module realization
$.aligulac.getEventResults = function (params) {
	$.ajax({
		type: "GET",
		url: aligulacConfig.aligulacApiRoot +
			'event/' +
			'?callback=?',
		dataType: "json",
		data:
		{
			name__icontains: params.parameters.eventName,
			apikey: aligulacConfig.apiKey
		},
	}).done(function (ajaxData) {
		var module = selectModuleByName(aligulac_event_results_module_name);
		$.aligulac.getLastMatchesOnEvent({ eventId: ajaxData.objects[0].name, limit: module.parameters.limit, selector: params.selector });
	});
};

$.aligulac.getLastMatchesOnEvent = function (params) {
	var domElement = params.selector;
	$.ajax({
		type: "GET",
		url: aligulacConfig.aligulacApiRoot +
			'match/' +
			'?callback=?',
		dataType: "json",
		data:
		{
			event__istartswith: params.eventId,
			order_by: "-date",
			limit: params.limit,
			apikey: aligulacConfig.apiKey,
		},
	}).done(function(ajaxData) {
		domElement.eventResults(ajaxData);
	});
};

$.fn.eventResults = function (ajaxData) {
	var objects = ajaxData.objects;
	var markups = selectModuleByName(aligulac_event_results_module_name).markup;
	var result = "";
	var matches = "";
	for (var i = 0; i < objects.length; i++) {
		matches += markups.scores.replace("{aligulac-match-date}", objects[i].date)
			.replace("{aligulac-player1-link}", $.aligulac.getPlayerLinkResult({
				mode: "player-link-by-id",
				parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false, playerId: objects[i].pla.id }
			}, objects[i].pla))
			.replace("{aligulac-player2-link}", $.aligulac.getPlayerLinkResult({
				mode: "player-link-by-id",
				parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false, playerId: objects[i].plb.id }
			}, objects[i].plb))
			.replace("{aligulac-score1}", objects[i].sca)
			.replace("{aligulac-score2}", objects[i].scb);
	}
	result = markups.results
		.replace("{aligulac-scores-match}", matches);
	this.html(result);
}