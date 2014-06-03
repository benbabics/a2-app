define(["backbone", "utils", "facade", "mustache", "globals", "views/BaseView", "text!tmpl/card/cardDetail.html"],
    function (Backbone, utils, facade, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var CardDetailView = BaseView.extend({
            el: "#cardDetails",

            template: pageTemplate,

            events: {
                "click #submitEditCard-btn"     : "handleEditCardClick",
                "click #submitTerminateCard-btn": "handleChangeStatus"
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                $content.trigger("create");
            },

            getConfiguration: function () {
                var card,
                    isCardActive,
                    cardConfiguration = null;

                if (this.model) {
                    card = this.model.toJSON();
                    isCardActive = card.status === globals.card.constants.STATUS_ACTIVE;

                    cardConfiguration = utils._.extend({}, utils.deepClone(globals.cardDetails.configuration));

                    // populate configuration details
                    cardConfiguration.id.value = card.id;
                    cardConfiguration.customVehicleId.value = card.customVehicleId;
                    cardConfiguration.vehicleDescription.value = card.vehicleDescription;
                    cardConfiguration.licensePlateNumber.value = card.licensePlateNumber;
                    cardConfiguration.licensePlateState.value = card.licensePlateState;
                    cardConfiguration.status.value = card.status;
                    if (card.department) {
                        cardConfiguration.department.value = card.department.name;
                    }

                    cardConfiguration.editButton.visible = isCardActive;
                    cardConfiguration.terminateButton.visible = isCardActive;
                }

                return {
                    "card"       : cardConfiguration,
                    "permissions": this.userModel.get("selectedCompany").get("permissions")
                };
            },

            terminate: function (eventToTrigger) {
                var self = this;

                this.model.terminate({
                    success: function (model, response) {
                        self.trigger(eventToTrigger, response);
                    }
                });
            },

            /*
             * Event Handlers
             */
            handleChangeStatus: function (evt) {
                evt.preventDefault();

                var self = this;

                facade.publish("app", "alert", {
                    title             : globals.cardTerminate.constants.CONFIRMATION_TITLE,
                    message           : globals.cardTerminate.constants.CONFIRMATION_MESSAGE,
                    primaryBtnLabel   : globals.cardTerminate.constants.OK_BTN_TEXT,
                    primaryBtnHandler : function () {
                        self.terminate("terminateCardSuccess");
                    },
                    secondaryBtnLabel : globals.cardTerminate.constants.CANCEL_BTN_TEXT
                });
            },

            handleEditCardClick: function (evt) {
                evt.preventDefault();

                // Publish is used rather than trigger to force the before navigate condition
                facade.publish("card", "navigateEdit", this.model.get("id"));
            }
        });


        return CardDetailView;
    });
