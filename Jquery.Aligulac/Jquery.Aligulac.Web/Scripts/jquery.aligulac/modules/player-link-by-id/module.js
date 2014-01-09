// description: module for jquery.aligulac.
// used for display player info by aligulac id.
// parameters:
// showFlag - display country flag of player (default true)
// showRace - display race of player (default true)
// showTeam - display primary team of player (default true)
// showPopup - default true
// playerId - required

// module initialization
var aligulac_player_link_by_id_module_name = "player-link-by-id";
$.aligulac.registerModule(
	{
		moduleName: aligulac_player_link_by_id_module_name,
		aliasesAttribute: ["data-aligulac-player-id", "data-apid"],
		parameters: [{
			showFlag: true,
			showRace: true,
			showTeam: true,
			showPopup: true
		}],
		logic: function(params) {
			$.aligulac.getPlayerLinkById(params);
		},
		load: function () {
			$.aligulac.runModule({
				mode: aligulac_player_link_by_id_module_name,
				selector: $($.aligulac.generateAttributeSelector(aligulac_player_link_by_id_module_name)),
				parameters: {
					playerId: $($.aligulac.generateAttributeSelector(aligulac_player_link_by_id_module_name))
						.selectValuableAttribute(selectModuleByName(aligulac_player_link_by_id_module_name).aliasesAttribute),
					showFlag: true,
					showRace: true,
					showTeam: true,
					showPopup: false
				}
			});
		},
		markup:
		{
			playerLink: "{flag-image}{race-image}{team-link}<a href='{aligulac-player-link}' class='aligulac-player-link'>{aligulac-player-name}</a>",
			playerFlag: "<img src='{aligulac-player-flag-image}' alt='{aligulac-player-flag-name}' />",
			playerRace: "<img src='{aligulac-player-race-image}' alt='{aligulac-player-race-name}' />",
			teamLink: "<a href='{aligulact-team-url}' class='aligulac-team-link'>{aligulac-team-name}</a>.",
			playerPopup: "<div class='aligulac-popup-content'>" +
				"<ul><li class='aligulac-popup-header'>{aligulac-player-name}</li>" +
				"<li><strong>Race:</strong> {race-image} {aligulac-player-race-name}</li>" +
				"<li><strong>Country:</strong> {flag-image} {aligulac-player-flag-name}</li>" +
				"<li><strong>Full name:</strong>{aligulac-player-full-name}</li>" +
				"<li><strong>Aka:</strong>{aligulac-player-akas}</li>" +
				"<li><strong>Birthday:</strong>{aligulac-player-birthday}</li>" +
				"<li><strong>Team:</strong>{aligulac-team-name}</li>" +
				"</ul></div>"
		}
	});
//module realization
$.aligulac.getPlayerLinkById = function (params) {
	var domElement = params.selector;
	$.ajax({
		type: "GET",
		url: aligulacConfig.aligulacApiRoot +
			'player/' +
			params.parameters.playerId +
			'?callback=?',
		dataType: "json",
		data:
		{
			apikey: aligulacConfig.apiKey
		},
	}).done(function (ajaxData) {
		domElement.playerLink(params, ajaxData);
	});
};

$.fn.playerLink = function (params, ajaxData) {
	var domElement = $(this);
	var markup = selectModuleByName(aligulac_player_link_by_id_module_name);
	var aligulacResult = markup.playerLink;

	var aligulacFlag = '';
	if (params.parameters.showFlag) {
		aligulacFlag = markup.playerFlag
			.replace('{aligulac-player-flag-image}', aligulacConfig.flagsDirectory + ajaxData.country.toLowerCase() + '.png')
			.replace('{aligulac-player-flag-name}', ajaxData.country);
	}
	var aligulacRace = '';
	if (params.parameters.showRace) {
		aligulacRace = markup.playerRace
			.replace('{aligulac-player-race-image}', aligulacConfig.racesDirectory + ajaxData.race.toUpperCase() + '.png')
			.replace('{aligulac-player-race-name}', getFullRaceName(ajaxData.race));
	}
	var aligulacClan = '';
	if (params.parameters.showTeam) {
		if (ajaxData.current_teams.length > 0) {
			aligulacClan = markup.teamLink
				.replace('{aligulact-team-url}', aligulacConfig.aligulacRoot + '/teams/' + ajaxData.current_teams[0].team.id)
				.replace('{aligulac-team-name}', ajaxData.current_teams[0].team.shortname);
		}
	}

	aligulacResult = aligulacResult.replace('{flag-image}', aligulacFlag)
		.replace('{race-image}', aligulacRace)
		.replace('{team-link}', aligulacClan)
		.replace('{aligulac-player-link}', aligulacConfig.aligulacRoot + '/players/' + ajaxData.id)
		.replace('{aligulac-player-name}', ajaxData.tag);

	domElement.html(aligulacResult);
	if (params.parameters.showPopup) {
		var aligulacPopupContent = '';
		var teams = '';
		if (ajaxData.current_teams.length > 0) {
			teams = ajaxData.current_teams[0].team.shortname;
		}

		aligulacPopupContent = markup.playerPopup
			.replace('{aligulac-player-name}', ajaxData.tag)
			.replace('{race-image}', markup.playerRace
				.replace('{aligulac-player-race-image}', aligulacConfig.racesDirectory + ajaxData.race.toUpperCase() + '.png')
				.replace('{aligulac-player-race-name}', getFullRaceName(ajaxData.race)))
			.replace('{aligulac-player-race-name}', getFullRaceName(ajaxData.race))
			.replace('{flag-image}', markup.playerFlag
				.replace('{aligulac-player-flag-image}', aligulacConfig.flagsDirectory + ajaxData.country.toLowerCase() + '.png')
				.replace('{aligulac-player-flag-name}', ajaxData.country))
			.replace('{aligulac-player-flag-name}', ajaxData.country)
			.replace('{aligulac-player-full-name}', ajaxData.name)
			.replace('{aligulac-player-akas}', ajaxData.aliases.join(','))
			.replace('{aligulac-player-birthday}', ajaxData.birthday)
			.replace('{aligulac-team-name}', teams);
		domElement.find('a').qtip({
			content: {
				text: aligulacPopupContent,
				position: {
					target: 'mouse',
					adjust: { x: 5, y: 5 },
					style: 'fixed'
				}
			}
		});
	}
};