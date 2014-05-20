define(["controllers/BaseController", "views/AboutView", "models/AppModel"],
    function (BaseController, AboutView, AppModel) {

        "use strict";


        var AboutController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        AboutController = BaseController.extend({
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