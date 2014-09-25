define(["backbone", "mustache", "utils", "globals", "views/BaseView", "text!tmpl/invoice/summary.html"],
    function (Backbone, Mustache, utils, globals, BaseView, pageTemplate) {

        "use strict";


        var InvoiceSummaryView = BaseView.extend({
            el: "#invoiceSummary",

            template: pageTemplate,

            makePaymentAvailabilityModel: null,

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                if (options && options.makePaymentAvailabilityModel) {
                    this.makePaymentAvailabilityModel = options.makePaymentAvailabilityModel;
                }
            },

            render: function () {
                var $content = this.$el.find(".ui-content");
                $content.html(Mustache.render(this.template, this.getConfiguration()));
                $content.trigger("create");
            },

            getConfiguration: function () {
                var invoiceSummaryConfiguration =
                        utils._.extend({}, utils.deepClone(globals.invoiceSummary.configuration)),
                    user = this.userModel.toJSON(),
                    invoiceSummary = this.model.toJSON(),
                    makePaymentAvailability = this.makePaymentAvailabilityModel.toJSON();

                invoiceSummaryConfiguration.accountNumber.value = invoiceSummary.accountNumber;
                invoiceSummaryConfiguration.availableCredit.value =
                    utils.formatCurrency(invoiceSummary.availableCredit);
                invoiceSummaryConfiguration.currentBalance.value = utils.formatCurrency(invoiceSummary.currentBalance);
                invoiceSummaryConfiguration.currentBalance.asOfValue = invoiceSummary.currentBalanceAsOf;

                invoiceSummaryConfiguration.paymentDueDate.value = invoiceSummary.paymentDueDate;
                invoiceSummaryConfiguration.minimumPaymentDue.value =
                    utils.formatCurrency(invoiceSummary.minimumPaymentDue);
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
                    "permissions"   : user.selectedCompany.permissions
                };
            }
        });


        return InvoiceSummaryView;
    });
