define(["backbone"],
    function (Backbone) {

        "use strict";


        var AboutView;
        AboutView = Backbone.View.extend({

            el: "#about",

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);
            }
        });


        return AboutView;
    });
