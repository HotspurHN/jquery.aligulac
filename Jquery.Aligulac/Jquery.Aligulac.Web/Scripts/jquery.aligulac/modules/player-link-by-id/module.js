// description: module for jquery.aligulac.
// used for display player info by aligulac id.
// parameters:
// showFlag - display country flag of player (default true)
// showRace - display race of player (default true)
// showTeam - display primary team of player (default true)
// showPopup - default true
// playerId - required

// module initialization
$.aligulac.registerModule(
	{
		moduleName: "player-link-by-id",
		moduleKey: "player-link-by-id",
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
				mode: 'player-link-by-id',
				selector: $($.aligulac.generateAttributeSelector("player-link-by-id")),
				parameters: {
					playerId: $($.aligulac.generateAttributeSelector("player-link-by-id"))
						.selectValuableAttribute(selectModuleByName("player-link-by-id").aliasesAttribute),

					showFlag: true,
					showRace: true,
					showTeam: true,
					showPopup: false
				}
			});
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
	var aligulacResult = aligulacMarkupPlayerLinkById.playerLink;

	var aligulacFlag = '';
	if (params.parameters.showFlag) {
		aligulacFlag = aligulacMarkupPlayerLinkById.playerFlag
			.replace('{aligulac-player-flag-image}', aligulacConfig.flagsDirectory + ajaxData.country.toLowerCase() + '.png')
			.replace('{aligulac-player-flag-name}', ajaxData.country);
	}
	var aligulacRace = '';
	if (params.parameters.showRace) {
		aligulacRace = aligulacMarkupPlayerLinkById.playerRace
			.replace('{aligulac-player-race-image}', aligulacConfig.racesDirectory + ajaxData.race.toUpperCase() + '.png')
			.replace('{aligulac-player-race-name}', getFullRaceName(ajaxData.race));
	}
	var aligulacClan = '';
	if (params.parameters.showTeam) {
		if (ajaxData.current_teams.length > 0) {
			aligulacClan = aligulacMarkupPlayerLinkById.teamLink
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

		aligulacPopupContent = aligulacMarkupPlayerLinkById.playerPopup
			.replace('{aligulac-player-name}', ajaxData.tag)
			.replace('{race-image}', aligulacMarkupPlayerLinkById.playerRace
				.replace('{aligulac-player-race-image}', aligulacConfig.racesDirectory + ajaxData.race.toUpperCase() + '.png')
				.replace('{aligulac-player-race-name}', getFullRaceName(ajaxData.race)))
			.replace('{aligulac-player-race-name}', getFullRaceName(ajaxData.race))
			.replace('{flag-image}', aligulacMarkupPlayerLinkById.playerFlag
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
	domElement.find('.aligulac-ajax-loading').remove();
};