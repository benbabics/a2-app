define(["backbone", "utils", "facade", "mustache", "globals", "models/DriverAddModel", "views/ValidationFormView",
        "text!tmpl/driver/driverAdd.html"],
    function (Backbone, utils, facade, Mustache, globals, DriverAddModel, ValidationFormView, pageTemplate) {

        "use strict";


        var DriverAddView = ValidationFormView.extend({
            el: "#driverAdd",

            template: pageTemplate,

            userModel: null,

            events: utils._.extend({}, ValidationFormView.prototype.events, {
            }),

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

                this.formatRequiredFields();

                $content.trigger("create");
            },

            getConfiguration: function () {
                return utils._.extend({}, utils.deepClone(globals.driverAdd.configuration));

            },

            /*
             * Event Handlers
             */
            submitForm: function (evt) {
                var self = this;

                evt.preventDefault();

                this.model.save(this.model.toJSON(), {
                    success: function (model, response) {
                        self.trigger("driverAddSuccess", response);
                    }
                });
            }
        });


        return DriverAddView;
    });
