define(["backbone", "globals", "facade", "utils", "mustache", "views/BaseView"],
    function (Backbone, globals, facade, utils, Mustache, BaseView) {

        "use strict";


        var FormView = BaseView.extend({

            events: {
                "change :input": "handleInputChanged"
            },

            initialize: function () {
                // call super
                FormView.__super__.initialize.apply(this, arguments);

                // set context
                utils._.bindAll(this, "handleInputChanged", "submitForm");
            },

            updateAttribute: function (attributeName, attributeValue) {
                this.model.set(attributeName, attributeValue);
            },

            resetForm: function () {
                if (this.$el.find("form")[0]) {
                    this.$el.find("form")[0].reset();
                }

                this.resetModel();
            },

            /*
             * Event Handlers
             */
            handleInputChanged: function (evt) {
                var target = evt.target;
                this.updateAttribute(target.name, target.value);
            },

            submitForm: function (evt) {
                evt.preventDefault();
                this.model.save();
            }
        });


        return FormView;
    });
