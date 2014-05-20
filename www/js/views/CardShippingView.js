define(["backbone", "utils", "facade", "mustache", "globals", "models/CardModel", "models/ShippingModel",
        "views/ValidationFormView", "text!tmpl/card/shipping.html", "text!tmpl/card/cardChangeDetails.html"],
    function (Backbone, utils, facade, Mustache, globals, CardModel, ShippingModel, ValidationFormView,
              pageTemplate, cardChangeDetailsTemplate) {

        "use strict";


        var CardShippingView = ValidationFormView.extend({
            el: "#cardShipping",

            template: pageTemplate,
            changeDetailsTemplate: cardChangeDetailsTemplate,

            cardModel: null,
            userModel: null,

            events: utils._.extend({}, ValidationFormView.prototype.events, {
                "click #submitCardShipping-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #cardShippingForm"     : "submitForm"
            }),

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // parse the add/edit details template
                Mustache.parse(this.changeDetailsTemplate);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }
            },

            setCardModel: function (cardModel) {
                this.cardModel = cardModel;
                this.setupLoadingIndicatorOnModel(this.cardModel);
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                this.resetModel();

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.updateShippingWarning();
                this.formatRequiredFields();

                this.$el.trigger("create");
            },

            getConfiguration: function () {
                var shippingConfiguration = utils._.extend({}, utils.deepClone(globals.cardShipping.configuration)),
                    user = this.userModel.toJSON(),
                    shippingMethodListValues = [],
                    stateListValues = [],
                    residenceListValues = [];

                shippingConfiguration.ableToContinue = utils._.size(user.selectedCompany.authorizationProfiles) > 0;
                if (!shippingConfiguration.ableToContinue) {
                    shippingConfiguration.unableToContinueMessage = globals.cardAdd.constants.NO_AUTH_PROFILES_MESSAGE;
                } else {
                    utils._.each(user.selectedCompany.shippingMethods, function (shippingMethod) {
                        shippingMethodListValues.push({
                            "id": shippingMethod.id,
                            "name": shippingMethod.formattedName()
                        });
                    });

                    shippingConfiguration.shippingMethod.enabled = shippingMethodListValues.length > 1;
                    shippingConfiguration.shippingMethod.values = shippingMethodListValues;

                    shippingConfiguration.firstName.value = this.model.get("firstName");
                    shippingConfiguration.lastName.value = this.model.get("lastName");
                    shippingConfiguration.companyName.value = this.model.get("companyName");
                    shippingConfiguration.addressLine1.value = this.model.get("addressLine1");
                    shippingConfiguration.addressLine2.value = this.model.get("addressLine2");
                    shippingConfiguration.city.value = this.model.get("city");

                    utils._.each(globals.APP.constants.STATES, function (state) {
                        state.selected = state.id === user.selectedCompany.defaultShippingAddress.state;
                        stateListValues.push(state);
                    });

                    shippingConfiguration.state.enabled = stateListValues.length > 1;
                    shippingConfiguration.state.values = stateListValues;

                    shippingConfiguration.postalCode.value = this.model.get("postalCode");

                    residenceListValues.push({
                        "id": "residence-yes",
                        "label": "Yes",
                        "selected": this.model.get("residence") === true,
                        "value": "true"
                    });
                    residenceListValues.push({
                        "id": "residence-no",
                        "label": "No",
                        "selected": this.model.get("residence") !== true,
                        "value": "false"
                    });
                    shippingConfiguration.residence.values = residenceListValues;
                }

                return {
                    "shipping": shippingConfiguration
                };
            },

            getChangeDetailsConfiguration: function (response) {
                var user = this.userModel.toJSON(),
                    newCard = new CardModel(),
                    card,
                    shipping = this.model.toJSON(),
                    cardConfiguration = utils._.extend({}, utils.deepClone(globals.cardChangedDetails.configuration));

                newCard.initialize(response);
                card = newCard.toJSON();

                // populate configuration details
                cardConfiguration.id.value = card.id;
                cardConfiguration.customVehicleId.value = card.customVehicleId;
                cardConfiguration.vehicleDescription.value = card.vehicleDescription;
                cardConfiguration.licensePlateNumber.value = card.licensePlateNumber;
                cardConfiguration.shipping.method.value = shipping.shippingMethod.name;
                cardConfiguration.shipping.address.firstName.value = shipping.firstName;
                cardConfiguration.shipping.address.lastName.value = shipping.lastName;
                cardConfiguration.shipping.address.companyName.value = shipping.companyName;
                cardConfiguration.shipping.address.addressLine1.value = shipping.addressLine1;
                cardConfiguration.shipping.address.addressLine2.value = shipping.addressLine2;
                cardConfiguration.shipping.address.city.value = shipping.city;
                cardConfiguration.shipping.address.state.value = shipping.state;
                cardConfiguration.shipping.address.postalCode.value = shipping.postalCode;
                cardConfiguration.shipping.residence.value = (shipping.residence.name === true) ?
                        globals.cardChangedDetails.constants.RESIDENCE_YES :
                        globals.cardChangedDetails.constants.RESIDENCE_NO;

                return {
                    "message": response.message,
                    "card" : cardConfiguration,
                    "requiredFields": user.selectedCompany.requiredFields
                };
            },

            resetModel: function () {
                var user = this.userModel.toJSON();

                this.model.set("shippingMethod", this.findDefaultShippingMethod());
                this.model.set("firstName", user.selectedCompany.defaultShippingAddress.firstName);
                this.model.set("lastName", user.selectedCompany.defaultShippingAddress.lastName);
                this.model.set("companyName", user.selectedCompany.defaultShippingAddress.companyName);
                this.model.set("addressLine1", user.selectedCompany.defaultShippingAddress.addressLine1);
                this.model.set("addressLine2", user.selectedCompany.defaultShippingAddress.addressLine2);
                this.model.set("city", user.selectedCompany.defaultShippingAddress.city);
                this.model.set("state", user.selectedCompany.defaultShippingAddress.state);
                this.model.set("postalCode", user.selectedCompany.defaultShippingAddress.postalCode);
                this.model.set("countryCode", user.selectedCompany.defaultShippingAddress.countryCode);
                this.model.set("residence", user.selectedCompany.defaultShippingAddress.residence);
            },

            findDefaultShippingMethod: function () {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("shippingMethods")
                    .findWhere({"id": globals.cardShipping.constants.DEFAULT_SHIPPING_METHOD_NAME});
            },

            findShippingMethod: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("shippingMethods").findWhere({"id": id});
            },

            isAfterShippingCutoff: function () {
                var currentDate = utils.moment().tz("America/New_York"),// current date/time in New York
                    shippingCutoffHour = 15;  // 3pm in 24 hour time

                return currentDate.hour() >= shippingCutoffHour;
            },

            updateShippingWarning: function () {
                var displayWarning = false,
                    shippingMethod = this.model.get("shippingMethod");

                if (shippingMethod && shippingMethod.get("id") === "OVERNIGHT") {
                    displayWarning = this.isAfterShippingCutoff();
                }

                this.$el.find("#shippingWarning").toggleClass("ui-hidden", !displayWarning);
            },

            /*
             * Event Handlers
             */
            handleInputChanged: function (evt) {
                var target = evt.target;
                if (target.name === "shippingMethod") {
                    this.updateAttribute("shippingMethod", this.findShippingMethod(target.value));
                    this.updateShippingWarning();
                } else {
                    CardShippingView.__super__.handleInputChanged.apply(this, arguments);
                }
            },

            handleSuccessResponse: function (response, eventToTrigger) {
                var message =
                    Mustache.render(this.changeDetailsTemplate, this.getChangeDetailsConfiguration(response));

                this.trigger(eventToTrigger, message);

                this.resetForm();
            },

            submitForm: function (evt) {
                var self = this,
                    errors;

                evt.preventDefault();

                errors = this.model.validate();
                if (errors) {
                    this.handleValidationError(this.model, errors);
                } else {
                    if (this.cardModel.get("id")) {
                        this.cardModel.edit(this.model.toJSON(), {
                            success: function (model, response) {
                                self.handleSuccessResponse(response, "cardEditSuccess");
                            }
                        });
                    } else {
                        this.cardModel.add(this.model.toJSON(), {
                            success: function (model, response) {
                                self.handleSuccessResponse(response, "cardAddSuccess");
                            }
                        });
                    }
                }
            }
        });


        return CardShippingView;
    });
