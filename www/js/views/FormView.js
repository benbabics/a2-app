define(["backbone", "utils", "mustache", "backbone-validation"],
    function (Backbone, utils, Mustache) {

        "use strict";


        var FormView;
        FormView = Backbone.View.extend({

            events: {
                "change :input": "handleInputChanged"
            },

            initialize: function () {
                // call super
                FormView.__super__.initialize.apply(this, arguments);

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
                // no-op - should be overridden
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
                // no-op - should be overridden
            },

            submitForm: function (evt) {
                evt.preventDefault();
                this.model.save();
            }
        });


        return FormView;
    });
