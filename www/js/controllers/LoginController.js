define(["facade", "utils", "globals", "controllers/BaseController", "views/LoginView", "models/LoginModel",
        "models/UserModel"],
    function (facade, utils, globals, BaseController, LoginView, LoginModel, UserModel) {

        "use strict";


        var LoginController,
            classOptions = {
                ctorName: "construct" // constructor name
            };

        LoginController = BaseController.extend({

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
                this.loginView.on("loginSuccess", this.handleLoginSuccess, this);
                this.loginView.on("loginFailure", this.clearAuthentication, this);
            },

            navigate: function () {
                utils.changePage(this.loginView.$el, null, null, true);
            },

            setAuthentication: function (authenticationResponse) {
                this.userModel.parse(utils._.extend(authenticationResponse, {"authenticated": true}));
            },

            clearAuthentication: function () {
                // Clear out any previously stored info about the User
                this.userModel.reset();
            },

            handleLoginSuccess: function (authenticationResponse) {
                this.setAuthentication(authenticationResponse);

                // once the user successfully logs in navigate to the Home page
                facade.publish("home", "navigate");
            },

            logout: function () {
                var self = this;

                this.loginView.showLoadingIndicator();

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