define(["jclass", "views/AboutView", "models/AppModel"],
    function (JClass, AboutView, AppModel) {

        "use strict";


        var AboutController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        AboutController = JClass.extend({
            aboutView: null,
            appModel: null,

            construct: function () {
            },

            init: function () {
                // create model
                this.appModel = AppModel.getInstance();

                // create view
                this.aboutView = new AboutView();
            }
        }, classOptions);


        return new AboutController();
    });