define(["backbone", "mustache", "utils", "globals", "text!tmpl/invoice/summary.html"],
    function (Backbone, Mustache, utils, globals, pageTemplate) {

        "use strict";


        var InvoiceSummaryView = Backbone.View.extend({
            el: "#invoiceSummary",

            template: pageTemplate,

            makePaymentAvailabilityModel: null,
            userModel: null,

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);

                if (options) {
                    if (options.makePaymentAvailabilityModel) {
                        this.makePaymentAvailabilityModel = options.makePaymentAvailabilityModel;
                    }
                    if (options.userModel) {
                        this.userModel = options.userModel;
                    }
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");
                $content.html(Mustache.render(this.template, this.getConfiguration()));
                this.$el.trigger("create");
            },

            getConfiguration: function () {
                var invoiceSummaryConfiguration = utils._.extend({}, utils.deepClone(globals.invoiceSummary.configuration)),
                    user = this.userModel.toJSON(),
                    invoiceSummary = this.model.toJSON(),
                    makePaymentAvailability = this.makePaymentAvailabilityModel.toJSON();

                invoiceSummaryConfiguration.accountNumber.value = invoiceSummary.accountNumber;
                invoiceSummaryConfiguration.availableCredit.value = utils.formatCurrency(invoiceSummary.availableCredit);
                invoiceSummaryConfiguration.currentBalance.value = utils.formatCurrency(invoiceSummary.currentBalance);
                invoiceSummaryConfiguration.currentBalance.asOfValue = invoiceSummary.currentBalanceAsOf;

                invoiceSummaryConfiguration.paymentDueDate.value = invoiceSummary.paymentDueDate;
                invoiceSummaryConfiguration.minimumPaymentDue.value = utils.formatCurrency(invoiceSummary.minimumPaymentDue);
                invoiceSummaryConfiguration.invoiceNumber.value = invoiceSummary.invoiceNumber;
                invoiceSummaryConfiguration.closingDate.value = invoiceSummary.closingDate;

                if (makePaymentAvailability.shouldDisplayDirectDebitEnabledMessage) {
                    invoiceSummaryConfiguration.unableToMakePaymentMessage =
                        globals.invoiceSummary.constants.DIRECT_DEPOSIT_ENABLED;
                } else if (makePaymentAvailability.shouldDisplayBankAccountSetupMessage) {
                    invoiceSummaryConfiguration.unableToMakePaymentMessage =
                        globals.invoiceSummary.constants.MUST_SET_UP_BANKS;
                } else if (makePaymentAvailability.shouldDisplayOutstandingPaymentMessage) {
                    invoiceSummaryConfiguration.unableToMakePaymentMessage =
                        globals.invoiceSummary.constants.PAYMENT_ALREADY_SCHEDULED;
                }

                invoiceSummaryConfiguration.makePaymentButton.visible = makePaymentAvailability.makePaymentAllowed;

                return {
                    "invoiceSummary": invoiceSummaryConfiguration,
                    "permissions"   : user.permissions
                };
            }
        });


        return InvoiceSummaryView;
    });
