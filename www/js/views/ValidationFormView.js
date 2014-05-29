define(["backbone", "globals", "facade", "utils", "mustache", "views/FormView", "backbone-validation"],
    function (Backbone, globals, facade, utils, Mustache, FormView) {

        "use strict";


        var ValidationFormView = FormView.extend({
            initialize: function () {
                // call super
                ValidationFormView.__super__.initialize.apply(this, arguments);

                // set context
                utils._.bindAll(this, "handleValidationError");
            },

            setModel: function (model) {
                // call super
                ValidationFormView.__super__.setModel.apply(this, arguments);

                if (this.model) {
                    // Bind the Validation between the View and the Model
                    Backbone.Validation.bind(this);

                    // Set handlers for model events
                    this.listenTo(this.model, "invalid", this.handleValidationError); // handle model validation failure
                }
            },

            formatRequiredFields: function () {
                // Iterate over the model's Validation Rules
                utils._.each(this.model.validation, function (validationRules, fieldName, list) {
                    if ($.isArray(validationRules)) {
                        utils._.each(validationRules, function (validationRule) {
                            if (this.isRequired(validationRule)) {
                                this.formatAsRequired(fieldName);
                            }
                        }, this);
                    }
                    else {
                        // If the field is designated as required
                        if (this.isRequired(validationRules)) {
                            this.formatAsRequired(fieldName);
                        }
                    }
                }, this);
            },

            isRequired: function (validationRule) {
                if (utils.isFn(validationRule.required)) {
                    return validationRule.required();
                }

                return validationRule.required;
            },

            formatAsRequired: function (fieldName) {
                var $requiredField,
                    $fieldLabel;

                // Find the label for the required field
                $requiredField = this.$el.find("[name='" + fieldName + "']");
                $fieldLabel = $requiredField.prevAll("label[for='" + $requiredField.attr("id") + "']");

                // Append an asterisk denoting the field is required
                $fieldLabel.append("<span class='required'>*</span>");
            },

            convertArrayToUnorderedList: function (errors) {
                var errorMessages =  "<ul>";
                utils._.each(errors, function (value, key, list) {
                    errorMessages += "<li>" + value + "</li>";
                });
                errorMessages +=  "</ul>";

                return errorMessages;
            },

            handleValidationWarning: function (model, warnings, callback) {
                var message = globals.VALIDATION_WARNINGS.HEADER +
                    this.convertArrayToUnorderedList(warnings) +
                    globals.VALIDATION_WARNINGS.FOOTER;

                facade.publish("app", "alert", {
                    title            : globals.VALIDATION_WARNINGS.TITLE,
                    message          : message,
                    primaryBtnLabel  : globals.VALIDATION_WARNINGS.PRIMARY_BUTTON_TEXT,
                    primaryBtnHandler: callback,
                    secondaryBtnLabel: globals.VALIDATION_WARNINGS.SECONDARY_BUTTON_TEXT
                });
            },

            /*
             * Event Handlers
             */
            handleValidationError: function (model, errors) {
                var message = globals.VALIDATION_ERRORS.HEADER + this.convertArrayToUnorderedList(errors);

                facade.publish("app", "alert", {
                    title            : globals.VALIDATION_ERRORS.TITLE,
                    message          : message,
                    primaryBtnLabel  : globals.DIALOG.DEFAULT_BTN_TEXT
                });
            }
        });


        return ValidationFormView;
    });
