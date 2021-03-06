﻿// description: module for jquery.aligulac. requires module player-link-by-id
// used for display player info by name.
// parameters:
// bo - count of games default 3
// player1 - reqired. player id
// player2 - reqired. player id

// module initialization
$(document).ready(function () {
    var moduleName = 'predict-match-by-player-id';
    $.aligulac.registerModule(
    {
        moduleName: moduleName,
        aliasesAttribute: ['data-apmi', 'data-aligulac-predict-match-by-id'],
        parameters: [
            {
                bo: 3
            }
        ],
        logic: function (params) {
            return getPredictMatchByIds(params);
        },
        load: function (obj) {
            var $moduleElement = obj.clone();
            var pmparams = $moduleElement
                .selectValuableAttribute($.aligulac.selectModuleByName(moduleName).aliasesAttribute)
                .split(',');
            $.aligulac.runModule({
                mode: moduleName,
                $domElement: $moduleElement,
                parameters: {
                    player1: pmparams[0],
                    player2: pmparams[1],
                    bo: pmparams[2]
                },
                compareParams: function () {
                    return this.parameters.player1 + ',' + this.parameters.player2 + ',' + this.parameters.bo;
                }
            });
        },
        markup:
        {
            predictMatch: '<div class="predict-match-score"><div class="col1 player1"></div>' +
                '<div class="col2 player2"></div>{score-predictions}' +
                '<div class="col1 score-summary">{aligulac-score-summary-prediction1}%</div>' +
                '<div class="col2 score-summary">{aligulac-score-summary-prediction2}%</div></div>',
            scorePredictionLine: '<div class="col1">{aligulac-percent1}% {aligulac-score1}</div><div class="col2">{aligulac-score2} {aligulac-percent2}%</div>'
        }
    });
    //module realization
    var getPredictMatchByIds = function (params) {
        var deferred = $.Deferred();
        if ((params.parameters.player1) && (params.parameters.player2)) {
            $.ajax({
                type: 'GET',
                url: aligulacConfig.aligulacApiRoot +
                    'predictmatch/' +
                    params.parameters.player1 + ',' + params.parameters.player2 +
                    '/?callback=?',
                dataType: 'json',
                data:
                {
                    apikey: aligulacConfig.apiKey,
                    bo: params.parameters.bo
                },
            }).success(function (ajaxData) {
                $(this).aligulac.extensions.predictMatchTable(params, ajaxData, params.$domElement);
                deferred.resolve({ result: params.$domElement.html() });
            });
        }
        return deferred;
    };

    $.fn.aligulac.extensions.predictMatchTable = function (params, ajaxData, _self) {
        var domElement = _self;
        var markup = $.aligulac.selectModuleByName(moduleName).markup;
        ajaxData.pla.id = params.parameters.player1;
        ajaxData.plb.id = params.parameters.player2;
        domElement.html(markup.predictMatch);
        domElement.find('.player1').aligulac.extensions.playerLink({
            mode: 'player-link-by-id',
            parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false, playerId: ajaxData.pla.id }
        }, ajaxData.pla, domElement.find('.player1'));
        domElement.find('.player2').aligulac.extensions.playerLink({
            mode: 'player-link-by-id',
            parameters: { showFlag: true, showRace: true, showTeam: false, showPopup: false, playerId: ajaxData.plb.id }
        }, ajaxData.plb, domElement.find('.player2'));

        var aligulacResult = domElement.html();

        var scorePredictions = '';
        for (var i = 0; i < ajaxData.outcomes.length / 2; i++) {
            scorePredictions += markup.scorePredictionLine.replace('{aligulac-score1}', ajaxData.outcomes[i].sca + '-' + ajaxData.outcomes[i].scb)
                .replace('{aligulac-score2}', ajaxData.outcomes[(ajaxData.outcomes.length / 2) + i].sca + '-' + ajaxData.outcomes[(ajaxData.outcomes.length / 2) + i].scb)
                .replace('{aligulac-percent1}', Math.percentToNumber(ajaxData.outcomes[i].prob))
                .replace('{aligulac-percent2}', Math.percentToNumber(ajaxData.outcomes[(ajaxData.outcomes.length / 2) + i].prob));
        }
        aligulacResult = aligulacResult.replace('{score-predictions}', scorePredictions)
            .replace('{aligulac-score-summary-prediction1}', Math.percentToNumber(ajaxData.proba))
            .replace('{aligulac-score-summary-prediction2}', Math.percentToNumber(ajaxData.probb));
        domElement.html(aligulacResult);
    };
});