define(["backbone", "utils", "mustache", "globals", "views/BaseView", "text!tmpl/payment/payment.html"],
    function (Backbone, utils, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var PaymentView = BaseView.extend({
            tagName: "li",

            template: pageTemplate,

            render: function () {
                this.$el.html(Mustache.render(this.template, this.getConfiguration()));
                return this;
            },

            getConfiguration: function () {
                var paymentConfiguration = null,
                    payment;

                if (this.model) {
                    payment = this.model.toJSON();
                    paymentConfiguration = utils._.extend({},
                        utils.deepClone(globals.paymentSearchResults.configuration));

                    // populate configuration details
                    paymentConfiguration.url.value =
                        globals.paymentSearchResults.constants.PAYMENT_DETAILS_BASE_URL + payment.id;

                    paymentConfiguration.scheduledDate.value = payment.scheduledDate;
                    paymentConfiguration.amount.value = utils.formatCurrency(payment.amount);
                    paymentConfiguration.status.value = payment.status;
                    if (payment.bankAccount) {
                        paymentConfiguration.bankAccountName.value = payment.bankAccount.name;
                    }
                }

                return {
                    "payment" : paymentConfiguration
                };
            }
        });


        return PaymentView;
    });
