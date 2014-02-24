define(["backbone"],
    function (Backbone) {

        "use strict";


        var AppView = Backbone.View.extend({
            events: {
                "click [data-rel=back]": "handlePageBack"
            },

            initialize: function () {
                this.render();
            },

            render: function (display) {
                display = display || false;
                return this.$el.toggleClass("ui-hidden", display);
            },

            /*
             * Event Handlers
             */
            handlePageBack: function (evt) {
                evt.preventDefault();
                window.history.back();
            }
        });

        return AppView;
    });
