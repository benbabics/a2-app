define([ "globals", "backbone", "utils", "facade", "models/DriverModel", "collections/AjaxCollection" ],
    function (globals, Backbone, utils, facade, DriverModel, AjaxCollection) {

        "use strict";

        var DriverCollection = AjaxCollection.extend({
            model: DriverModel,
            isAllResults: true,
            pageNumber: globals.driverSearch.constants.DEFAULT_PAGE_NUMBER,
            pageSize: globals.driverSearch.constants.DEFAULT_PAGE_SIZE,
            url: globals.driverSearch.constants.WEBSERVICE,

            initialize: function () {
                DriverCollection.__super__.initialize.apply(this, arguments);

                // set the isAllResults property whenever the collection changes
                this.on("add change remove reset", function () {
                    if (!this.length) {
                        this.isAllResults = true;
                    }
                }, this);
            },

            parse: function (response) {
                var returnValue = DriverCollection.__super__.parse.apply(this, arguments);

                this.isAllResults = this.pageSize >= this.totalResults;

                return returnValue;
            },

            fetch: function (options) {
                options.pageSize = this.pageSize;
                options.pageNumber = this.pageNumber;

                this.isAllResults = false;

                DriverCollection.__super__.fetch.call(this, options);
            },

            resetPage: function () {
                this.pageSize = globals.driverSearch.constants.DEFAULT_PAGE_SIZE;
            },

            showAll: function () {
                this.pageSize = globals.driverSearch.constants.SHOW_ALL_PAGE_SIZE;
            },
        });

        return DriverCollection;
    });
