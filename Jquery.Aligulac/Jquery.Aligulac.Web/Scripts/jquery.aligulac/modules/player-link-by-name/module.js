// description: module for jquery.aligulac. requires module player-link-by-id
// used for display player info by name.
// parameters:
// showFlag - display country flag of player (default true)
// showRace - display race of player (default true)
// showTeam - display primary team of player (default true)
// showPopup - default true
// playerName - reqired

// module initialization
$(document).ready(function () {
    var moduleName = 'player-link-by-name';
    $.aligulac.registerModule(
    {
        moduleName: moduleName,
        aliasesAttribute: ["data-aligulac-player-name", "data-apn"],
        parameters: [
            {
                showFlag: true,
                showRace: true,
                showTeam: true,
                showPopup: true
            }
        ],
        logic: function (params) {
            var deferred = $.Deferred();
            if (params.parameters.playerName) {
                return getPlayerLinkByName(params);
            } else {
                deferred.resolve({ result: '' });
            }
            return deferred;
        },
        load: function (obj) {
                    var $moduleElement = obj.clone();
                    $.aligulac.runModule({
                        mode: moduleName,
                        $domElement: $moduleElement,
                        parameters: {
                            playerName: $moduleElement.selectValuableAttribute($.aligulac.selectModuleByName(moduleName).aliasesAttribute),
                            showFlag: true,
                            showRace: true,
                            showTeam: true,
                            showPopup: false
                        },
                        compareParams: function() {
                            return this.parameters.playerName;
                        }
                    });
        }
    });
//module realization
    var getPlayerLinkByName = function (params) {
        var deferred = $.Deferred();
            $.ajax({
                type: "GET",
                url: aligulacConfig.aligulacApiRoot +
                    'player/' +
                    '?callback=?',
                dataType: "json",
                data:
                {
                    tag__iexact: params.parameters.playerName,
                    apikey: aligulacConfig.apiKey
                },
            }).success(function (ajaxData) {
                params.parameters.playerId = ajaxData.objects[0].id;
                params.$domElement.aligulac.extentions.playerLink(params, ajaxData.objects[0], params.$domElement);
                deferred.resolve({
                        result: params.$domElement.html()
                });
            });
        return deferred;
    };
});