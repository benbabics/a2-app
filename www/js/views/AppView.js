define(["backbone"],
    function (Backbone) {

        "use strict";


        var AppView = Backbone.View.extend({
            initialize: function () {
                this.render();
            },

            render: function (display) {
                display = display || false;
                return this.$el.toggleClass("ui-hidden", display);
            }
        });

        return AppView;
    });
