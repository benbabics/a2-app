define(["utils", "globals", "jclass", "views/LoginView", "models/LoginModel", "models/UserModel"],
    function (utils, globals, JClass, LoginView, LoginModel, UserModel) {

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

                // set context
                utils._.bindAll(this, "navigate", "setAuthentication");

                // listen for events
                this.loginView.on("loginSuccess", this.setAuthentication, this);
                this.loginView.on("loginFailure", this.clearAuthentication, this);
            },

            navigate: function () {
                utils.changePage(this.loginView.$el, null, null, true);
            },

            setAuthentication: function (authenticationResponse) {

                //TODO - Replace with setting actual properties on the User
                this.userModel.set({
                    authenticated: true,
                    firstName: "First Name",
                    email: "Emails@wexinc.com",
                    selectedCompany: {
                        name: "Company Name",
                        wexAccountNumber: "WEX Account Number"
                    }
                });

                this.userModel.set("isAuthenticated", true);
            },

            clearAuthentication: function () {
                // Clear out any previously stored info about the User
                this.userModel.reset();
            },

            logout: function () {
                var self = this;

                utils
                    .when(
                        utils.post(globals.WEBSERVICE.LOGOUT.URL) // when the request to logout is posted
                    )
                    .always(function () {
                        self.clearAuthentication();
                        self.navigate();
                        self.loginView.hideLoadingIndicator();
                    });
            }
        }, classOptions);


        return new LoginController();
    });