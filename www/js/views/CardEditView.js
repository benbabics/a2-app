define(["backbone", "utils", "facade", "mustache", "globals", "models/CardModel",
        "views/ValidationFormView", "text!tmpl/card/cardEdit.html", "text!tmpl/card/cardChangeDetails.html"],
    function (Backbone, utils, facade, Mustache, globals, CardModel, ValidationFormView,
              pageTemplate, cardChangeDetailsTemplate) {

        "use strict";


        var CardEditView = ValidationFormView.extend({
            el: "#cardEdit",

            template: pageTemplate,
            changeDetailsTemplate: cardChangeDetailsTemplate,

            userModel: null,

            events: utils._.extend({}, ValidationFormView.prototype.events, {
                "click #submitCardEdit-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #cardEditForm"     : "submitForm"
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

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.formatRequiredFields();

                $content.trigger("create");
            },

            getConfiguration: function () {
                var cardConfiguration = utils._.extend({}, utils.deepClone(globals.cardEdit.configuration)),
                    user = this.userModel.toJSON(),
                    card = this.model.toJSON(),
                    cardSettings = user.selectedCompany.settings.cardSettings,
                    authorizationProfileListValues = [],
                    departmentListValues = [],
                    stateListValues = [];

                cardConfiguration.ableToEditCard = utils._.size(user.selectedCompany.authorizationProfiles) > 0;
                if (!cardConfiguration.ableToEditCard) {
                    cardConfiguration.unableToEditCardMessage = globals.cardEdit.constants.NO_AUTH_PROFILES_MESSAGE;
                } else {
                    utils._.each(user.selectedCompany.authorizationProfiles, function (authorizationProfile) {
                        authorizationProfileListValues.push({
                            "id": authorizationProfile.name,
                            "name": authorizationProfile.name,
                            "selected": authorizationProfile.name === card.authorizationProfileName
                        });
                    });

                    utils._.each(user.selectedCompany.departments, function (department) {
                        if (department.visible === true) {
                            departmentListValues.push({
                                "id": department.id,
                                "name": department.name,
                                "selected": department.id === card.department.id
                            });
                        }
                    });

                    stateListValues.push(globals.card.constants.SELECT_STATE);
                    utils._.each(globals.APP.constants.STATES, function (state) {
                        state.selected = state.id === card.licensePlateState;
                        stateListValues.push(state);
                    });

                    cardConfiguration.id.value = card.id;

                    cardConfiguration.customVehicleId.value = card.customVehicleId;
                    cardConfiguration.customVehicleId.maxLength = cardSettings.customVehicleIdMaxLength;

                    cardConfiguration.vehicleDescription.value = card.vehicleDescription;
                    cardConfiguration.vehicleDescription.maxLength = cardSettings.vehicleDescriptionMaxLength;

                    cardConfiguration.vin.value = card.vin;
                    cardConfiguration.vin.maxLength = cardSettings.vinFixedLength;
                    cardConfiguration.vin.placeholder =
                        Mustache.render(globals.card.constants.VIN_PLACEHOLDER_FORMAT, {
                            "vinFixedLength": cardSettings.vinFixedLength
                        });

                    cardConfiguration.licensePlateNumber.value = card.licensePlateNumber;
                    cardConfiguration.licensePlateNumber.maxLength = cardSettings.licensePlateNumberMaxLength;

                    cardConfiguration.licensePlateState.enabled = stateListValues.length > 1;
                    cardConfiguration.licensePlateState.values = stateListValues;

                    cardConfiguration.departmentId.enabled = departmentListValues.length > 1;
                    cardConfiguration.departmentId.values = departmentListValues;

                    cardConfiguration.authorizationProfileName.enabled = authorizationProfileListValues.length > 1;
                    cardConfiguration.authorizationProfileName.values = authorizationProfileListValues;
                }

                return {
                    "card"          : cardConfiguration,
                    "requiredFields": user.selectedCompany.requiredFields
                };
            },

            getChangeDetailsConfiguration: function (response) {
                var user = this.userModel.toJSON(),
                    newCard = new CardModel(),
                    card,
                    cardConfiguration = utils._.extend({}, utils.deepClone(globals.cardChangedDetails.configuration));

                newCard.initialize(response);
                card = newCard.toJSON();

                // populate configuration details
                cardConfiguration.id.value = card.id;
                cardConfiguration.customVehicleId.value = card.customVehicleId;
                cardConfiguration.vehicleDescription.value = card.vehicleDescription;
                cardConfiguration.licensePlateNumber.value = card.licensePlateNumber;
                cardConfiguration.shipping = null;

                return {
                    "message": response.message,
                    "card" : cardConfiguration,
                    "requiredFields": user.selectedCompany.requiredFields
                };
            },

            findDepartment: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("departments").findWhere({"visible": true, "id": id});
            },

            /*
             * Event Handlers
             */
            handleInputChanged: function (evt) {
                var target = evt.target;
                if (target.name === "departmentId") {
                    this.updateAttribute("department", this.findDepartment(target.value));
                } else {
                    CardEditView.__super__.handleInputChanged.apply(this, arguments);
                }
            },

            submitForm: function (evt) {
                var self = this;

                evt.preventDefault();

                this.model.edit(null, {
                    success: function (model, response) {
                        var message =
                            Mustache.render(self.changeDetailsTemplate,
                                self.getChangeDetailsConfiguration(response));

                        self.trigger("cardEditSuccess", message);

                        self.resetForm();
                    },
                    error: function (model, response, options) {
                        if (response.type === "INFO" &&
                            response.message === "ADDRESS_IS_REQUIRED") {
                            self.trigger("cardEditSubmitted");
                        }
                    }
                });
            }
        });


        return CardEditView;
    });
