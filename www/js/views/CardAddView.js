define(["backbone", "utils", "facade", "mustache", "globals", "models/CardModel",
        "views/ValidationFormView", "text!tmpl/card/cardAdd.html"],
    function (Backbone, utils, facade, Mustache, globals, CardModel, ValidationFormView, pageTemplate) {

        "use strict";


        var CardAddView = ValidationFormView.extend({
            el: "#cardAdd",

            template: pageTemplate,

            userModel: null,

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

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }

                // jQM Events
                this.$el.on("pagebeforeshow", this.handlePageBeforeShow);
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
                                "selected": department.name === globals.cardAdd.constants.DEFAULT_DEPARTMENT_NAME
                            });
                        }
                    });

                    stateListValues.push(globals.cardAdd.constants.SELECT_STATE);
                    utils._.each(globals.APP.constants.STATES, function (state) {
                        state.selected = false;
                        stateListValues.push(state);
                    });

                    cardConfiguration.customVehicleId.value = this.model.get("customVehicleId");
                    cardConfiguration.customVehicleId.maxLength =
                        user.selectedCompany.settings.cardSettings.customVehicleIdMaxLength;

                    cardConfiguration.vehicleDescription.value = this.model.get("vehicleDescription");
                    cardConfiguration.vehicleDescription.maxLength =
                        user.selectedCompany.settings.cardSettings.vehicleDescriptionMaxLength;

                    cardConfiguration.vin.value = this.model.get("vin");
                    cardConfiguration.vin.maxLength = user.selectedCompany.settings.cardSettings.vinFixedLength;
                    cardConfiguration.vin.placeholder =
                        Mustache.render(globals.card.constants.VIN_PLACEHOLDER_FORMAT, {
                            "vinFixedLength": user.selectedCompany.settings.cardSettings.vinFixedLength
                        });

                    cardConfiguration.licensePlateNumber.value = this.model.get("licensePlateNumber");
                    cardConfiguration.licensePlateNumber.maxLength =
                        user.selectedCompany.settings.cardSettings.licensePlateNumberMaxLength;

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

            findDefaultAuthorizationProfile: function () {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("authorizationProfiles").at(0);
            },

            findDefaultDepartment: function () {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("departments")
                    .findWhere({"visible": true, "name": globals.cardAdd.constants.DEFAULT_DEPARTMENT_NAME});
            },

            findDepartment: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("departments").findWhere({"visible": true, "id": id});
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
