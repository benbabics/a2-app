define(["backbone", "globals", "facade", "utils", "mustache"],
    function (Backbone, globals, facade, utils, Mustache) {

        "use strict";


        var FormView;
        FormView = Backbone.View.extend({

            events: {
                "change :input": "handleInputChanged"
            },

            initialize: function () {
                // call super
                FormView.__super__.initialize.apply(this, arguments);

                // set context
                utils._.bindAll(this, "handleInputChanged", "submitForm");

                this.setModel(this.model);

                // cache the template
                Mustache.parse(this.template);

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

            updateAttribute: function (attributeName, attributeValue) {
                this.model.set(attributeName, attributeValue);
            },

            resetForm: function () {
                if (this.$el.find("form")[0]) {
                    this.$el.find("form")[0].reset();
                }

                this.resetModel();
            },

            resetModel: function () {
                this.model.clear();
                if (utils.isFn(this.model.defaults)) {
                    this.model.set(this.model.defaults());
                } else {
                    this.model.set(this.model.defaults);
                }
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
