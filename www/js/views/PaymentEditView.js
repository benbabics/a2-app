define(["backbone", "utils", "facade", "mustache", "globals", "views/ValidationFormView",
        "text!tmpl/payment/paymentEdit.html", "text!tmpl/payment/paymentChangeDetails.html"],
    function (Backbone, utils, facade, Mustache, globals, ValidationFormView, pageTemplate, paymentChangeDetailsTemplate) {

        "use strict";


        var PaymentEditView = ValidationFormView.extend({
            el: "#paymentEdit",

            template: pageTemplate,
            editDetailsTemplate: paymentChangeDetailsTemplate,

            invoiceSummaryModel: null,
            userModel: null,

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

                if (options) {
                    if (options.invoiceSummaryModel) {
                        this.invoiceSummaryModel = options.invoiceSummaryModel;
                    }
                    if (options.userModel) {
                        this.userModel = options.userModel;
                    }
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                this.updateModelFromSummary();

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.setupDatepicker();
                this.formatRequiredFields();

                this.$el.trigger("create");
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

            findBankAccount: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("bankAccounts").findWhere({"id": id});
            },

            updateModelFromSummary: function () {
                this.model.set("paymentDueDate", this.invoiceSummaryModel.get("paymentDueDate"));
                this.model.set("minimumPaymentDue", this.invoiceSummaryModel.get("minimumPaymentDue"));
            },

            getEarlistPaymentDate: function () {
                var defaultPaymentDate = utils.moment();

                if (defaultPaymentDate.day() === 0) {  // Sunday
                    return defaultPaymentDate.add("days", 1);
                }
                if (defaultPaymentDate.day() === 6) { // Saturday
                    return defaultPaymentDate.add("days", 2);
                }

                return defaultPaymentDate;
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

            submitForm: function (evt) {
                var self = this;

                evt.preventDefault();

                this.model.edit({
                    success: function (model, response) {
                        var message =
                            Mustache.render(self.editDetailsTemplate, self.getEditDetailsConfiguration(response));

                        self.trigger("paymentEditSuccess", message);
                    }
                });
            }
        });


        return PaymentEditView;
    });
