define(["backbone", "utils", "facade", "mustache", "globals", "models/CardModel",
        "views/ValidationFormView", "text!tmpl/card/cardAdd.html"],
    function (Backbone, utils, facade, Mustache, globals, CardModel, ValidationFormView, pageTemplate) {

        "use strict";


        var CardAddView = ValidationFormView.extend({
            el: "#cardAdd",

            template: pageTemplate,

            events: utils._.extend({}, ValidationFormView.prototype.events, {
                "click #submitCardAdd-btn": "submitForm",

                // Clicking 'GO', 'Search', .. from the soft keyboard submits the form so lets handle it
                "submit #cardAddForm"     : "submitForm"
            }),

            initialize: function (options) {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // set context
                utils._.bindAll(this, "handlePageBeforeShow");

                // jQM Events
                this.$el.on("pagecontainerbeforeshow", this.handlePageBeforeShow);
            },

            render: function () {
                var $content = this.$el.find(":jqmData(role=content)");

                this.resetModel();

                $content.html(Mustache.render(this.template, this.getConfiguration()));

                this.formatRequiredFields();

                $content.trigger("create");
            },

            resetForm: function () {
                CardAddView.__super__.resetForm.apply(this, arguments);

                this.model.set("department", this.findDefaultDepartment());
                this.model.set("authorizationProfileName", this.findDefaultAuthorizationProfile().get("name"));
            },

            getConfiguration: function () {
                var cardConfiguration = utils._.extend({}, utils.deepClone(globals.cardAdd.configuration)),
                    user = this.userModel.toJSON(),
                    cardSettings = user.selectedCompany.settings.cardSettings,
                    authorizationProfileListValues = [],
                    departmentListValues = [],
                    stateListValues = [];

                cardConfiguration.ableToAddCard = utils._.size(user.selectedCompany.authorizationProfiles) > 0;
                if (!cardConfiguration.ableToAddCard) {
                    cardConfiguration.unableToAddCardMessage = globals.cardAdd.constants.NO_AUTH_PROFILES_MESSAGE;
                } else {
                    utils._.each(user.selectedCompany.authorizationProfiles, function (authorizationProfile) {
                        authorizationProfileListValues.push({
                            "id": authorizationProfile.name,
                            "name": authorizationProfile.name
                        });
                    });

                    utils._.each(user.selectedCompany.departments, function (department) {
                        if (department.visible === true) {
                            departmentListValues.push({
                                "id": department.id,
                                "name": department.name,
                                "selected": department.name === globals.APP.constants.DEFAULT_DEPARTMENT_NAME
                            });
                        }
                    });

                    stateListValues.push(globals.card.constants.SELECT_STATE);
                    utils._.each(globals.APP.constants.STATES, function (state) {
                        state.selected = false;
                        stateListValues.push(state);
                    });

                    cardConfiguration.customVehicleId.value = this.model.get("customVehicleId");
                    cardConfiguration.customVehicleId.maxLength = cardSettings.customVehicleIdMaxLength;

                    cardConfiguration.vehicleDescription.value = this.model.get("vehicleDescription");
                    cardConfiguration.vehicleDescription.maxLength = cardSettings.vehicleDescriptionMaxLength;

                    cardConfiguration.vin.value = this.model.get("vin");
                    cardConfiguration.vin.maxLength = cardSettings.vinFixedLength;
                    cardConfiguration.vin.placeholder =
                        Mustache.render(globals.card.constants.VIN_PLACEHOLDER_FORMAT, {
                            "vinFixedLength": cardSettings.vinFixedLength
                        });

                    cardConfiguration.licensePlateNumber.value = this.model.get("licensePlateNumber");
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

            pageBeforeShow: function () {
                this.resetForm();
            },

            /*
             * Event Handlers
             */
            handlePageBeforeShow: function (evt) {
                this.pageBeforeShow();
            },

            handleInputChanged: function (evt) {
                var target = evt.target;
                if (target.name === "departmentId") {
                    this.updateAttribute("department", this.findDepartment(target.value));
                } else {
                    CardAddView.__super__.handleInputChanged.apply(this, arguments);
                }
            },

            submitForm: function (evt) {
                var errors;

                evt.preventDefault();

                errors = this.model.validate();
                if (errors) {
                    this.handleValidationError(this.model, errors);
                } else {
                    this.trigger("cardAddSubmitted");
                }
            }
        });


        return CardAddView;
    });
