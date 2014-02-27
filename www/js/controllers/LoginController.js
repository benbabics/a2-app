define(["utils", "jclass", "views/LoginView", "models/LoginModel"],
    function (utils, JClass, LoginView, LoginModel) {

        "use strict";


        var LoginController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        LoginController = JClass.extend({

            __loginView: null,
            __loginModel: null,

            construct: function () {
            },

            init: function () {
                // create model
                this.__loginModel = new LoginModel();

                // create view
                this.__loginView = new LoginView();
            },

            navigate: function () {
                utils.changePage(this.__loginView.$el);
            },

            getLoginModel: function () {
                return this.__loginModel;
            },

            getLoginView: function () {
                return this.__loginView;
            }
        }, classOptions);


        return new LoginController();
    });