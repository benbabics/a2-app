define(["backbone", "utils", "facade", "mustache", "globals", "views/ValidationFormView",
        "text!tmpl/payment/paymentEdit.html", "text!tmpl/payment/paymentChangeDetails.html"],
    function (Backbone, utils, facade, Mustache, globals, ValidationFormView, pageTemplate,
              paymentChangeDetailsTemplate) {

        "use strict";


        var PaymentEditView = ValidationFormView.extend({
            el: "#paymentEdit",

            template: pageTemplate,
            editDetailsTemplate: paymentChangeDetailsTemplate,

            invoiceSummaryModel: null,

            events: utils._.extend({}, ValidationFormView.prototype.events, {
                "click #submitPaymentEdit-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #paymentEditForm"     : "submitForm"
            }),

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the edit details template
                Mustache.parse(this.editDetailsTemplate);

                // set context
                utils._.bindAll(this, "savePayment");

                if (options && options.invoiceSummaryModel) {
                    this.invoiceSummaryModel = options.invoiceSummaryModel;
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                this.updateModelFromSummary();

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.setupDatepicker();
                this.formatRequiredFields();

                $content.trigger("create");
            },

            setupDatepicker: function () {
                this.$el.find("#scheduledDateEdit").date({
                    minDate: this.getEarlistPaymentDate().toDate(),
                    beforeShowDay: utils.$.datepicker.noWeekends
                });
            },

            getConfiguration: function () {
                var paymentConfiguration = utils._.extend({}, utils.deepClone(globals.paymentEdit.configuration)),
                    user = this.userModel.toJSON(),
                    payment = this.model.toJSON(),
                    bankAccountListValues = [];

                utils._.each(user.selectedCompany.bankAccounts, function (bankAccount) {
                    bankAccountListValues.push({
                        "id"      : bankAccount.id,
                        "name"    : bankAccount.name,
                        "selected": bankAccount.id === payment.bankAccount.id
                    });
                });

                paymentConfiguration.scheduledDate.value = payment.scheduledDate;
                paymentConfiguration.amount.value = payment.amount;

                paymentConfiguration.bankAccount.enabled = bankAccountListValues.length > 1;
                paymentConfiguration.bankAccount.values = bankAccountListValues;

                return {
                    "payment" : paymentConfiguration
                };
            },

            getEditDetailsConfiguration: function (response) {
                var paymentConfiguration =
                    utils._.extend({}, utils.deepClone(globals.paymentChangedDetails.configuration));

                // populate configuration details
                paymentConfiguration.scheduledDate.value = response.scheduledDate;
                paymentConfiguration.amount.value = utils.formatCurrency(response.amount);
                if (response.bankAccount) {
                    paymentConfiguration.bankAccountName.value = response.bankAccount.name;
                }
                paymentConfiguration.confirmationNumber.value = response.confirmationNumber;

                return {
                    "message": response.message,
                    "payment" : paymentConfiguration
                };
            },

            updateModelFromSummary: function () {
                this.model.set("paymentDueDate", this.invoiceSummaryModel.get("paymentDueDate"));
                this.model.set("minimumPaymentDue", this.invoiceSummaryModel.get("minimumPaymentDue"));
            },

            /*
             * Event Handlers
             */
            handleInputChanged: function (evt) {
                var target = evt.target;
                if (target.name === "bankAccount") {
                    this.updateAttribute("bankAccount", this.findBankAccount(target.value));
                } else {
                    PaymentEditView.__super__.handleInputChanged.apply(this, arguments);
                }
            },

            savePayment: function () {
                var self = this;

                this.model.edit({
                    success: function (model, response) {
                        var message =
                            Mustache.render(self.editDetailsTemplate, self.getEditDetailsConfiguration(response));

                        self.trigger("paymentEditSuccess", message);
                    }
                });
            },

            submitForm: function (evt) {
                var errors,
                    warnings;

                evt.preventDefault();

                errors = this.model.validate();
                if (errors) {
                    this.handleValidationError(this.model, errors);
                } else {
                    warnings = this.model.validateWarnings();
                    if (warnings) {
                        this.handleValidationWarning(this.model, warnings, this.savePayment);
                    } else {
                        this.savePayment();
                    }
                }
            }
        });


        return PaymentEditView;
    });
