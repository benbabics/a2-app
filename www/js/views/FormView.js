define(["backbone", "globals", "facade", "utils", "mustache", "backbone-validation"],
    function (Backbone, globals, facade, utils, Mustache) {

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

                // set context
                utils._.bindAll(this, "handleValidationError", "handleInputChanged", "submitForm");

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

            formatRequiredFields: function () {
                var $requiredField,
                    $fieldLabel;

                // Iterate over the model's Validation Rules
                utils._.each(this.model.validation, function (validationRules, fieldName, list) {

                    // If the field is designated as required
                    if (validationRules.required) {

                        // Find the label for the required field
                        $requiredField = this.$el.find("[name='" + fieldName + "']");
                        $fieldLabel = $requiredField.prevAll("label[for='" + $requiredField.attr("id") + "']");

                        // Append an asterisk denoting the field is required
                        $fieldLabel.append("<span class='required'>*</span>");
                    }

                }, this);
            },

            convertErrorsToUnorderedList: function (error) {
                var errorMessages =  "<ul>";
                utils._.each(error, function (value, key, list) {
                    errorMessages += "<li>" + value + "</li>";
                });
                errorMessages +=  "</ul>";

                return errorMessages;
            },

            /*
             * Event Handlers
             */
            handleInputChanged: function (evt) {
                var target = evt.target;
                this.updateAttribute(target.name, target.value);
            },

            handleValidationError: function (model, error) {
                var message = globals.VALIDATION_ERRORS.HEADER + this.convertErrorsToUnorderedList(error);

                facade.publish("app", "alert", {
                    title            : globals.VALIDATION_ERRORS.TITLE,
                    message          : message,
                    primaryBtnLabel  : globals.DIALOG.DEFAULT_BTN_TEXT
                });
            },

            submitForm: function (evt) {
                evt.preventDefault();
                this.model.save();
            }
        });


        return FormView;
    });
