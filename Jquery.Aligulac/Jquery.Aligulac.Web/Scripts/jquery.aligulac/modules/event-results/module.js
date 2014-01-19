// description: module for jquery.aligulac. requires module player-link-by-id
// used for display lastest results by specific tournament.
// parameters:
// eventName - reqired

// module initialization
$.aligulac.eventResults = {};
var aligulac_event_results_module_name = 'aligulac-event-results';
$.aligulac.registerModule(
{
    moduleName: aligulac_event_results_module_name,
    aliasesAttribute: ["data-aligulac-event-results", "data-aer"],
    parameters: {
    
    },
    logic: function(params) {
        $.aligulac.eventResults.getEventResults(params);
    },
    load: function() {
        $.aligulac.runModule({
            mode: aligulac_event_results_module_name,
            selector: $($.aligulac.generateAttributeSelector(aligulac_event_results_module_name)),
            parameters: {
                eventName: $($.aligulac.generateAttributeSelector(aligulac_event_results_module_name))
                    .selectValuableAttribute(selectModuleByName(aligulac_event_results_module_name).aliasesAttribute)
            }
        });
    },
    markup: {
        results: "<table class='aligulac-event-result-table aligulac-event-num-{event-num}'><tr><td colspan='5' class='aligulac-event-name'>{aligulac-event-name}</td></tr><tr><td>{aligulac-scores-match}</td></tr></table>",
        scores: "<tr class='{aligulac-match-id}'><td>{aligulac-match-date}</td><td>{aligulac-player1-link}</td><td>{aligulac-score1}</td><td>{aligulac-score2}</td><td>{aligulac-player2-link}</td></tr>",
        scoresTableHeader: "<tr><th>Date</th><th>Player 1</th><th></th><th></th><th>Player 2</th></tr>"
    }
});
//module realization
$.aligulac.eventResults.getEventResults = function (params) {
    $.ajax({
        type: "GET",
        url: aligulacConfig.aligulacApiRoot +
            'event/' +
            '?callback=?',
        dataType: "json",
        data:
        {
            fullname__iexact: params.parameters.eventName,
            apikey: aligulacConfig.apiKey
        },
    }).success(function (ajaxData) {
        params.selector.html("");
        $.aligulac.eventResults.drawEventsTable({
            eventId: ajaxData.objects[0].id,
            eventName: ajaxData.objects[0].fullname,
            selector: params.selector
        });
        ajaxData.objects[0].selector = params.selector;
        $.aligulac.eventResults.getAllMatchesForEvent(ajaxData.objects[0]);
    });
};

$.aligulac.eventResults.getEventById = function (params) {
    $.ajax({
        type: "GET",
        url: aligulacConfig.aligulacApiRoot +
            'event/' +params.eventId+
            '?callback=?',
        dataType: "json",
        data:
        {
            apikey: aligulacConfig.apiKey
        },
    }).success(function (ajaxData) {
        ajaxData.selector = params.selector;
        $.aligulac.eventResults.drawEventsTable({
            eventId: ajaxData.id,
            eventName: ajaxData.fullname,
            selector: params.selector
        });
        ajaxData.selector = params.selector;
        $.aligulac.eventResults.getAllMatchesForEvent(ajaxData);
    });
};

$.aligulac.eventResults.getAllMatchesForEvent = function (ajaxData) {
    $.ajax({
        type: "GET",
        url: aligulacConfig.aligulacApiRoot +
            'match/' +
            '?callback=?',
        dataType: "json",
        data:
        {
            apikey: aligulacConfig.apiKey,
            eventobj__id: ajaxData.id
        },
    }).success(function (result) {
        if (result.objects.length == 0) {
            ajaxData.selector.find(".aligulac-event-num-" + ajaxData.id).remove();
        } else {
            ajaxData.selector.find(".aligulac-event-num-" + ajaxData.id).html(
                ajaxData.selector.find(".aligulac-event-num-" + ajaxData.id).html().replace("<tr><td>{aligulac-scores-match}</td></tr>", $.aligulac.eventResults.drawMatchesForEvent(result)));
            }
        for (var i = 0; i < ajaxData.children.length; i++) {
            var childrenMatchParams = ajaxData;
            childrenMatchParams.eventId = ajaxData.children[i].replace(new RegExp("/api/v1/event/([0-9]*)/"), "$1");
            $.aligulac.eventResults.getEventById(childrenMatchParams);
        }
    });
};

//draw methods:
$.aligulac.eventResults.drawMatchesForEvent = function (ajaxData) {
    var objects = ajaxData.objects;
    var markups = selectModuleByName(aligulac_event_results_module_name).markup;
    var matches = "";
    if (objects.length > 0) {
        matches += markups.scoresTableHeader;
    }
    for (var i = 0; i < objects.length; i++) {
        matches += markups.scores.replace("{aligulac-match-date}", objects[i].date)
            .replace("{aligulac-player1-link}", $.aligulac.playerLinkById.getPlayerLinkResult({
                mode: "player-link-by-id",
                parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false, playerId: objects[i].pla.id }
            }, objects[i].pla))
            .replace("{aligulac-player2-link}", $.aligulac.playerLinkById.getPlayerLinkResult({
                mode: "player-link-by-id",
                parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false, playerId: objects[i].plb.id }
            }, objects[i].plb))
            .replace("{aligulac-score1}", objects[i].sca)
            .replace("{aligulac-score2}", objects[i].scb);
    }
    return matches;
};

$.aligulac.eventResults.drawEventsTable = function (drawTableParams) {
    var markup = selectModuleByName(aligulac_event_results_module_name).markup;
    drawTableParams.selector.html(drawTableParams.selector.html() +
        markup.results.replace("{event-num}", drawTableParams.eventId).replace("{aligulac-event-name}", drawTableParams.eventName));
};
