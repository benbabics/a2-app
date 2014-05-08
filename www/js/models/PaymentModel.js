define(["backbone", "globals", "models/BankAccountModel"],
    function (Backbone, globals, BankAccountModel) {

        "use strict";


        var PaymentModel = Backbone.Model.extend({
            defaults: {
                "id"                : null,
                "scheduledDate"     : null,
                "amount"            : null,
                "bankAccount"       : null,
                "status"            : null,
                "confirmationNumber": null
            },

            initialize: function (options) {
                var bankAccount;

                if (options) {
                    if (options.id) { this.set("id", options.id); }
                    if (options.scheduledDate) { this.set("scheduledDate", options.scheduledDate); }
                    if (options.amount) { this.set("amount", options.amount); }
                    if (options.bankAccount) {
                        bankAccount = new BankAccountModel();
                        bankAccount.initialize(options.bankAccount);
                        this.set("bankAccount", bankAccount);
                    }
                    if (options.status) { this.set("status", options.status); }
                    if (options.confirmationNumber) { this.set("confirmationNumber", options.confirmationNumber); }
                }
            },

            toJSON: function () {
                var json = PaymentModel.__super__.toJSON.apply(this, arguments);

                if (json.bankAccount) {
                    json.bankAccount = json.bankAccount.toJSON();
                }

                return json;
            }
        });

        return PaymentModel;
    });
