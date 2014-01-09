// description: module for jquery.aligulac. requires module player-link-by-id
// used for display player info by name.
// parameters:
// showFlag - display country flag of player (default true)
// showRace - display race of player (default true)
// showTeam - display primary team of player (default true)
// showPopup - default true
// playerName - reqired

// module initialization
var aligulac_player_link_by_name_module_id = 'player-link-by-name';
$.aligulac.registerModule(
{
	moduleName: aligulac_player_link_by_name_module_id,
	aliasesAttribute: ["data-aligulac-player-name", "data-apn"],
	parameters: [{
		showFlag: true,
		showRace: true,
		showTeam: true,
		showPopup: true
	}],
	logic: function (params) {
		$.aligulac.getPlayerLinkByName(params);
	},
	load: function () {
		$.aligulac.runModule({
			mode: aligulac_player_link_by_name_module_id,
			selector: $($.aligulac.generateAttributeSelector(aligulac_player_link_by_name_module_id)),
			parameters: {
				playerName: $($.aligulac.generateAttributeSelector(aligulac_player_link_by_name_module_id))
					.selectValuableAttribute(selectModuleByName(aligulac_player_link_by_name_module_id).aliasesAttribute),
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
	if (params.parameters.playerName != "") {
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
		}).done(function(ajaxData) {
			params.mode = aligulac_player_link_by_id_module_name;
			params.parameters.playerId = ajaxData.objects[0].id;
			domElement.playerLink(params, ajaxData.objects[0]);
		});
	}
};