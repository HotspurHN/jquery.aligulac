/// <reference path="../jquery-2.0.3.intellisense.js" />
/// <reference path="jquery.aligulac.config.js" />
/// <reference path="jquery.aligulac.markup.js" />

$.fn.aligulac = function (params) {
	var domElement = this;
	if (params.mode == null)
	{
		console.log('Aligulac plugin: Critical error! Mode isn\'t specified!');
	}
	domElement.html('<img class="aligulac-ajax-loading" src="' + aligulacConfig.ajaxLoading + '" alt="ajax" />');
	params = initDefaultParameters(params);
	switch(params.mode)
	{
		case "player-link-by-id":
			playerLinkById(params, domElement);
			break;
		case "player-link-by-name":
			playerLinkByName(params, domElement);
			break;
	}
};

function AligulacParseDomAttributes() {
	$("[data-aligulac-player-id]").each(function() {
		$(this).aligulac({
			mode: 'player-link-by-id',
			parameters: {
				playerId: $(this).attr('data-aligulac-player-id')
	}
		});
	});
	$("[data-aligulac-player-name]").each(function () {
		$(this).aligulac({
			mode: 'player-link-by-name',
			parameters: {
				playerName: $(this).attr('data-aligulac-player-name')
			}
		});
	});
}

function playerLink(params, ajaxData, domElement) {
	var aligulacResult = aligulacMarkup.playerLink;


	var aligulacFlag = '';
	if (params.parameters.showFlag) {
		aligulacFlag = aligulacMarkup.playerFlag
			.replace('{aligulac-player-flag-image}', aligulacConfig.flagsDirectory + ajaxData.country.toLowerCase() + '.png')
			.replace('{aligulac-player-flag-name}', ajaxData.country);
	}
	var aligulacRace = '';
	if (params.parameters.showRace) {
		aligulacRace = aligulacMarkup.playerRace
			.replace('{aligulac-player-race-image}', aligulacConfig.racesDirectory + ajaxData.race.toUpperCase() + '.png')
			.replace('{aligulac-player-race-name}', getFullRaceName(ajaxData.race));
	}
	var aligulacClan = '';
	if (params.parameters.showTeam) {
		if (ajaxData.current_teams.length > 0) {
			aligulacClan = aligulacMarkup.teamLink
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
		
		aligulacPopupContent = aligulacMarkup.playerPopup
			.replace('{aligulac-player-name}', ajaxData.tag)
			.replace('{race-image}', aligulacMarkup.playerRace
				.replace('{aligulac-player-race-image}', aligulacConfig.racesDirectory + ajaxData.race.toUpperCase() + '.png')
				.replace('{aligulac-player-race-name}', getFullRaceName(ajaxData.race)))
			.replace('{aligulac-player-race-name}', getFullRaceName(ajaxData.race))
			.replace('{flag-image}', aligulacMarkup.playerFlag
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
}

function playerLinkById(params, domElement) {
	$.ajax({
		type: "GET",
		url: aligulacConfig.aligulacApiRoot +
			'player/' +
			params.parameters.playerId +
			'?apikey=' +
			aligulacConfig.apiKey + '&callback=?',
		dataType: "json",
	}).done(function (ajaxData) {
		playerLink(params, ajaxData, domElement);
	});
}
function playerLinkByName(params, domElement) {
	$.ajax({
		type: "GET",
		url: aligulacConfig.aligulacApiRoot +
			'player/' +
			'?apikey=' +
			aligulacConfig.apiKey +
			'&tag__iregex=' + params.parameters.playerName +
			'&callback=?',
		dataType: "json",
	}).done(function (ajaxData) {
		playerLink(params, ajaxData.objects[0], domElement);
	});
}

function getFullRaceName(raceSymbol) {
	var raceName = '';
	switch (raceSymbol) {
		case "Z":
			raceName = "Zerg";
			break;
		case "P":
			raceName = "Protos";
			break;
		case "T":
			raceName = "Terran";
			break;
		case "R":
			raceName = "Random";
			break;
	}
	return raceName;
}

function initDefaultParameters(params) {
	if (params.parameters.showFlag == null) {
		params.parameters.showFlag = true;
	}
	if (params.parameters.showRace == null) {
		params.parameters.showRace = true;
	}
	if (params.parameters.showTeam == null) {
		params.parameters.showTeam = true;
	}
	if (params.parameters.showPopup == null) {
		params.parameters.showPopup = true;
	}
	return params;
}