define(["backbone", "utils", "mustache", "globals", "text!tmpl/login/page.html", "backbone-validation"],
    function (Backbone, utils, Mustache, globals, pageTemplate) {

        "use strict";


        var LoginView;
        LoginView = Backbone.View.extend({

            el: "#login",

            template: pageTemplate,

            events: {
                "change :input"         : "handleInputChanged",
                "click #submitLogin-btn": "submitLogin",
                "submit #loginForm"     : "submitLogin" // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
            },

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // Bind the Validation between the View and the Model
                Backbone.Validation.bind(this);

                // Set handlers for model events
                this.model.on("invalid", this.handleValidationError);

                // cache the template
                Mustache.parse(this.template);

                // create page
                this.pageCreate();
            },

            pageCreate: function () {
                var $content = this.$el.find(":jqmData(role=content)"),
                    configuration;

                // Merge the Login Form Configuration with the Validation Rules
                configuration = utils.$.extend(true, globals.login.configuration, this.model.validation);

                $content.html(Mustache.render(this.template, configuration));
            },

            updateAttribute: function (attributeName, attributeValue) {
                this.model.set(attributeName, attributeValue);
            },

            /*
             * Event Handlers
             */
            handleInputChanged: function (evt) {
                var target = evt.target;
                this.updateAttribute(target.name, target.value);
            },

            handleValidationError: function (model, error) {
                var message = "The following fields are required: \n"; // TODO: put in globals

                utils._.each(error, function (value, key, list) {
                    message += value + "\n";
                });

                // TODO: Use the native alert
                alert(message);
            },

            submitLogin: function (evt) {
                evt.preventDefault();
                this.model.save();
            }
        });


        return LoginView;
    });
