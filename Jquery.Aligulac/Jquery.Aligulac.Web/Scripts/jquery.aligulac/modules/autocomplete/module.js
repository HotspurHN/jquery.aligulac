// description: module for jquery.aligulac. requires module player-link-by-id
// used for display player info by name.
// parameters:
// bo - count of games default 3
// player1 - reqired. player id
// player2 - reqired. player id
// required jquery.ui

// module initialization
$(document).ready(function () {
    var moduleName = 'aligulac-autocomplete';
    $.aligulac.registerModule(
    {
        moduleName: moduleName,
        aliasesAttribute: ['data-aac', 'data-aligulac-autocomplete'],
        parameters: [
        ],
        logic: function (params) {
            return aligulacAutocomplete(params);
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
                    textBoxName: pmparams[0],
                    itemToSearch: pmparams[1],
                    searchKey: pmparams[2]
                },
                compareParams: function () {
                    return this.parameters.textBoxName + ',' + this.parameters.itemToSearch + ',' + this.parameters.searchKey;
                }
            });
        },
        markup:
        {
            aligulacTextBox: '<input type="text" name="{aligulac-textbox-name}" id="{aligulac-textbox-name}" value="" />'
        }
    });
    //module realization
    var aligulacAutocomplete = function (params) {
        var deferred = $.Deferred();
        if ((params.parameters.itemToSearch) && (params.parameters.searchKey) && (params.parameters.textBoxName)) {
            var markup = $.aligulac.selectModuleByName(moduleName).markup;
            params.$domElement.html(markup.aligulacTextBox.replace(/\{aligulac-textbox-name\}/g, params.parameters.textBoxName));

            deferred.resolve({ result: params.$domElement.html() });

            $(document).ready(function () {
                $($.aligulac.generateAttributeSelector(params.mode)).each(function () {
                    if ($(this).selectValuableAttribute($.aligulac.selectModuleByName(params.mode).aliasesAttribute) === params.compareParams()) {
                        $(this).find('input[type=text]').autocomplete({
                            source: function (request, response) {
                                $.ajax({
                                    type: 'GET',
                                    url: aligulacConfig.aligulacApiRoot + params.parameters.itemToSearch +
                                        '/?' +
                                        params.parameters.searchKey + '__icontains=' +
                                        request.term
                                        + '&callback=?',
                                    dataType: 'json',
                                    data:
                                    {
                                        apikey: aligulacConfig.apiKey,
                                    },
                                }).success(function(ajaxData) {
                                    response(ajaxData.objects);
                                });
                            },
                            minLength: 3,
                            select: function (event, ui) {
                                $("#" + params.parameters.textBoxName).val(ui.item[params.parameters.searchKey]);
                                return false;
                            }
                        }).data("ui-autocomplete")._renderItem = function (ul, item) {
                            return $("<li></li>")
                                .append("<a>" + aligulacAutocompleteTemplates(params.parameters.searchKey, item, params.parameters.itemToSearch) + "</a>")
                                .appendTo(ul);
                        };
                    }
                });
            });
        } else {
            deferred.resolve({ result: '' });
        }
        return deferred;
    };

    var aligulacAutocompleteTemplates = function (key, ajaxobject, searchItem) {
        switch (searchItem) {
        case 'player':
            return '<img src="{aligulac-flag}" /><img src="{aligulac-race}" />{aligulac-name}'.replace('{aligulac-flag}', aligulacConfig.flagsDirectory + ajaxobject.country.toLowerCase() + '.png')
            .replace('{aligulac-race}', aligulacConfig.racesDirectory + ajaxobject.race.toUpperCase() + '.png')
            .replace('{aligulac-name}', ajaxobject.tag);
        case 'team':
            return '{aligulac-name}'
            .replace('{aligulac-name}', ajaxobject.name);
        case 'event':
            return '{aligulac-name}'
            .replace('{aligulac-name}', ajaxobject.fullname);
            default:
                return ajaxobject[key];
        }
    };
});