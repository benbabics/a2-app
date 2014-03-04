define(["utils", "jclass", "models/UserModel", "models/ContactUsModel", "views/ContactUsView"],
    function (utils, JClass, UserModel, ContactUsModel, ContactUsView) {

        "use strict";


        var ContactUsController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        ContactUsController = JClass.extend({
            contactUsModel: null,
            contactUsView: null,

            construct: function () {
            },

            init: function () {
                var userModel = UserModel.getInstance();

                this.contactUsModel = new ContactUsModel();

                // default the sender's email address to that of the logged in user
                this.contactUsModel.set("sender", userModel.get("email"));

                // create view
                this.contactUsView = new ContactUsView({
                    model: this.contactUsModel
                });
            },

            navigate: function () {
                this.contactUsView.render();
                utils.changePage(this.contactUsView.$el, null, null, true);
            }
        }, classOptions);


        return new ContactUsController();
    });