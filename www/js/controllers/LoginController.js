define(["utils", "jclass", "views/LoginView", "models/LoginModel"],
    function (utils, JClass, LoginView, LoginModel) {

        "use strict";


        var LoginController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        LoginController = JClass.extend({

            loginView: null,

            construct: function () {
            },

            init: function () {
                // create view
                this.loginView = new LoginView({
                    model: new LoginModel()
                });

            },

            navigate: function () {
                utils.changePage(this.loginView.$el, null, null, true);
            }
        }, classOptions);


        return new LoginController();
    });