define(["backbone", "utils", "mustache"],
    function (Backbone, utils, Mustache) {

        "use strict";


        var BaseView = Backbone.View.extend({
            initialize: function () {
                // call super
                BaseView.__super__.initialize.apply(this, arguments);

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

            resetModel: function () {
                this.model.clear();
                if (utils.isFn(this.model.defaults)) {
                    this.model.set(this.model.defaults());
                } else {
                    this.model.set(this.model.defaults);
                }
            }
        });


        return BaseView;
    });
