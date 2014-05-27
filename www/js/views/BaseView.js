define(["backbone", "globals", "utils", "mustache"],
    function (Backbone, globals, utils, Mustache) {

        "use strict";


        var BaseView = Backbone.View.extend({
            userModel: null,

            initialize: function (options) {
                // call super
                BaseView.__super__.initialize.apply(this, arguments);

                this.setModel(this.model);

                // cache the template
                Mustache.parse(this.template);

                if (options && options.userModel) {
                    this.userModel = options.userModel;
                }

                // create page
                this.pageCreate();
            },

            setModel: function (model) {
                this.model = model;
                this.setupLoadingIndicatorOnModel(this.model);
            },

            setupLoadingIndicatorOnModel: function (model) {
                if (model) {
                    // Set handlers for model events
                    this.listenTo(model, "request", function () {   // when an ajax request has been sent
                        this.showLoadingIndicator(true);
                    });

                    this.listenTo(model, "sync error", function () {// when an ajax request has been completed with
                        this.hideLoadingIndicator(true);            // either success (sync) or failure (error)
                    });
                }
            },

            pageCreate: function () {
                // no-op - should be overridden
            },

            resetModel: function () {
                this.model.clear();
                if (utils.isFn(this.model.defaults)) {
                    this.model.set(this.model.defaults());
                } else {
                    this.model.set(this.model.defaults);
                }
            },

            findDefaultAuthorizationProfile: function () {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("authorizationProfiles").at(0);
            },

            findDefaultBankAccount: function () {
                var selectedCompany = this.userModel.get("selectedCompany"),
                    bankAccounts = selectedCompany.get("bankAccounts"),
                    defaultBankAccount = bankAccounts.findWhere({"defaultBank": true});

                // Return the default if one was found
                if (defaultBankAccount) {
                    return defaultBankAccount;
                }

                // otherwise return the first one in the collection
                return bankAccounts.at(0);
            },

            findDefaultDepartment: function () {
                var selectedCompany = this.userModel.get("selectedCompany"),
                    departments = selectedCompany.get("departments"),
                    defaultDepartment = departments
                        .findWhere({"visible": true, "name": globals.APP.constants.DEFAULT_DEPARTMENT_NAME});

                // Return the default if one was found
                if (defaultDepartment) {
                    return defaultDepartment;
                }

                // otherwise return the first one in the collection
                return departments.at(0);
            },

            findDefaultShippingMethod: function () {
                var selectedCompany = this.userModel.get("selectedCompany"),
                    shippingMethods = selectedCompany.get("shippingMethods"),
                    defaultShippingMethod = shippingMethods
                        .findWhere({"id": globals.APP.constants.DEFAULT_SHIPPING_METHOD_NAME});

                // Return the default if one was found
                if (defaultShippingMethod) {
                    return defaultShippingMethod;
                }

                // otherwise return the first one in the collection
                return shippingMethods.at(0);
            },

            findBankAccount: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("bankAccounts").findWhere({"id": id});
            },

            findDepartment: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("departments").findWhere({"visible": true, "id": id});
            },

            findShippingMethod: function (id) {
                var selectedCompany = this.userModel.get("selectedCompany");
                return selectedCompany.get("shippingMethods").findWhere({"id": id});
            },

            getEarlistPaymentDate: function () {
                var earlistPaymentDate = utils.moment();

                if (earlistPaymentDate.format("ddd") === "Sun") {
                    return earlistPaymentDate.add("days", 1);
                }
                if (earlistPaymentDate.format("ddd") === "Sat") {
                    return earlistPaymentDate.add("days", 2);
                }

                return earlistPaymentDate;
            }
        });


        return BaseView;
    });
