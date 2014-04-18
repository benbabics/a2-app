define(["globals", "collections/AjaxCollection"],
    function (globals, AjaxCollection) {

        "use strict";

        var AjaxSearchCollection = AjaxCollection.extend({
            totalResults: null,

            parse: function (response) {
                var data = AjaxSearchCollection.__super__.parse.call(this, response);

                this.totalResults = data.totalResults;

                return data.searchResults;
            },

            fetch: function (options) {
                this.totalResults = null;

                AjaxSearchCollection.__super__.fetch.call(this, options);
            },
        });

        return AjaxSearchCollection;
    });
