define(["globals", "utils", "models/AjaxModel", "models/UserModel"],
    function (globals, utils, AjaxModel, UserModel) {

        "use strict";


        var InvoiceSummaryModel = AjaxModel.extend({
            defaults: function () {
                return utils._.extend({}, utils.deepClone(AjaxModel.prototype.defaults), {
                    "invoiceId"         : null,
                    "accountNumber"     : null,
                    "availableCredit"   : null,
                    "currentBalance"    : null,
                    "currentBalanceAsOf": null,
                    "paymentDueDate"    : null,
                    "minimumPaymentDue" : null,
                    "invoiceNumber"     : null,
                    "closingDate"       : null
                });
            },

            urlRoot: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  +
                    UserModel.getInstance().get("selectedCompany").get("accountId") +
                    globals.WEBSERVICE.INVOICE_SUMMARY_PATH;
            },

            initialize: function (options) {
                if (options) {
                    if (options.invoiceId) {
                        this.set("invoiceId", options.invoiceId);
                    }
                    if (options.accountNumber) {
                        this.set("accountNumber", options.accountNumber);
                    }
                    if (options.availableCredit) {
                        this.set("availableCredit", options.availableCredit);
                    }
                    if (options.currentBalance) {
                        this.set("currentBalance", options.currentBalance);
                    }
                    if (options.currentBalanceAsOf) {
                        this.set("currentBalanceAsOf", options.currentBalanceAsOf);
                    }
                    if (options.paymentDueDate) {
                        this.set("paymentDueDate", options.paymentDueDate);
                    }
                    if (options.minimumPaymentDue) {
                        this.set("minimumPaymentDue", options.minimumPaymentDue);
                    }
                    if (options.invoiceNumber) {
                        this.set("invoiceNumber", options.invoiceNumber);
                    }
                    if (options.closingDate) {
                        this.set("closingDate", options.closingDate);
                    }
                }
            }
        });

        return InvoiceSummaryModel;
    });
