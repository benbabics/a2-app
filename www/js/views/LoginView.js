define(["backbone", "utils", "facade", "mustache", "globals", "models/UserModel", "views/FormView", "text!tmpl/login/page.html", "backbone-validation"],
    function (Backbone, utils, facade, Mustache, globals, UserModel, FormView, pageTemplate) {

        "use strict";


        var LoginView;
        LoginView = FormView.extend({

            el: "#login",

            template: pageTemplate,

            events: utils._.extend({}, FormView.prototype.events, {
                "click #submitLogin-btn": "submitForm",
                "submit #loginForm"     : "submitForm" // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
            }),

            initialize: function () {
                // call super
                LoginView.__super__.initialize.apply(this, arguments);
            },

            pageCreate: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template, globals.login.configuration));

                this.formatRequiredFields();
            },

            /*
             * Event Handlers
             */
            submitForm: function (evt) {
                var self = this;

                evt.preventDefault();

                this.model.save(this.model.toJSON(), {
                    success: function (response) {
                        self.trigger("loginSuccess", response);

                        //TODO - Remove this
                        var userModel = UserModel.getInstance();
                        userModel.set({
                            authenticated: true,
                            firstName: "First Name",
                            email: "Emails@wexinc.com",
                            selectedCompany: {
                                name: "Company Name",
                                wexAccountNumber: "WEX Account Number"
                            }
                        });

                        // once the user successfully logs in navigate to the Home page
                        facade.publish("home", "navigate");

                        // Clear and reset the model so the login credentials and response are not persisted there
                        self.model.clear();
                        self.model.set(self.model.defaults);

                        // Reset the form
                        self.resetForm();
                    },
                    error: function () {
                        self.trigger("loginFailure");
                    }
                });
            }
        });


        return LoginView;
    });
