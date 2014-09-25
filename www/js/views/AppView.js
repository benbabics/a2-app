define(["backbone", "facade", "mustache", "utils", "globals", "text!tmpl/common/jqueryDialog.html"],
    function (Backbone, facade, Mustache, utils, globals, dialogPageTemplate) {

        "use strict";


        var AppView = Backbone.View.extend({
            dialogTemplate: dialogPageTemplate,

            events: {
                "click [data-rel=back]"  : "handlePageBack",
                "click [data-rel=logout]": "handleLogout"
            },

            initialize: function () {
                // parse the template
                Mustache.parse(this.dialogTemplate);

                this.render();
                this.setupBackboneLoadingIndicators();
            },

            render: function (display) {
                display = display || false;
                return this.$el.toggleClass("ui-hidden", display);
            },

            setupBackboneLoadingIndicators: function () {
                // handle toggling loading indicator
                function handleLoader(toggle) {
                    // is this page visible?
                    if (this.$el.is(utils.$.mobile.activePage)) {
                        this[(toggle ? "show" : "hide") + "LoadingIndicator"]();
                    }
                }

                // Backbone.View convenience methods
                Backbone.View.prototype.showLoadingIndicator = function (checkView) {
                    if (checkView === true) {
                        handleLoader.call(this, true);
                    }
                    else {
                        try {
                            utils.$.mobile.loading("show");
                        } catch (ignore) {}
                    }
                };

                Backbone.View.prototype.hideLoadingIndicator = function (checkView) {
                    if (checkView === true) {
                        handleLoader.call(this, false);
                    }
                    else {
                        try {
                            // This call throws an exception if called during startup before mobile.loaderWidget is defined
                            utils.$.mobile.loading("hide");
                        } catch (ignore) {}
                    }
                };
            },

            /*
             * Displays a dialog box containing the data specified by dialogOptions
             * Options include:
             *    title - the title of the dialog
             *    message - the body of the dialog
             *    primaryBtnLabel - the label of the primary control
             *    primaryBtnHandler - the on click event of the primary button
             *    secondaryBtnLabel - the label of the secondary control (for confirm style dialogs)
             *    secondaryBtnHandler - the on click event of the secondary button
             *    tertiaryBtnLabel - the label of a tertiary control
             *    tertiaryBtnHandler - the on click event of the tertiary button
             *    popupbeforeposition - a function to be executed before the dialog is shown
             *    popupafteropen - a function to be executed once the dialog is displayed
             *    popupafterclose - a function to be executed once the dialog is closed
             *    highlightButton - the id of a button to highlight as active
             *    unhighlightButton - the id of a button to unhighlight as inactive
             */
            displayDialog: function (dialogOptions) {
                var currentPage, header, headerPosition, dialogBox, btnPrimary, btnSecondary, btnTertiary;

                currentPage = utils.$.mobile.activePage;

                // change the header from a fixed header so as to prevent weird dialog positioning and behavior
                header = currentPage.find(":jqmData(role='header')");
                if (header) {
                    headerPosition = header.css("position");
                    if (headerPosition === "fixed") {
                        header.css("position", "absolute");
                    }
                }

                // append the dialogue box
                currentPage.find(".ui-content").append(Mustache.render(this.dialogTemplate, dialogOptions));

                dialogBox = currentPage.find("#" + globals.DIALOG.ID);

                // get the dialog components
                btnPrimary = dialogBox.find("#" + globals.DIALOG.PRIMARY_BTN_ID);
                btnSecondary = dialogBox.find("#" + globals.DIALOG.SECONDARY_BTN_ID);
                btnTertiary = dialogBox.find("#" + globals.DIALOG.TERTIARY_BTN_ID);

                dialogBox.trigger("create"); //create JQM markup

                // assign any callbacks
                dialogBox.popup().bind({
                    popupbeforeposition: function () {
                        if (utils.isFn(dialogOptions.popupbeforeposition)) {
                            dialogOptions.popupbeforeposition();
                        }
                    },
                    popupafteropen: function () {
                        if (utils.isFn(dialogOptions.popupafteropen)) {
                            dialogOptions.popupafteropen();
                        }
                    },
                    popupafterclose: function () {
                        if (utils.isFn(dialogOptions.popupafterclose)) {
                            dialogOptions.popupafterclose();
                        }
                        if (header && header.css("position") === "absolute") {
                            header.css("position", headerPosition);
                        }
                        utils.$(this).remove(); //remove jqm popup markup on close
                    }
                });

                // assign button handlers
                btnPrimary.on("click", function () {
                    if (utils.isFn(dialogOptions.primaryBtnHandler)) {
                        dialogOptions.primaryBtnHandler();
                    }
                });
                btnSecondary.on("click", function () {
                    if (utils.isFn(dialogOptions.secondaryBtnHandler)) {
                        dialogOptions.secondaryBtnHandler();
                    }
                });
                btnTertiary.on("click", function () {
                    if (utils.isFn(dialogOptions.tertiaryBtnHandler)) {
                        dialogOptions.tertiaryBtnHandler();
                    }
                });

                //highlight and unhighlight specified buttons
                if (dialogOptions.highlightButton) {
                    this.highlightButton(dialogBox.find("#" + dialogOptions.highlightButton));
                }
                if (dialogOptions.unhighlightButton) {
                    this.unhighlightButton(dialogBox.find("#" + dialogOptions.unhighlightButton));
                }

                // open the dialog
                dialogBox.popup("open");

                // I'm not positive, but I don't think this hack is needed now that we are adding the dialog template
                // to the page currently active. Either way I had to comment out this code in order to get the
                // "window.history.back();" line to work in ContactUsController.showConfirmation and I'm leaving the
                // code in here rather then deleting it in case it needs to be added back in but added a TODO to delete
                // it later if my guess ends up being correct.

                // update the state so that closing the dialog using data-rel="back" returns to the right page.
                // Note that updating window.location.hash to dialogBox.attr("id") resulted in the list of fuel sites scrolling slightly, and pushing the state does not scroll
                // TODO - Delete this hack
                //window.history.pushState({}, "", "#" + dialogBox.attr("id"));
            },

            /**
             * helper methods for manipulating dialogue buttons.
             */
            highlightButton: function (button) {
                button.addClass("ui-btn-active");
            },

            unhighlightButton: function (button) {
                button.removeClass("ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e")
                    .addClass("ui-btn-up-d")
                    .attr("data-theme", "d");
            },

            navigateCheckConnection: function (callback) {
                // remove any previous event handlers
                utils.$("#reconnectButton").off();

                if (utils.isFn(callback)) {
                    utils.$("#reconnectButton").on("click", callback);
                }

                if (utils.isActivePage("networkMsg") === false) {
                    utils.changePage("#networkMsg");
                }
            },

            closeCheckConnection: function () {
                if (utils.isActivePage("networkMsg") === true) {
                    utils.$("#networkMsg").dialog("close");
                }
            },

            /**
             * Event Handlers
             */
            handlePageBack: function (evt) {
                evt.preventDefault();
                window.history.back();
            },

            handleLogout: function (evt) {
                evt.preventDefault();

                //TODO - Clear out page history so the hardware back button doesn't work?
                facade.publish("login", "userLogout");
            }
        });

        return AppView;
    });
