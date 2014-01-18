// description: module for jquery.aligulac. requires module player-link-by-id
// used for display lastest results by specific tournament.
// parameters:
// showFlag - display country flag of player (default true)
// showRace - display race of player (default true)
// showTeam - display primary team of player (default true)
// showPopup - default true
// eventName - reqired
// matchesCount - default 20

// module initialization
var aligulac_event_results_module_name = 'event-results';
$.aligulac.registerModule(
{
    moduleName: aligulac_event_results_module_name,
    aliasesAttribute: ["data-aligulac-event-results", "data-aer"],
    parameters: {
        resultHtml: ""
    },
    logic: function (params) {
        $.aligulac.getEventResults(params);
    },
    load: function () {
        $.aligulac.runModule({
            mode: aligulac_event_results_module_name,
            selector: $($.aligulac.generateAttributeSelector(aligulac_event_results_module_name)),
            parameters: {
                eventName: $($.aligulac.generateAttributeSelector(aligulac_event_results_module_name))
					.selectValuableAttribute(selectModuleByName(aligulac_event_results_module_name).aliasesAttribute),
                resultHtml: ""
            }
        });
    },
    markup: {
        results: "<table class='aligulac-event-result-table aligulac-event-num-{event-num}'><tr><td colspan='4' class='aligulac-event-name'>{aligulac-event-name}</td></tr><tr><td>{aligulac-scores-match}</td></tr></table>",
        scores: "<tr class='{aligulac-match-id}'><td>{aligulac-match-date}</td><td>{aligulac-player1-link}</td><td>{aligulac-score1}</td><td>{aligulac-score2}</td><td>{aligulac-player2-link}</td></tr>"
    }
});
//module realization


$.aligulac.getEventResults = function (params) {
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
        $.aligulac.drawEventsTable({
            eventId: ajaxData.objects[0].id,
            eventName: ajaxData.objects[0].fullname,
            selector: params.selector
        });
        ajaxData.objects[0].selector = params.selector;
        $.aligulac.getAllMatchesForEvent(ajaxData.objects[0]);
    });
};

$.eventResults = function (ajaxData) {
    var objects = ajaxData.objects;
    var markups = selectModuleByName(aligulac_event_results_module_name).markup;
    var matches = "";
    if (objects.length > 0) {
        matches += "<tr><th>Date</th><th>Player 1</th><th></th><th></th><th>Player 2</th></tr>";
    }
    for (var i = 0; i < objects.length; i++) {
        matches += markups.scores.replace("{aligulac-match-date}", objects[i].date)
            .replace("{aligulac-player1-link}", $.aligulac.getPlayerLinkResult({
                mode: "player-link-by-id",
                parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false, playerId: objects[i].pla.id }
            }, objects[i].pla))
            .replace("{aligulac-player2-link}", $.aligulac.getPlayerLinkResult({
                mode: "player-link-by-id",
                parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false, playerId: objects[i].plb.id }
            }, objects[i].plb))
            .replace("{aligulac-score1}", objects[i].sca)
            .replace("{aligulac-score2}", objects[i].scb);
    }
    return matches;
};

$.aligulac.drawEventsTable = function (drawTableParams) {
    var markup = selectModuleByName(aligulac_event_results_module_name).markup;
    drawTableParams.selector.html(drawTableParams.selector.html() +
        markup.results
        .replace("{event-num}", drawTableParams.eventId)
        .replace("{aligulac-event-name}", drawTableParams.eventName));
};

$.aligulac.getEventById = function (params) {
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
        $.aligulac.drawEventsTable({
            eventId: ajaxData.id,
            eventName: ajaxData.fullname,
            selector: params.selector
        });
        ajaxData.selector = params.selector;
        $.aligulac.getAllMatchesForEvent(ajaxData);
    });
};

$.aligulac.getAllMatchesForEvent = function (ajaxData) {
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
        ajaxData.selector.find(".aligulac-event-num-" + ajaxData.id).html(
            ajaxData.selector.find(".aligulac-event-num-" + ajaxData.id).html().replace("<tr><td>{aligulac-scores-match}</td></tr>", $.eventResults(result)));
        for (var i = 0; i < ajaxData.children.length; i++) {
            var childrenMatchParams = ajaxData;
            childrenMatchParams.eventId = ajaxData.children[i].replace(new RegExp("/api/v1/event/([0-9]*)/"), "$1");
            $.aligulac.getEventById(childrenMatchParams);
        }
    });
};
