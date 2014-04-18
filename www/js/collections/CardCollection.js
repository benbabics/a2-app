define([ "globals", "backbone", "utils", "facade", "models/UserModel", "models/CardModel",
        "collections/AjaxSearchCollection" ],
    function (globals, Backbone, utils, facade, UserModel, CardModel, AjaxSearchCollection) {

        "use strict";

        var CardCollection = AjaxSearchCollection.extend({
            model: CardModel,
            isAllResults: true,
            pageNumber: globals.cardSearch.constants.DEFAULT_PAGE_NUMBER,
            pageSize: globals.cardSearch.constants.DEFAULT_PAGE_SIZE,

            url: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  +
                    UserModel.getInstance().get("selectedCompany").get("accountId") +
                    globals.WEBSERVICE.CARD_PATH;
            },

            initialize: function () {
                CardCollection.__super__.initialize.apply(this, arguments);

                // set the isAllResults property whenever the collection changes
                this.on("add change remove reset", function () {
                    if (!this.length) {
                        this.isAllResults = true;
                    }
                }, this);
            },

            parse: function (response) {
                var returnValue = CardCollection.__super__.parse.apply(this, arguments);

                this.isAllResults = this.pageSize >= this.totalResults;

                return returnValue;
            },

            /***
             * Override the Backbone fetch function
             *
             * @param options - The result of cardModel.toJSON() which has attributes that cannot be searched on
             */
            fetch: function (options) {
                var overrodeOptions = {};

                // Copy over the attributes that can be used for searching
                overrodeOptions.number = options.id;
                overrodeOptions.customVehicleId = options.customVehicleId;
                overrodeOptions.licensePlateNumber = options.licensePlateNumber;
                overrodeOptions.status = options.status;
                if (options.department) {
                    overrodeOptions.departmentId = options.department.id;
                }
                overrodeOptions.pageSize = this.pageSize;
                overrodeOptions.pageNumber = this.pageNumber;

                this.isAllResults = false;

                CardCollection.__super__.fetch.call(this, overrodeOptions);
            },

            resetPage: function () {
                this.pageSize = globals.cardSearch.constants.DEFAULT_PAGE_SIZE;
            },

            showAll: function () {
                this.pageSize = globals.cardSearch.constants.SHOW_ALL_PAGE_SIZE;
            }
        });

        return CardCollection;
    });
