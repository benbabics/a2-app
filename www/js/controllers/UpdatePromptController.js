define([ "utils", "globals", "facade", "jclass", "views/UpdatePromptView", "models/AppModel"],
    function (utils, globals, facade, JClass, UpdatePromptView, AppModel) {

        "use strict";


        var UpdatePromptController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        UpdatePromptController = JClass.extend({
            appModel: null,
            updatePromptView: null,

            construct: function () {
            },

            init: function () {
                var self = this;

                // cache view and model instance
                this.appModel = AppModel.getInstance();
                this.updatePromptView = new UpdatePromptView();

                utils.$(function () {
                    // Try to account for the buildVersion being set prior to getting here
                    // while also working if it gets set later
                    if (self.appModel.get("buildVersion") !== "Unknown") {
                        self.checkAppVersionStatus();
                    } else {
                        self.appModel.once("change:buildVersion", function () { self.checkAppVersionStatus(); });
                    }
                });
            },

            checkAppVersionStatus: function () {
                var self = this;

                utils
                    .when(
                        self.fetchAppVersionStatus() // get the application version status
                    )
                    .then(
                        function () {
                            if (self.appModel.get(globals.APP.constants.APP_VERSION_STATUS) === "fail") {
                                self.showPromptToUpdateFail();
                            } else if (self.appModel.get(globals.APP.constants.APP_VERSION_STATUS) === "warn" &&
                                    (self.appModel.get("lastWarnVersion") === null ||
                                    self.appModel.get("lastWarnVersion") !== self.appModel.get("buildVersion"))) {
                                self.showPromptToUpdateWarn();
                            } else {
                                facade.publish("login", "navigate");
                            }
                        }
                    );
            },

            fetchAppVersionStatus: function () {
                var deferred   = utils.Deferred(),
                    self = this;

                utils
                    .when(
                        utils.getJSON(this.getAppVersionStatusURL())
                    )
                    .always(function (status) {
                        deferred.resolve(
                            self.appModel.set(globals.APP.constants.APP_VERSION_STATUS, status)
                        );
                    });

                return deferred.promise();
            },

            getAppVersionStatusURL: function () {
                var key = globals.WEBSERVICE.APP_VERSION_STATUS;

                return key.URL +
                    "?" + key.VERSION_NUMBER + this.appModel.get("buildVersion") +
                    "&" + key.PLATFORM       + this.appModel.get("platform");
            },

            showPromptToUpdateFail: function () {
                this.updatePromptView.renderFail();
                utils.changePage(this.updatePromptView.$el);
            },

            showPromptToUpdateWarn: function () {
                this.updatePromptView.renderWarn();
                utils.changePage(this.updatePromptView.$el);
            }
        }, classOptions);


        return new UpdatePromptController();
    });
