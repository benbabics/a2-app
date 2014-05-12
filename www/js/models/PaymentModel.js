define(["globals", "utils", "models/AjaxModel", "models/BankAccountModel", "models/UserModel"],
    function (globals, utils, AjaxModel, BankAccountModel, UserModel) {

        "use strict";


        var PaymentModel = AjaxModel.extend({
            defaults: function () {
                return utils._.extend({}, utils.deepClone(AjaxModel.prototype.defaults), {
                    "id"                : null,
                    "scheduledDate"     : null,
                    "amount"            : null,
                    "bankAccount"       : null,
                    "status"            : null,
                    "confirmationNumber": null
                });
            },

            urlRoot: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  +
                    UserModel.getInstance().get("selectedCompany").get("accountId") +
                    globals.WEBSERVICE.PAYMENTS_PATH;
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
