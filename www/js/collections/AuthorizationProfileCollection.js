define([ "globals", "models/AuthorizationProfileModel", "collections/AjaxCollection" ],
    function (globals, AuthorizationProfileModel, AjaxCollection) {

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

                AuthorizationProfileCollection.__super__.fetch.call(this, {});
            }
        });

        return AuthorizationProfileCollection;
    });
