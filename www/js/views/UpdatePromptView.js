define(["globals", "utils", "facade", "backbone", "mustache", "models/AppModel", "views/BaseView",
        "text!tmpl/updatePrompt/page.html"],
    function (globals, utils, facade, Backbone, Mustache, AppModel, BaseView, pageTemplate) {

        "use strict";


        var UpdatePromptView = BaseView.extend({
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
                // call super
                this.constructor.__super__.initialize.apply(this, arguments);

                // set context
                utils._.bindAll(this, "handleUpdateDismiss", "handleUpdateClick");

                this.appModel = AppModel.getInstance();
            },

            render: function () {
                var $content = this.$el.find(".ui-content");
                $content.html(Mustache.render(this.template, this.templateContent));
                $content.trigger("create");
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