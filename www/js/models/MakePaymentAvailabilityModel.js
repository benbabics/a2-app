define(["globals", "utils", "models/AjaxModel", "models/UserModel"],
    function (globals, utils, AjaxModel, UserModel) {

        "use strict";


        var MakePaymentAvailabilityModel = AjaxModel.extend({
            defaults: function () {
                return utils._.extend({}, utils.deepClone(AjaxModel.prototype.defaults), {
                    "shouldDisplayDirectDebitEnabledMessage": false,
                    "shouldDisplayBankAccountSetupMessage"  : false,
                    "shouldDisplayOutstandingPaymentMessage": false,
                    "makePaymentAllowed"                    : false
                });
            },

            urlRoot: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  +
                    UserModel.getInstance().get("selectedCompany").get("accountId") +
                    globals.WEBSERVICE.MAKE_PAYMENT_AVAILABILITY_PATH;
            },

            initialize: function (options) {
                if (options) {
                    if (options.shouldDisplayDirectDebitEnabledMessage) {
                        this.set("shouldDisplayDirectDebitEnabledMessage",
                                 options.shouldDisplayDirectDebitEnabledMessage);
                    }
                    if (options.shouldDisplayBankAccountSetupMessage) {
                        this.set("shouldDisplayBankAccountSetupMessage",
                                 options.shouldDisplayBankAccountSetupMessage);
                    }
                    if (options.shouldDisplayOutstandingPaymentMessage) {
                        this.set("shouldDisplayOutstandingPaymentMessage",
                                 options.shouldDisplayOutstandingPaymentMessage);
                    }
                    if (options.makePaymentAllowed) {
                        this.set("makePaymentAllowed",
                            options.makePaymentAllowed);
                    }
                }
            }
        });

        return MakePaymentAvailabilityModel;
    });
