define(["backbone", "utils", "facade", "mustache", "globals", "views/ValidationFormView",
        "text!tmpl/contactUs/page.html", "backbone-validation"],
    function (Backbone, utils, facade, Mustache, globals, ValidationFormView, pageTemplate) {

        "use strict";


        var ContactUsView = ValidationFormView.extend({
            el: "#contactUs",

            template: pageTemplate,

            events: utils._.extend({}, ValidationFormView.prototype.events, {
                "click #submitContactUs-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #contactUsForm"     : "submitForm"
            }),

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.formatRequiredFields();

                $content.trigger("create");
            },

            getConfiguration: function () {
                var configuration = utils._.extend({}, utils.deepClone(globals.contactUs.configuration));

                // populate configuration details from the logged in user
                configuration.sender.value = this.userModel.get("email");
                configuration.authenticated = this.userModel.get("authenticated");

                // populate the model with the default value
                this.model.set("sender", configuration.sender.value);

                return configuration;
            },

            /*
             * Event Handlers
             */
            submitForm: function (evt) {
                var self = this;

                evt.preventDefault();

                this.model.save(this.model.toJSON(), {
                    success: function (model, response, options) {
                        self.trigger("contactUsSuccess", response);
                    }
                });
            }
        });


        return ContactUsView;
    });
