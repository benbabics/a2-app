define(["utils", "jclass", "views/LoginView", "models/LoginModel", "models/UserModel"],
    function (utils, JClass, LoginView, LoginModel, UserModel) {

        "use strict";


        var LoginController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        LoginController = JClass.extend({

            loginView: null,
            userModel: null,

            construct: function () {
            },

            init: function () {
                this.userModel = UserModel.getInstance();

                // create view
                this.loginView = new LoginView({
                    model: new LoginModel()
                });

                // listen for events
                this.loginView.on("loginSuccess", this.setAuthentication, this);
                this.loginView.on("loginFailure", this.clearAuthentication, this);
            },

            navigate: function () {
                utils.changePage(this.loginView.$el, null, null, true);
            },

            setAuthentication: function (authenticationResponse) {

                // TODO: set properties on the UserModel

                this.userModel.set("isAuthenticated", true);
            },

            clearAuthentication: function () {
                // Clear out any previously stored info about the User
                this.userModel.reset();
            }
        }, classOptions);


        return new LoginController();
    });