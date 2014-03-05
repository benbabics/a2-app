define(["backbone", "mustache", "utils", "globals", 'text!tmpl/common/jqueryDialog.html'],
    function (Backbone, Mustache, utils, globals, dialogTemplate) {

        "use strict";


        var AppView = Backbone.View.extend({
            events: {
                "click [data-rel=back]": "handlePageBack"
            },

            initialize: function () {
                this.render();
            },

            render: function (display) {
                display = display || false;
                return this.$el.toggleClass("ui-hidden", display);
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
                var currentPage, header, headerPosition, empty, dialogBox, btnPrimary, btnSecondary, btnTertiary;

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
                currentPage.find(":jqmData(role=content)").append(Mustache.render(dialogTemplate, dialogOptions));

                dialogBox = currentPage.find("#" + globals.DIALOG.ID);

                empty = function () {};

                // get the dialog components
                btnPrimary = dialogBox.find("#" + globals.DIALOG.PRIMARY_BTN_ID);
                btnSecondary = dialogBox.find("#" + globals.DIALOG.SECONDARY_BTN_ID);
                btnTertiary = dialogBox.find("#" + globals.DIALOG.TERTIARY_BTN_ID);

                dialogBox.trigger("create"); //create JQM markup

                // assign any callbacks
                dialogBox.popup().bind({
                    popupbeforeposition: (dialogOptions.popupbeforeposition || empty),
                    popupafteropen     : (dialogOptions.popupafteropen || empty),
                    popupafterclose    : function () {
                        if (dialogOptions.popupafterclose) {
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
                    if (dialogOptions.primaryBtnHandler) {
                        dialogOptions.primaryBtnHandler();
                    }
                });
                btnSecondary.on("click", function () {
                    if (dialogOptions.secondaryBtnHandler) {
                        dialogOptions.secondaryBtnHandler();
                    }
                });
                btnTertiary.on("click", function () {
                    if (dialogOptions.tertiaryBtnHandler) {
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

                // update the state so that closing the dialog using data-rel="back" returns to the right page.
                //Note that updating window.location.hash to dialogBox.attr("id") resulted in the list of fuel sites scrolling slightly, and pushing the state does not scroll
                window.history.pushState({}, "", "#" + dialogBox.attr("id"));
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
            }
        });

        return AppView;
    });
