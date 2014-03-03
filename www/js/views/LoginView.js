define(["backbone", "utils", "facade", "mustache", "globals", "views/FormView", "text!tmpl/login/page.html", "backbone-validation"],
    function (Backbone, utils, facade, Mustache, globals, FormView, pageTemplate) {

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
            handleValidationError: function (model, error) {
                var message = "The following fields are required: \n"; // TODO: put in globals

                utils._.each(error, function (value, key, list) {
                    message += value + "\n";
                });

                // TODO: Use the native alert
                alert(message);
            },

            submitForm: function (evt) {
                // call super
                LoginView.__super__.submitForm.apply(this, arguments);

                // TODO - Need to authenticate the user before navigating to the home page

                facade.publish("home", "navigate");
            }
        });


        return LoginView;
    });
