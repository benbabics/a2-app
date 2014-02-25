define(["jclass", "views/AboutView", "models/AppModel"],
    function (JClass, AboutView, AppModel) {

        "use strict";


        var AboutController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        AboutController = JClass.extend({
            aboutView: null,

            construct: function () {
            },

            init: function () {
                // create view
                this.aboutView = new AboutView({
                    model: AppModel.getInstance()
                });
            }
        }, classOptions);


        return new AboutController();
    });