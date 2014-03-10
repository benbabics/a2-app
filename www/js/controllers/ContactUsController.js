define(["utils", "jclass", "models/UserModel", "models/ContactUsModel", "views/ContactUsView"],
    function (utils, JClass, UserModel, ContactUsModel, ContactUsView) {

        "use strict";


        var ContactUsController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        ContactUsController = JClass.extend({
            contactUsView: null,

            construct: function () {
            },

            init: function () {
                // create view
                this.contactUsView = new ContactUsView({
                    model: new ContactUsModel(),
                    userModel: UserModel.getInstance()
                });
            },

            navigate: function () {
                this.contactUsView.render();
                utils.changePage(this.contactUsView.$el, null, null, true);
            }
        }, classOptions);


        return new ContactUsController();
    });