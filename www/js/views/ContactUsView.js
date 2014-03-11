define(["backbone", "utils", "facade", "mustache", "globals", "views/FormView",
        "text!tmpl/contactUs/page.html", "backbone-validation"],
    function (Backbone, utils, facade, Mustache, globals, FormView, pageTemplate) {

        "use strict";


        var ContactUsView = FormView.extend({
            el: "#contactUs",

            template: pageTemplate,

            userModel: null,

            events: utils._.extend({}, FormView.prototype.events, {
                "click #submitContactUs-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #contactUsForm"     : "submitForm"
            }),

            initialize: function (options) {
                // call super
                ContactUsView.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.formatRequiredFields();
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
                    },
                    error: function () {
                        self.trigger("contactUsFailure");
                    }
                });
            }
        });


        return ContactUsView;
    });
