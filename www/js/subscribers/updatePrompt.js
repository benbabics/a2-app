define(["facade", "controllers/UpdatePromptController"],
    function (facade, controller) {

        "use strict";


        /*
         * Update Prompt Subscribers
         */
        var subscribe;
        subscribe = facade.subscribeTo("updatePrompt", controller);
        subscribe("showPromptToUpdateFail", "showPromptToUpdateFail");
        subscribe("showPromptToUpdateWarn", "showPromptToUpdateWarn");


        return {
            init: function () {
                controller.init();
            }
        };
    });
