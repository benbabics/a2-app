define(["globals", "utils", "facade", "jclass", "models/UserModel", "models/ContactUsModel", "views/ContactUsView"],
    function (globals, utils, facade, JClass, UserModel, ContactUsModel, ContactUsView) {

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
                    message        : sendMessageResponse.message.text,
                    primaryBtnLabel: globals.DIALOG.DEFAULT_BTN_TEXT,
                    popupafterclose:   function () {
                        window.history.back();
                    }
                });
            }
        }, classOptions);


        return new ContactUsController();
    });