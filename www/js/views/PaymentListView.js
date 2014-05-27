define(["backbone", "utils", "mustache", "globals", "views/BaseView", "views/PaymentView",
        "text!tmpl/payment/searchResults.html"],
    function (Backbone, utils, Mustache, globals, BaseView, PaymentView, pageTemplate) {

        "use strict";


        var PaymentListView = BaseView.extend({
            el: "#paymentHistory",

            template: pageTemplate,

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
                } catch (ignore) {}

                this.$el.trigger("create");
            }
        });


        return PaymentListView;
    });
