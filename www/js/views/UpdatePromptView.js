define(["globals", "utils", "facade", "backbone", "mustache", "models/AppModel", "text!tmpl/updatePrompt/page.html"],
    function (globals, utils, facade, Backbone, Mustache, AppModel, pageTemplate) {

        "use strict";


        var UpdatePromptView = Backbone.View.extend({
            appModel: null,
            template: pageTemplate,

            el: "#updatePrompt",

            events: {
                "click .updatePromptPrimary"  : "handleUpdateClick",
                "click .updatePromptSecondary": "handleUpdateDismiss"
            },

            templateContent: {
                "title": null,
                "message": null,
                "primaryBtnLabel": null,
                "secondaryBtnLabel": null
            },

            initialize: function () {
                // set context
                utils._.bindAll(this, "handleUpdateDismiss", "handleUpdateClick");

                // cache $content
                this.$content = this.$el.find(":jqmData(role=content)");
                this.appModel = AppModel.getInstance();

                // parse the template
                Mustache.parse(this.template);
            },

            render: function () {
                this.$content.html(Mustache.render(this.template, this.templateContent));

                this.$content.trigger("create");
            },

            renderWarn: function () {
                this.templateContent = {
                    title: globals.UPDATE_APP.TITLE,
                    message: globals.UPDATE_APP.WARN_MESSAGE,
                    primaryBtnLabel: globals.UPDATE_APP.PRIMARY_BTN_LABEL,
                    secondaryBtnLabel: globals.UPDATE_APP.SECONDARY_BTN_LABEL
                };

                this.render();
            },

            renderFail: function () {
                this.templateContent = {
                    title: globals.UPDATE_APP.TITLE,
                    message: globals.UPDATE_APP.FAIL_MESSAGE,
                    primaryBtnLabel: globals.UPDATE_APP.PRIMARY_BTN_LABEL,
                    secondaryBtnLabel: null
                };

                this.render();
            },

            /**
             * Event Handlers
             */
            handleUpdateClick: function (evt) {
                evt.preventDefault();
                // TODO - The correct value need to be set into globals.UPDATE_APP.URL during the build
                // iOS - "itms://itunes.apple.com/us/app/wexonline/id568083909?mt=8&uo=4",
                // Android "market://details?id=com.wex.wol.accountmaintenance",
                window.open(globals.UPDATE_APP.URL, "_self"); //will not work in the simulator
            },

            handleUpdateDismiss: function () {
                this.appModel.set("lastWarnVersion", this.appModel.get("buildVersion"));
                this.appModel.save();
                facade.publish("login", "navigate");
            }
        });

        return UpdatePromptView;
    });