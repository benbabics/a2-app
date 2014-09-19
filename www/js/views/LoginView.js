define(["backbone", "utils", "facade", "mustache", "globals", "views/ValidationFormView",
        "text!tmpl/login/page.html", "backbone-validation"],
    function (Backbone, utils, facade, Mustache, globals, ValidationFormView, pageTemplate) {

        "use strict";


        var LoginView = ValidationFormView.extend({
            el: "#login",

            template: pageTemplate,

            events: utils._.extend({}, ValidationFormView.prototype.events, {
                "click #submitLogin-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #loginForm"     : "submitForm"
            }),

            pageCreate: function () {
                var $content = this.$el.find(".ui-content");

                $content.html(Mustache.render(this.template, globals.login.configuration));

                this.formatRequiredFields();

                $content.enhanceWithin();
            },

            /*
             * Event Handlers
             */
            submitForm: function (evt) {
                var self = this;

                evt.preventDefault();

                this.model.save(this.model.toJSON(), {
                    success: function (model, response, options) {

                        self.trigger("loginSuccess", response);

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
