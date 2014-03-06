// description: module for jquery.aligulac.
// used for display player info by aligulac id.
// parameters:
// showFlag - display country flag of player (default true)
// showRace - display race of player (default true)
// showTeam - display primary team of player (default true)
// showPopup - default true
// playerId - required

// module initialization
$(document).ready(function () {
    var moduleName = "player-link-by-id";
    $.aligulac.registerModule(
    {
        moduleName: moduleName,
        aliasesAttribute: ["data-aligulac-player-id", "data-apid"],
        parameters: [
            {
                showFlag: true,
                showRace: true,
                showTeam: true,
                showPopup: true
            }
        ],
        logic: function (params) {
            return getPlayerLinkById(params);
        },
        load: function (obj) {
            var $moduleElement = obj.clone();
            $.aligulac.runModule({
                mode: moduleName,
                $domElement: $moduleElement,
                parameters: {
                    playerId: $moduleElement.selectValuableAttribute($.aligulac.selectModuleByName(moduleName).aliasesAttribute),
                    showFlag: true,
                    showRace: true,
                    showTeam: true,
                    showPopup: false
                },
                compareParams: function () {
                    return this.parameters.playerId;
                }
            });
        },
        markup:
        {
            playerLink: "{flag-image}{race-image}{team-link}<a target='_blank' href='{aligulac-player-link}' class='aligulac-player-link'>{aligulac-player-name}</a>",
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
    var getPlayerLinkById = function (params) {
        var deferred = $.Deferred();
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
        }).success(function (ajaxData) {
            $.when(params.$domElement.aligulac.extentions.playerLink(params, ajaxData, params.$domElement)).then(
                function () {
                    deferred.resolve({ result: params.$domElement.html() });
                }
            );
        });
        return deferred;
    };


    var getPlayerLinkResult = function (params, ajaxData) {
        var markup = $.aligulac.selectModuleByName(moduleName).markup;
        var aligulacResult = markup.playerLink;

        var aligulacFlag = '';
        if (params.parameters.showFlag) {
            if (ajaxData.country) {
                aligulacFlag = markup.playerFlag
                    .replace('{aligulac-player-flag-image}', aligulacConfig.flagsDirectory + ajaxData.country.toLowerCase() + '.png')
                    .replace('{aligulac-player-flag-name}', ajaxData.country);
            }
        }
        var aligulacRace = '';
        if (params.parameters.showRace) {
            aligulacRace = markup.playerRace
                .replace('{aligulac-player-race-image}', aligulacConfig.racesDirectory + ajaxData.race.toUpperCase() + '.png')
                .replace('{aligulac-player-race-name}', $.aligulac.getFullRaceName(ajaxData.race));
        }
        var aligulacClan = '';
        if (params.parameters.showTeam) {
            if (ajaxData.current_teams.length > 0) {
                aligulacClan = markup.teamLink
                    .replace('{aligulact-team-url}', aligulacConfig.aligulacRoot + '/teams/' + ajaxData.current_teams[0].team.id)
                    .replace('{aligulac-team-name}', ajaxData.current_teams[0].team.shortname);
            }
        }

        return aligulacResult.replace('{flag-image}', aligulacFlag)
            .replace('{race-image}', aligulacRace)
            .replace('{team-link}', aligulacClan)
            .replace('{aligulac-player-link}', aligulacConfig.aligulacRoot + '/players/' + ajaxData.id)
            .replace('{aligulac-player-name}', ajaxData.tag);
    };

    //extentions
    $.aligulac.extentions.getPlayerLinkResult = function(params, ajaxData) {
         return getPlayerLinkResult(params, ajaxData);
    };

    $.fn.aligulac.extentions.playerLink = function (params, ajaxData, _self) {
        if (params.parameters.playerId) {
            var domElement = _self;
            var aligulacResult = getPlayerLinkResult(params, ajaxData);

            domElement.html(aligulacResult);
            if (params.parameters.showPopup) {
                var teams = '';
                if (ajaxData.current_teams.length > 0) {
                    teams = ajaxData.current_teams[0].team.shortname;
                }

                var aligulacPopupContent = markup.playerPopup
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
        }
        return $.Deferred().resolve();
    };
});