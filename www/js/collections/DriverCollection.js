define([ "globals", "backbone", "utils", "facade", "models/UserModel", "models/DriverModel",
         "collections/AjaxSearchCollection" ],
    function (globals, Backbone, utils, facade, UserModel, DriverModel, AjaxSearchCollection) {

        "use strict";

        var DriverCollection = AjaxSearchCollection.extend({
            model: DriverModel,
            isAllResults: true,
            pageNumber: globals.driverSearch.constants.DEFAULT_PAGE_NUMBER,
            pageSize: globals.driverSearch.constants.DEFAULT_PAGE_SIZE,

            url: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  +
                    UserModel.getInstance().get("selectedCompany").get("accountId") +
                    globals.WEBSERVICE.DRIVER_PATH;
            },

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

            /***
             * Override the Backbone fetch function
             *
             * @param options - The result of driverModel.toJSON() which has attributes that cannot be searched on
             */
            fetch: function (options) {
                var overrodeOptions = {};

                // Copy over the attributes that can be used for searching
                overrodeOptions.firstName = options.firstName;
                overrodeOptions.lastName = options.lastName;
                overrodeOptions.id = options.id;
                overrodeOptions.status = options.status;
                if (options.department) {
                    overrodeOptions.departmentId = options.department.id;
                }
                overrodeOptions.pageSize = this.pageSize;
                overrodeOptions.pageNumber = this.pageNumber;

                this.isAllResults = false;

                DriverCollection.__super__.fetch.call(this, overrodeOptions);
            },

            resetPage: function () {
                this.pageSize = globals.driverSearch.constants.DEFAULT_PAGE_SIZE;
            },

            showAll: function () {
                this.pageSize = globals.driverSearch.constants.SHOW_ALL_PAGE_SIZE;
            }
        });

        return DriverCollection;
    });
