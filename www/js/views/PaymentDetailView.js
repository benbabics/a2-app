define(["backbone", "utils", "facade", "mustache", "globals", "views/BaseView", "text!tmpl/payment/paymentDetail.html"],
    function (Backbone, utils, facade, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var PaymentDetailView = BaseView.extend({
            el: "#paymentDetails",

            template: pageTemplate,

            userModel: null,

            events: {
                "click #submitEditPayment-btn"  : "handleEditPaymentClick",
                "click #submitCancelPayment-btn": "handleCancelPaymentClick"
            },

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                $content.trigger("create");
            },

            getConfiguration: function () {
                var payment,
                    isPaymentEditable,
                    paymentConfiguration = null;

                if (this.model) {
                    payment = this.model.toJSON();
                    isPaymentEditable = payment.status === globals.payment.constants.STATUS_SCHEDULED;

                    paymentConfiguration = utils._.extend({}, utils.deepClone(globals.paymentDetails.configuration));

                    // populate configuration details
                    paymentConfiguration.scheduledDate.value = payment.scheduledDate;
                    paymentConfiguration.amount.value = utils.formatCurrency(payment.amount);
                    if (payment.bankAccount) {
                        paymentConfiguration.bankAccountName.value = payment.bankAccount.name;
                    }
                    paymentConfiguration.status.value = payment.status;
                    paymentConfiguration.confirmationNumber.value = payment.confirmationNumber;

                    paymentConfiguration.editButton.visible = isPaymentEditable;
                    paymentConfiguration.cancelButton.visible = isPaymentEditable;
                }

                return {
                    "payment"    : paymentConfiguration,
                    "permissions": this.userModel.get("permissions")
                };
            },

            cancelPayment: function (eventToTrigger) {
                var self = this;

                this.model.destroy({
                    success: function (model, response) {
                        self.trigger(eventToTrigger, response.message);
                    }
                });
            },

            /*
             * Event Handlers
             */
            handleCancelPaymentClick: function (evt) {
                evt.preventDefault();

                var self = this;

                facade.publish("app", "alert", {
                    title             : globals.paymentCancel.constants.CONFIRMATION_TITLE,
                    message           : globals.paymentCancel.constants.CONFIRMATION_MESSAGE,
                    primaryBtnLabel   : globals.paymentCancel.constants.OK_BTN_TEXT,
                    primaryBtnHandler : function () {
                        self.cancelPayment("cancelPaymentSuccess");
                    },
                    secondaryBtnLabel : globals.paymentCancel.constants.CANCEL_BTN_TEXT
                });
            },

            handleEditPaymentClick: function (evt) {
                evt.preventDefault();

                // Publish is used rather than trigger to force the before navigate condition
                facade.publish("invoice", "navigatePaymentEdit", this.model.get("id"));
            }
        });


        return PaymentDetailView;
    });
