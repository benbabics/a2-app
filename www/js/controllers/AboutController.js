define(["jclass", "utils", "views/AboutView", "models/AppModel"],
    function (JClass, utils, AboutView, AppModel) {

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
            },

            navigate: function () {
                utils.changePage(this.aboutView.$el, null, null, true);
            }
        }, classOptions);


        return new AboutController();
    });