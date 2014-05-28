define(["utils", "mustache", "globals", "views/BaseView", "text!tmpl/hierarchy/hierarchy.html"],
    function (utils, Mustache, globals, BaseView, pageTemplate) {

        "use strict";


        var HierarchyView = BaseView.extend({
            tagName: "li",

            template: pageTemplate,

            events: {
                "click": "handleClick"
            },

            render: function () {
                this.$el.html(Mustache.render(this.template, this.getConfiguration()));
                return this;
            },

            getConfiguration: function () {
                var hierarchyConfiguration = null,
                    hierarchy;

                if (this.model) {
                    hierarchy = this.model.toJSON();
                    hierarchyConfiguration = utils._.extend({},
                        utils.deepClone(globals.hierarchyManager.configuration));

                    // populate configuration details
                    hierarchyConfiguration.name.value = hierarchy.name;
                    hierarchyConfiguration.displayNumber.value = hierarchy.displayNumber;
                }

                return {
                    "hierarchy" : hierarchyConfiguration
                };
            },

            /*
             * Event Handlers
             */
            handleClick: function (evt) {
                evt.preventDefault();

                this.trigger("hierarchySelected", this.model.get("accountId"));
            }
        });


        return HierarchyView;
    });
