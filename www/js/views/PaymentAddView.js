define(["backbone", "utils", "facade", "mustache", "globals", "views/ValidationFormView",
        "text!tmpl/payment/paymentAdd.html", "text!tmpl/payment/paymentChangeDetails.html"],
    function (Backbone, utils, facade, Mustache, globals, ValidationFormView,
              pageTemplate, paymentChangeDetailsTemplate) {

        "use strict";


        var PaymentAddView = ValidationFormView.extend({
            el: "#paymentAdd",

            template: pageTemplate,
            addDetailsTemplate: paymentChangeDetailsTemplate,

            invoiceSummaryModel: null,
            userModel: null,

            events: utils._.extend({}, ValidationFormView.prototype.events, {
                "click #submitPaymentAdd-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #paymentAddForm"     : "submitForm"
            }),

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the add details template
                Mustache.parse(this.addDetailsTemplate);

                // set context
                utils._.bindAll(this, "handlePageBeforeShow");

                if (options) {
                    if (options.invoiceSummaryModel) {
                        this.invoiceSummaryModel = options.invoiceSummaryModel;
                    }
                    if (options.userModel) {
                        this.userModel = options.userModel;
                    }
                }

                // jQM Events
                this.$el.on("pagebeforeshow", this.handlePageBeforeShow);
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                this.resetModel();

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.setupDatepicker();
                this.formatRequiredFields();

                $content.trigger("create");
            },

            setupDatepicker: function () {
                this.$el.find("#scheduledDate").date({
                    minDate: this.getDefaultPaymentDate().toDate(),
                    beforeShowDay: utils.$.datepicker.noWeekends
                });
            },

            getConfiguration: function () {
                var paymentConfiguration = utils._.extend({}, utils.deepClone(globals.paymentAdd.configuration)),
                    user = this.userModel.toJSON(),
                    bankAccountListValues = [];

                utils._.each(user.selectedCompany.bankAccounts, function (bankAccount) {
                    bankAccountListValues.push({
                        "id"      : bankAccount.id,
                        "name"    : bankAccount.name,
                        "selected": bankAccount.defaultBank
                    });
                });

                paymentConfiguration.scheduledDate.value = this.model.get("scheduledDate");
                paymentConfiguration.scheduledDate.minValue = this.getDefaultPaymentDate().toDate();
                paymentConfiguration.amount.value = this.model.get("amount");

                paymentConfiguration.bankAccount.enabled = bankAccountListValues.length > 1;
                paymentConfiguration.bankAccount.values = bankAccountListValues;

                return paymentConfiguration;
            },

            getAddDetailsConfiguration: function (response) {
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

            findDefaultBankAccount: function () {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("bankAccounts").findWhere({"defaultBank": true});
            },

            findBankAccount: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("bankAccounts").findWhere({"id": id});
            },

            resetModel: function () {
                PaymentAddView.__super__.resetModel.apply(this, arguments);

                this.model.set("paymentDueDate", this.invoiceSummaryModel.get("paymentDueDate"));
                this.model.set("minimumPaymentDue", this.invoiceSummaryModel.get("minimumPaymentDue"));
                this.model.set("amount", this.invoiceSummaryModel.get("minimumPaymentDue"));
                this.model.set("scheduledDate", this.getDefaultPaymentDate().format("MM/DD/YYYY"));
                this.model.set("bankAccount", this.findDefaultBankAccount());
            },

            getDefaultPaymentDate: function () {
                var defaultPaymentDate = utils.moment();

                if (defaultPaymentDate.day() === 0) {  // Sunday
                    return defaultPaymentDate.add("days", 1);
                }
                if (defaultPaymentDate.day() === 6) { // Saturday
                    return defaultPaymentDate.add("days", 2);
                }

                return defaultPaymentDate;
            },

            pageBeforeShow: function () {
                this.resetForm();
            },

            /*
             * Event Handlers
             */
            handlePageBeforeShow: function (evt) {
                this.pageBeforeShow();
            },

            handleInputChanged: function (evt) {
                var target = evt.target;
                if (target.name === "bankAccount") {
                    this.updateAttribute("bankAccount", this.findBankAccount(target.value));
                } else {
                    PaymentAddView.__super__.handleInputChanged.apply(this, arguments);
                }
            },

            submitForm: function (evt) {
                var self = this;

                evt.preventDefault();

                this.model.add({
                    success: function (model, response) {
                        var message =
                            Mustache.render(self.addDetailsTemplate, self.getAddDetailsConfiguration(response));

                        self.trigger("paymentAddSuccess", message);
                    }
                });
            }
        });


        return PaymentAddView;
    });
