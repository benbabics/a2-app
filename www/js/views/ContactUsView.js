define(["backbone", "utils", "facade", "mustache", "globals", "models/UserModel", "views/FormView",
        "text!tmpl/contactUs/page.html", "backbone-validation"],
    function (Backbone, utils, facade, Mustache, globals, UserModel, FormView, pageTemplate) {

        "use strict";


        var ContactUsView = FormView.extend({
            el: "#contactUs",

            template: pageTemplate,

            events: utils._.extend({}, FormView.prototype.events, {
                "click #submitContactUs-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #contactUsForm"     : "submitForm"
            }),

            initialize: function () {
                // call super
                ContactUsView.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)"),
                    configuration;

                configuration = utils._.extend({}, utils.deepClone(globals.contactUs.configuration));
                configuration.sender.value = this.model.get("sender");
                configuration.authenticated = UserModel.getInstance().get("authenticated");

                $content.html(Mustache.render(this.template, configuration));

                this.formatRequiredFields();
            },

            /*
             * Event Handlers
             */
            submitForm: function (evt) {
                //TODO - Need to handle success and error conditions of saving the model - POSTing data

                // call super
                ContactUsView.__super__.submitForm.apply(this, arguments);

                // TODO - Need to navigate to the contact us confirmation page on success
            }
        });


        return ContactUsView;
    });
