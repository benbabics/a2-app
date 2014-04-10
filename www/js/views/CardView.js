define(["backbone", "utils", "mustache", "globals", "text!tmpl/card/card.html"],
    function (Backbone, utils, Mustache, globals, pageTemplate) {

        "use strict";


        var CardView = Backbone.View.extend({
            tagName: "li",

            template: pageTemplate,

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the template
                Mustache.parse(this.template);
            },

            render: function () {
                this.$el.html(Mustache.render(this.template, this.getConfiguration()));
                return this;
            },

            getConfiguration: function () {
                var cardConfiguration = null,
                    card;

                if (this.model) {
                    card = this.model.toJSON();
                    cardConfiguration = utils._.extend({},
                        utils.deepClone(globals.cardSearchResults.configuration));

                    // populate configuration details
                    cardConfiguration.url.value =
                        globals.cardSearchResults.constants.CARD_DETAILS_BASE_URL + card.number;
                    cardConfiguration.number.value = card.number;
                    cardConfiguration.customVehicleId.value = card.customVehicleId;
                    cardConfiguration.vehicleDescription.value = card.vehicleDescription;
                    cardConfiguration.licensePlateNumber.value = card.licensePlateNumber;
                    cardConfiguration.licensePlateState.value = card.licensePlateState;
                    cardConfiguration.customVehicleId.value = card.customVehicleId;
                    cardConfiguration.status.value = card.status;
                    if (card.department) {
                        cardConfiguration.department.value = card.department.name;
                    }
                }

                return {
                    "card" : cardConfiguration
                };
            }
        });


        return CardView;
    });
