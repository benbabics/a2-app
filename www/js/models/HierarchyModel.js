define(["backbone", "utils", "collections/HierarchyCollection"],
    function (Backbone, utils, HierarchyCollection) {

        "use strict";


        var HierarchyModel = Backbone.Model.extend({
            defaults: {
                "accountId"    : null,
                "name"         : null,
                "displayNumber": null,
                "children"     : null
            },

            initialize: function (options) {
                if (options) {
                    if (options.accountId) { this.set("accountId", options.accountId); }
                    if (options.name) { this.set("name", options.name); }
                    if (options.displayNumber) { this.set("displayNumber", options.displayNumber); }
                    if (options.children) { this.setChildren(options.children); }
                }
            },

            setChildren: function (childrenList) {
                var children,
                    hierarchy;

                // There is a circular dependency so we need to make sure that HierarchyCollection is defined
                // See http://requirejs.org/docs/api.html#circular
                if (!HierarchyCollection) {
                    HierarchyCollection = require("collections/HierarchyCollection");
                }

                children = new HierarchyCollection();
                utils._.each(childrenList, function (childOptions) {
                    hierarchy = new HierarchyModel();
                    hierarchy.initialize(childOptions);
                    children.add(hierarchy);
                });

                this.set("children", children);
            },


            toJSON: function () {
                var json = HierarchyModel.__super__.toJSON.apply(this, arguments);

                if (json.children) {
                    json.children = json.children.toJSON();
                }

                return json;
            }
        });

        return HierarchyModel;
    });
