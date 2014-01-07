/// <reference path="../jquery-2.0.3.intellisense.js" />
/// <reference path="jquery.aligulac.config.js" />
/// <reference path="jquery.aligulac.markup.js" />

$.fn.aligulac = function (params) {
	var domElement = this;
	if (params.mode == null) {
		console.log('Aligulac plugin: Critical error! Mode isn\'t specified!');
	}
	domElement.html('<img class="aligulac-ajax-loading" src="' + aligulacConfig.ajaxLoading + '" alt="ajax" />');
	params = initDefaultParameters(params);
	switch (params.mode) {
		case "player-link-by-id":
			domElement.getPlayerLinkById(params);
			break;
		case "player-link-by-name":
			domElement.getPlayerLinkByName(params);
			break;
		case "predict-match-by-ids":
			domElement.getPredictMatchByIds(params);
			break;
	}
};

$.aligulac = function () {
	var aligulacPlayerByIdAttributeSelector = '';
	for (var i = 0; i < aligulacConfig.aligulacPlayerIdAliases.length; i++) {
		aligulacPlayerByIdAttributeSelector += '[' + aligulacConfig.aligulacPlayerIdAliases[i] + ']';
		if (i != aligulacConfig.aligulacPlayerIdAliases.length - 1) {
			aligulacPlayerByIdAttributeSelector += ",";
		}
	}
	var aligulacPlayerByNameAttributeSelector = '';
	for (var j = 0; j < aligulacConfig.aligulacPlayerNameAliases.length; j++) {
		aligulacPlayerByNameAttributeSelector += '[' + aligulacConfig.aligulacPlayerNameAliases[j] + ']';
		if (j != aligulacConfig.aligulacPlayerNameAliases.length - 1) {
			aligulacPlayerByNameAttributeSelector += ",";
		}
	}
	var aligulacPredictMatchByIdAttributeSelector = '';
	for (var j = 0; j < aligulacConfig.aligulacPredictMatchAliases.length; j++) {
		aligulacPredictMatchByIdAttributeSelector += '[' + aligulacConfig.aligulacPredictMatchAliases[j] + ']';
		if (j != aligulacConfig.aligulacPredictMatchAliases.length - 1) {
			aligulacPredictMatchByIdAttributeSelector += ",";
		}
	}

	$(aligulacPlayerByIdAttributeSelector).each(function () {
		$(this).aligulac({
			mode: 'player-link-by-id',
			parameters: {
				playerId: $(this).selectValuableAttribute(aligulacConfig.aligulacPlayerIdAliases)
			}
		});
	});
	$(aligulacPlayerByNameAttributeSelector).each(function () {
		$(this).aligulac({
			mode: 'player-link-by-name',
			parameters: {
				playerName: $(this).selectValuableAttribute(aligulacConfig.aligulacPlayerNameAliases)
			}
		});
	});
	
	$(aligulacPredictMatchByIdAttributeSelector).each(function () {
		var parsedAttribute = $(this).selectValuableAttribute(aligulacConfig.aligulacPredictMatchAliases).split(',');
		$(this).aligulac({
			mode: 'predict-match-by-ids',
			parameters: {
				player1: parsedAttribute[0],
				player2: parsedAttribute[1],
				bo: parsedAttribute[2]
			}
		});
	});
};

$.fn.selectValuableAttribute = function (aliases) {
	for (var i = 0; i < aliases.length; i++) {
		if ($(this).attr(aliases[i]) != null) {
			return $(this).attr(aliases[i]);
		}
	}
	return '';
};

$.fn.playerLink = function(params, ajaxData) {
	var domElement = $(this);
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
};

$.fn.predictMatchTable = function (params, ajaxData) {
	var domElement = $(this);
	ajaxData.pla.id = params.parameters.player1;
	ajaxData.plb.id = params.parameters.player2;
	domElement.html(aligulacMarkup.predictMatch);
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
		scorePredictions += aligulacMarkup.scorePredictionLine.replace('{aligulac-score1}', ajaxData.outcomes[i].sca + '-' + ajaxData.outcomes[i].scb)
			.replace('{aligulac-score2}', ajaxData.outcomes[(ajaxData.outcomes.length / 2) + i].sca + '-' + ajaxData.outcomes[(ajaxData.outcomes.length / 2) + i].scb)
			.replace('{aligulac-percent1}', Math.round(ajaxData.outcomes[i].prob * 10000) / 100)
			.replace('{aligulac-percent2}', Math.round(ajaxData.outcomes[(ajaxData.outcomes.length / 2) + i].prob * 1000) / 100);
	}
	aligulacResult = aligulacResult.replace('{score-predictions}', scorePredictions)
		.replace('{aligulac-score-summary-prediction1}', Math.round(ajaxData.proba * 10000)/100)
		.replace('{aligulac-score-summary-prediction2}', Math.round(ajaxData.probb * 10000)/100);
	domElement.html(aligulacResult);
};

$.fn.getPlayerLinkById = function(params) {
	var domElement = $(this);
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
	}).done(function(ajaxData) {
		domElement.playerLink(params, ajaxData);
	});
};

$.fn.getPlayerLinkByName = function(params) {
	var domElement = $(this);
	$.ajax({
		type: "GET",
		url: aligulacConfig.aligulacApiRoot +
			'player/' +
			'?tag__iregex=' + params.parameters.playerName +
			'&callback=?',
		dataType: "json",
		data:
		{
			apikey: aligulacConfig.apiKey
		},
	}).done(function(ajaxData) {
		domElement.playerLink(params, ajaxData.objects[0]);
	});
};

$.fn.getPredictMatchByIds = function(params) {
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

function initDefaultParameters(params) {
	//player link
	if ((params.mode == 'player-link-by-id') || (params.mode == 'player-link-by-name')) {
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
	}
		//predict match
	else if (params.mode == 'predict-match-by-ids') {
		if ((params.parameters.bo == null) || (params.parameters.bo % 2 == 0)) {
			params.parameters.bo = 3;
		}
	}
	return params;
}