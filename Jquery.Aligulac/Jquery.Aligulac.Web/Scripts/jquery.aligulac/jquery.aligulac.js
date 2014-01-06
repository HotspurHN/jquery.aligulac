/// <reference path="../jquery-2.0.3.intellisense.js" />
/// <reference path="jquery.aligulac.config.js" />
/// <reference path="jquery.aligulac.markup.js" />

$.fn.aligulac = function (params) {
	var domElement = this;
	if (params.mode == null)
	{
		console.log('Aligulac plugin: Critical error! Mode isn\'t specified!');
	}
	switch(params.mode)
	{
		case "player-link-by-id":
			$.ajax({
				type: "GET",
				url: aligulacConfig.aligulacApiRoot + 
					'player/' + 
					params.parameters.playerId +
					'?apikey=' +
					aligulacConfig.apiKey + '&callback=?',
					dataType: "json",
			}).done(function (ajaxData) {
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
						.replace('{aligulac-player-race-name}', ajaxData.race);
				}
				var aligulacClan = '';
				if (params.parameters.showTeam) {
					aligulacClan = aligulacMarkup.teamLink
						.replace('{aligulact-team-url}', aligulacConfig.aligulacRoot + ajaxData.current_teams[0].team.resource_uri.replace('/api/beta/', ''))
						.replace('{aligulac-team-name}', ajaxData.current_teams[0].team.shortname);
				}

				aligulacResult = aligulacResult.replace('{flag-image}', aligulacFlag)
					.replace('{race-image}', aligulacRace)
					.replace('{team-link}', aligulacClan)
					.replace('{aligulac-player-link}', aligulacConfig.aligulacRoot + '/players/' + params.parameters.playerId)
					.replace('{aligulac-player-name}', ajaxData.lp_name);

				domElement.html(domElement.html() + aligulacResult);
			});
	}
};