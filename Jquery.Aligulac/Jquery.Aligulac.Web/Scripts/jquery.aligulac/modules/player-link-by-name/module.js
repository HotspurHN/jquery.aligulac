// description: module for jquery.aligulac. requires module player-link-by-id
// used for display player info by name.
// parameters:
// showFlag - display country flag of player (default true)
// showRace - display race of player (default true)
// showTeam - display primary team of player (default true)
// showPopup - default true
// playerName - reqired

// module initialization
$.aligulac.registerModule(
	{
		moduleName: "player-link-by-name",
		moduleKey: "player-link-by-name",
		aliasesAttribute: ["data-aligulac-player-name", "data-apn"],
		parameters: [{
			showFlag: true,
			showRace: true,
			showTeam: true,
			showPopup: true
		}],
		logic: function(params) {
			$.aligulac.getPlayerLinkByName(params);
		},
		load: function () {
			$.aligulac.runModule({
				mode: 'player-link-by-name',
				selector: $($.aligulac.generateAttributeSelector("player-link-by-name")),
				parameters: {
					playerName: $($.aligulac.generateAttributeSelector("player-link-by-name"))
						.selectValuableAttribute(selectModuleByName("player-link-by-name").aliasesAttribute),

					showFlag: true,
					showRace: true,
					showTeam: true,
					showPopup: false
				}
			});
		}
	});
//module realization
$.aligulac.getPlayerLinkByName = function (params) {
	var domElement = params.selector;
	$.ajax({
		type: "GET",
		url: aligulacConfig.aligulacApiRoot +
			'player/' +
			'?callback=?',
		dataType: "json",
		data:
		{
			tag__iexact: params.parameters.playerName,
			apikey: aligulacConfig.apiKey
		},
	}).done(function (ajaxData) {
		domElement.playerLink(params, ajaxData.objects[0]);
	});
};