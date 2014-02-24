define([ "jclass", "routers/AppRouter", "views/AppView", "models/AppModel"],
    function (JClass, AppRouter, AppView, AppModel) {

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

                // navigate to the Login page
                this.appRouter.navigate("login", {trigger: true, replace: true}); // TODO: remove once version update checking is added

                // now that everything is ready, hide the splashscreen
                setTimeout(function () {
                    if (navigator.splashscreen) {
                        navigator.splashscreen.hide();
                    }
                }, 2000);
            }
        }, classOptions);


        return new AppController();
    });
