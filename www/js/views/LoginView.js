define(["backbone"],
    function (Backbone) {

        "use strict";


        var LoginView;
        LoginView = Backbone.View.extend({

            el: null,

            template: null,

            events: {
            },

            initialize: function () {
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // create page
                this.pageCreate();
            },

            pageCreate: function () {
            },

            render: function () {
            }
        });


        return LoginView;
    });
