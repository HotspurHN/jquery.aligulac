// description: module for jquery.aligulac. requires module player-link-by-id, player-link-by-name, predict-match-by-player-name
// used for display player info by name.
// parameters:
// bo - count of games default 3
// player1name - reqired. player name
// player2name - reqired. player name

// module initialization
$(document).ready(function () {
    var moduleName = "predict-match-by-player-name";
    $.aligulac.registerModule(
    {
        moduleName: moduleName,
        aliasesAttribute: ["data-apmn", "data-aligulac-predict-match-by-name"],
        parameters: [{bo: 3}],
        logic: function(params) {
            return getPredictMatchByNames(params);
        },
        load: function (obj) {
            var $moduleElement = obj.clone();
            var pmparams = $moduleElement.selectValuableAttribute($.aligulac.selectModuleByName(moduleName).aliasesAttribute)
                .split(',');
            $.aligulac.runModule({
                mode: moduleName,
                $domElement: $moduleElement,
                parameters: {
                    player1name: pmparams[0],
                    player2name: pmparams[1],
                    bo: pmparams[2]
                },
                compareParams: function() {
                    return this.parameters.player1name + ',' + this.parameters.player2name + ',' + this.parameters.bo;
                }
            });
        }
    });
//module realization
    var getPredictMatchByNames = function (params) {
        var deferred = $.Deferred();
        var domElement = params.$domElement;
        if ((params.parameters.player1name) && (params.parameters.player2name)) {
            $.ajax({
                type: "GET",
                url: aligulacConfig.aligulacApiRoot +
                    'player/' +
                    '?callback=?',
                dataType: "json",
                data:
                {
                    tag__iexact: params.parameters.player1name,
                    apikey: aligulacConfig.apiKey
                },
            }).success(function (ajaxData) {
                params.parameters.player1 = ajaxData.objects[0].id;
                $.ajax({
                    type: "GET",
                    url: aligulacConfig.aligulacApiRoot +
                        'player/' +
                        '?callback=?',
                    dataType: "json",
                    data:
                    {
                        tag__iexact: params.parameters.player2name,
                        apikey: aligulacConfig.apiKey
                    },
                }).success(function(ajaxData2) {
                    params.parameters.player2 = ajaxData2.objects[0].id;
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
                    }).success(function (ajaxData3) {
                        domElement.aligulac.extentions.predictMatchTable(params, ajaxData3, domElement);
                        deferred.resolve({ result: domElement .html()});
                    });
                });
            });
        }
        return deferred;
    };
});