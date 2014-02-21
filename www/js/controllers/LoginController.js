define(["jclass", "views/LoginView", "models/LoginModel"],
    function (JClass, LoginView, LoginModel) {

        "use strict";


        var LoginController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        LoginController = JClass.extend({

            loginView: null,
            loginModel: null,

            construct: function () {
            },

            init: function () {
                // create model
                this.loginModel = new LoginModel();

                // create view
                this.loginView = new LoginView();
            }
        }, classOptions);


        return new LoginController();
    });