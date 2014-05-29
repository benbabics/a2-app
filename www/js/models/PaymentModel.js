define(["globals", "utils", "models/AjaxModel", "models/BankAccountModel", "models/UserModel", "backbone-validation"],
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
                    "confirmationNumber": null,
                    "paymentDueDate"    : null,
                    "minimumPaymentDue" : null
                });
            },

            urlRoot: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  +
                    UserModel.getInstance().get("selectedCompany").get("accountId") +
                    globals.WEBSERVICE.PAYMENTS_PATH;
            },

            validation: {
                "scheduledDate": [
                    {
                        required: true,
                        msg: globals.payment.constants.ERROR_SCHEDULED_DATE_REQUIRED_FIELD
                    },
                    {
                        pattern: globals.APP.DATE_PATTERN,
                        msg    : globals.payment.constants.ERROR_SCHEDULED_DATE_MUST_BE_A_DATE
                    },
                    {
                        fn: function (value, attr, computedState) {
                            var today = utils.moment().startOf("day"),
                                enteredDate = utils.moment(value);

                            // Date cannot be before today
                            if (enteredDate.isBefore(today)) {
                                return globals.payment.constants.ERROR_SCHEDULED_DATE_BEFORE_TODAY;
                            }
                        }
                    }
                ],
                "amount": [
                    {
                        required: true,
                        msg: globals.payment.constants.ERROR_AMOUNT_REQUIRED_FIELD
                    },
                    {
                        pattern: globals.APP.NUMBER_PATTERN,
                        msg    : globals.payment.constants.ERROR_AMOUNT_MUST_BE_NUMERIC
                    }
                ]
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
                    if (options.paymentDueDate) { this.set("paymentDueDate", options.paymentDueDate); }
                    if (options.minimumPaymentDue) { this.set("minimumPaymentDue", options.minimumPaymentDue); }
                }
            },

            sync: function (method, model, options) {
                if (method === "patch") {
                    options.type = "POST";
                }

                PaymentModel.__super__.sync.call(this, method, model, options);
            },

            add: function (options) {
                var attributes = {
                    "scheduledDate": this.get("scheduledDate"),
                    "amount"       : this.get("amount"),
                    "bankAccountId": this.get("bankAccount").get("id")
                };

                options.patch = true;
                // Set the ID to fake backbone into thinking the model is NOT new, so it will not try to create it
                this.set("id", 1);
                // Override default url as backbone will try to POST to urlRoot()/{{id}} when an id is known
                this.url = this.urlRoot();
                this.save(attributes, options);
            },

            edit: function (options) {
                var attributes = {
                    "scheduledDate": this.get("scheduledDate"),
                    "amount"       : this.get("amount"),
                    "bankAccountId": this.get("bankAccount").get("id")
                };

                options.patch = true;
                this.save(attributes, options);
            },

            validateWarnings: function () {
                var warnings = [],
                    warningsCount = 0,
                    minimumPaymentDue = this.get("minimumPaymentDue"),
                    paymentDueDate = utils.moment(this.get("paymentDueDate")),
                    enteredAmount = this.get("amount"),
                    enteredDate = utils.moment(this.get("scheduledDate"));

                if (enteredDate.isAfter(paymentDueDate)) {
                    warnings[warningsCount] = globals.payment.constants.ERROR_SCHEDULED_DATE_AFTER_DUE_DATE;
                    warningsCount++;
                }

                if (enteredAmount < minimumPaymentDue) {
                    warnings[warningsCount] = globals.payment.constants.ERROR_AMOUNT_LESS_THAN_PAYMENT_DUE;
                    warningsCount++;
                }

                if (warningsCount) {
                    return warnings;
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
