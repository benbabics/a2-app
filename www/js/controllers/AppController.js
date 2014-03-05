define([ "jclass", "utils", "routers/AppRouter", "views/AppView", "models/AppModel"],
    function (JClass, utils, AppRouter, AppView, AppModel) {

        "use strict";


        var AppController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        AppController = JClass.extend({
            appRouter: null,
            appView: null,
            appModel: null,

            construct: function () {
            },

            init: function () {
                // cache router instance
                this.appRouter = new AppRouter();

                // cache model & view instances
                this.appModel = AppModel.getInstance();
                this.appView  = new AppView({
                    model: this.appModel,
                    el   : document.body
                });
            },

            ready: function () {
                this.appRouter.start();
                this.appView.render();
                document.addEventListener("offline", this.onOffline.bind(this), false);

                // now that everything is ready, hide the splashscreen
                setTimeout(function () {
                    if (navigator.splashscreen) {
                        navigator.splashscreen.hide();
                    }
                }, 2000);
            },

            onOffline: function () {
                this.checkConnection();
            },

            checkConnection: function (callback) {
                if (utils.hasNetworkConnection() === true) {
                    this.appView.closeCheckConnection();
                    if (utils.isFn(callback)) {
                        callback();
                    }
                }
                else {
                    var self = this;
                    this.appView.navigateCheckConnection(function () {
                        // Let's act like we have to spend a couple of seconds seeing if there is a connection
                        self.appView.showLoadingIndicator.call(self, false);
                        setTimeout(function () {
                            self.appView.hideLoadingIndicator.call(self, false);
                            self.checkConnection.call(self, callback);
                        }, 2000);
                    });
                }
            },

            alert: function (options) {
                this.appView.displayDialog(options);
            }
        }, classOptions);


        return new AppController();
    });
