define(["backbone", "globals", "facade", "utils", "mustache",  "views/FormView", "backbone-validation"],
    function (Backbone, globals, facade, utils, Mustache, FormView) {

        "use strict";


        var ValidationFormView = FormView.extend({
            initialize: function () {
                // call super
                ValidationFormView.__super__.initialize.apply(this, arguments);

                // Bind the Validation between the View and the Model
                Backbone.Validation.bind(this);

                // set context
                utils._.bindAll(this, "handleValidationError");

                // Set handlers for model events
                this.model.on("invalid", this.handleValidationError); // when validation of the model fails
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
            handleValidationError: function (model, error) {
                var message = globals.VALIDATION_ERRORS.HEADER + this.convertErrorsToUnorderedList(error);

                facade.publish("app", "alert", {
                    title            : globals.VALIDATION_ERRORS.TITLE,
                    message          : message,
                    primaryBtnLabel  : globals.DIALOG.DEFAULT_BTN_TEXT
                });
            }
        });


        return ValidationFormView;
    });
