define([ "globals", "backbone", "utils", "facade", "models/AuthorizationProfileModel", "collections/AjaxCollection" ],
    function (globals, Backbone, utils, facade, AuthorizationProfileModel, AjaxCollection) {

        "use strict";

        var AuthorizationProfileCollection = AjaxCollection.extend({
            model: AuthorizationProfileModel,

            /**
             * Override a Backbone function in order to set the url
             *
             * @param options - A CompanyModel.toJSON() of the company to get the auth profiles for
             */
            fetch: function (options) {
                this.url = globals.WEBSERVICE.ACCOUNTS.URL + "/" + options.accountId +
                    globals.WEBSERVICE.AUTH_PROFILES_PATH;

                AuthorizationProfileCollection.__super__.fetch.call(this, options);
            },

            toJSON: function () {
                var json = null,
                    index = 0;

                if (this.length > 0) {
                    json = [];
                    this.each(function (authorizationProfile) {
                        json[index] = authorizationProfile.toJSON();
                        index++;
                    }, this);
                }

                return json;
            }
        });

        return AuthorizationProfileCollection;
    });
