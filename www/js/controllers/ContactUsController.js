define(["globals", "utils", "facade", "controllers/BaseController", "models/UserModel",
        "models/ContactUsModel", "views/ContactUsView"],
    function (globals, utils, facade, BaseController, UserModel, ContactUsModel, ContactUsView) {

        "use strict";


        var ContactUsController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        ContactUsController = BaseController.extend({
            contactUsView: null,

            construct: function () {
            },

            init: function () {
                // create view
                this.contactUsView = new ContactUsView({
                    model: new ContactUsModel(),
                    userModel: UserModel.getInstance()
                });

                // listen for events
                this.contactUsView.on("contactUsSuccess", this.showConfirmation, this);
            },

            navigate: function () {
                this.contactUsView.render();
                utils.changePage(this.contactUsView.$el, null, null, true);
            },

            showConfirmation: function (sendMessageResponse) {
                facade.publish("app", "alert", {
                    title          : globals.contactUs.constants.SUCCESS_TITLE,
                    message        : sendMessageResponse.message,
                    primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT,
                    popupafterclose:   function () {
                        window.history.back();
                    }
                });
            }
        }, classOptions);


        return new ContactUsController();
    });