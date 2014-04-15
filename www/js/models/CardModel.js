define(["backbone", "mustache", "globals", "utils", "models/UserModel", "models/DepartmentModel",
        "models/AjaxModel"],
    function (Backbone, Mustache, globals, utils, UserModel, DepartmentModel, AjaxModel) {

        "use strict";


        var CardModel = AjaxModel.extend({
            defaults: function () {
                return utils._.extend({}, utils.deepClone(AjaxModel.prototype.defaults), {
                    "idAttribute"             : "number",
                    "id"                      : null,
                    "authorizationProfileName": null,
                    "status"                  : null,
                    "department"              : null,
                    "customVehicleId"         : null,
                    "vehicleDescription"      : null,
                    "licensePlateNumber"      : null,
                    "licensePlateState"       : null,
                    "vin"                     : null
                });
            },

            urlRoot: function () {
                return globals.WEBSERVICE.ACCOUNTS.URL + "/"  +
                    UserModel.getInstance().get("selectedCompany").get("accountId") +
                    globals.WEBSERVICE.CARD_PATH;
            },

            initialize: function (options) {
                var department;

                CardModel.__super__.initialize.apply(this, arguments);

                if (options) {
                    if (options.number) { this.set("id", options.number); }
                    if (options.authorizationProfileName) {
                        this.set("authorizationProfileName", options.authorizationProfileName);
                    }
                    if (options.status) { this.set("status", options.status); }
                    if (options.department) {
                        department = new DepartmentModel();
                        department.initialize(options.department);
                        this.set("department", department);
                    }
                    if (options.customVehicleId) { this.set("customVehicleId", options.customVehicleId); }
                    if (options.vehicleDescription) { this.set("vehicleDescription", options.vehicleDescription); }
                    if (options.licensePlateNumber) { this.set("licensePlateNumber", options.licensePlateNumber); }
                    if (options.licensePlateState) { this.set("licensePlateState", options.licensePlateState); }
                    if (options.vin) { this.set("vin", options.vin); }
                }
            },

            sync: function (method, model, options) {
                if (method === "patch") {
                    options.type = "POST";
                }

                CardModel.__super__.sync.call(this, method, model, options);
            },

            terminate: function (options) {
                var attributes = {},
                    originalUrl = this.url();

                options.patch = true;
                // Override default url as backbone will try to POST to urlRoot()/{{id}} when an id is known
                this.url = originalUrl + globals.WEBSERVICE.CARDS.TERMINATE_PATH;
                this.save(attributes, options);
            },

            toJSON: function () {
                var json = CardModel.__super__.toJSON.apply(this, arguments);

                if (json.department) {
                    json.department = json.department.toJSON();
                }

                return json;
            }
        });

        return CardModel;
    });
