define(["backbone"],
    function (Backbone) {

        "use strict";


        var MakePaymentAvailabilityModel = Backbone.Model.extend({
            defaults: {
                "shouldDisplayDirectDebitEnabledMessage": false,
                "shouldDisplayBankAccountSetupMessage"  : false,
                "shouldDisplayOutstandingPaymentMessage": false
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
                }
            }
        });

        return MakePaymentAvailabilityModel;
    });
