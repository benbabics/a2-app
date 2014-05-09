define(["backbone", "utils", "mustache", "globals", "views/PaymentView",
        "text!tmpl/payment/searchResults.html"],
    function (Backbone, utils, Mustache, globals, PaymentView, pageTemplate) {

        "use strict";


        var PaymentListView = Backbone.View.extend({
            el: "#paymentHistory",

            template: pageTemplate,

            userModel: null,

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
                var $content = this.$el.find(":jqmData(role=content)"),
                    container = document.createDocumentFragment(),
                    listContainer;

                // empty list
                $content.find("#paymentSearchResultList").empty();

                $content.html(Mustache.render(this.template));

                listContainer = $content.find("#paymentSearchResultList");

                // populate $list
                this.collection.each(function (payment) {
                    var paymentView = new PaymentView({
                        model: payment
                    });
                    paymentView.render();
                    container.appendChild(paymentView.el);  // add payment to the list
                });

                listContainer.append(container);

                try {
                    // This call throws an exception if called during startup before the list is ready
                    listContainer.listview("refresh");
                } catch (e) {}

                $content.trigger("create");
            }
        });


        return PaymentListView;
    });
