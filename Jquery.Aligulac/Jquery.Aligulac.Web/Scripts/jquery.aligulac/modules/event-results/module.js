// description: module for jquery.aligulac. requires module player-link-by-id
// used for display lastest results by specific tournament.
// parameters:
// eventName - reqired

// module initialization
$(document).ready(function () {
    var moduleName = 'aligulac-event-results';
    $.aligulac.registerModule(
    {
        moduleName: moduleName,
        aliasesAttribute: ['data-aligulac-event-results', 'data-aer'],
        parameters: {

        },
        logic: function (params) {
            if (params.parameters.eventName) {
                getEventResults(params);
                return params.deferred;
            }
            return $.Deferred(function () { this.resolve({ result: '' }); });
        },
        load: function (obj) {
            var $moduleElement = obj.clone();
            $.aligulac.runModule({
                mode: moduleName,
                $domElement: $moduleElement,
                parameters: {
                    eventName: $moduleElement.selectValuableAttribute($.aligulac.selectModuleByName(moduleName).aliasesAttribute)
                },
                compareParams: function() {
                    return this.parameters.eventName;
                }
            });
        },
        markup: {
            results: '<table class="aligulac-event-result-table aligulac-event-num-{event-num}"><tr><td colspan="5" class="aligulac-event-name">{aligulac-event-name}</td></tr><tr><td>{aligulac-scores-match}</td></tr></table>',
            scores: '<tr class="{aligulac-match-id}"><td>{aligulac-match-date}</td><td>{aligulac-player1-link}</td><td>{aligulac-score1}</td><td>{aligulac-score2}</td><td>{aligulac-player2-link}</td></tr>',
            scoresTableHeader: '<tr><th>Date</th><th>Player 1</th><th></th><th></th><th>Player 2</th></tr>'
        }
    });

    //module realization
    var getEventResults = function (params) {
        $.ajax({
            type: 'GET',
            url: aligulacConfig.aligulacApiRoot +
                'event/' +
                '?callback=?',
            dataType: 'json',
            data:
            {
                fullname__iexact: params.parameters.eventName,
                apikey: aligulacConfig.apiKey
            },
        }).success(function (ajaxData) {
            params.$domElement.html('');
            drawEventsTable({
                eventId: ajaxData.objects[0].id,
                eventName: ajaxData.objects[0].fullname,
                $domElement: params.$domElement
            });
            ajaxData.objects[0].$domElement = params.$domElement;
            ajaxData.objects[0].params = params;
            $.when(getAllMatchesForEvent(ajaxData.objects[0])).then(function (res) {
                if (res) {
                    params.deferred.resolve({
                        result: res.result
                    });
                }
            });
        });
    };

    var getEventById = function (params) {
        var ajaxArray = [];
        var deferred = $.Deferred();
        var ajaxDeferredArray = [];
        for (var i = 0; i < params.length; i++) {
            var fun = function (paramsI) {
                return $.ajax({
                    type: 'GET',
                    url: aligulacConfig.aligulacApiRoot +
                        'event/' + params[i].eventId +
                        '?callback=?',
                    dataType: 'json',
                    data:
                    {
                        apikey: aligulacConfig.apiKey
                    },
                }).success(function (ajaxData) {
                    drawEventsTable({
                        eventId: ajaxData.id,
                        eventName: ajaxData.fullname,
                        $domElement: paramsI.obj.$domElement
                    });
                    ajaxData.$domElement = paramsI.obj.$domElement;
                    ajaxData.params = paramsI.params;

                    ajaxDeferredArray.push(getAllMatchesForEvent(ajaxData));
                });
            };
            ajaxArray.push(fun(params[i]));
        }
        if (ajaxArray.length !== 0) {
            $.when.apply(null, ajaxArray).then(function (res) {
                $.when.apply(null, ajaxDeferredArray).then(function (r) {
                    deferred.resolve(res);
                });

            });
        } else {
            deferred.resolve();
        }
        return deferred;
    };

    var getAllMatchesForEvent = function (ajaxData) {
        var deferred = $.Deferred();
        $.ajax({
            type: 'GET',
            url: aligulacConfig.aligulacApiRoot +
                'match/' +
                '?callback=?',
            dataType: 'json',
            data:
            {
                apikey: aligulacConfig.apiKey,
                eventobj__id: ajaxData.id
            },
        }).success(function (result) {
            result.filtredPlayers = [];
            for (var r = 0; r < result.objects.length; r++) {
                    result.filtredPlayers.push(result.objects[r]);
            }
            if (result.filtredPlayers.length === 0) {
                ajaxData.$domElement.find('.aligulac-event-num-' + ajaxData.id).remove();
            } else {
                ajaxData.$domElement.find('.aligulac-event-num-' + ajaxData.id).html(
                    ajaxData.$domElement.find('.aligulac-event-num-' + ajaxData.id).html().
                    replace('<tr><td>{aligulac-scores-match}</td></tr>', drawMatchesForEvent(result.filtredPlayers)));
            }
            var childrenArray = [];
            if (ajaxData.children.length > 0) {
                for (var i = 0; i < ajaxData.children.length; i++) {
                    childrenArray.push(
                    {
                        eventId: ajaxData.children[i].replace(new RegExp('/api/v1/event/([0-9]*)/'), '$1'),
                        $domElement: ajaxData.$domElement,
                        params: ajaxData.params,
                        obj: ajaxData
                    });
                }
                $.when(getEventById(childrenArray)).then(function (res) {
                    if (res) {
                        deferred.resolve({ result: res[0].$domElement.html() });
                    }
                });
            } else {
                deferred.resolve({ result: ajaxData.$domElement.html() });
            }
        });
        return deferred;
    };

    //draw methods:
    var drawMatchesForEvent = function (ajaxData) {
        var objects = ajaxData;
        var markups = $.aligulac.selectModuleByName(moduleName).markup;
        var matches = '';
        if (objects.length > 0) {
            matches += markups.scoresTableHeader;
        }
        for (var i = 0; i < objects.length; i++) {
            matches += markups.scores.replace('{aligulac-match-date}', objects[i].date)
                .replace('{aligulac-player1-link}', $.aligulac.extensions.getPlayerLinkResult({
                    mode: 'player-link-by-id',
                    parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false, playerId: objects[i].pla.id }
                }, objects[i].pla))
                .replace('{aligulac-player2-link}', $.aligulac.extensions.getPlayerLinkResult({
                    mode: 'player-link-by-id',
                    parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false, playerId: objects[i].plb.id }
                }, objects[i].plb))
                .replace('{aligulac-score1}', objects[i].sca)
                .replace('{aligulac-score2}', objects[i].scb);
        }
        return matches;
    };

    var drawEventsTable = function (drawTableParams) {
        var markup = $.aligulac.selectModuleByName(moduleName).markup;
        drawTableParams.$domElement.append(markup.results.replace('{event-num}', drawTableParams.eventId).replace('{aligulac-event-name}', drawTableParams.eventName));
    };
});