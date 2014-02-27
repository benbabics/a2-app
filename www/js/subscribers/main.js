define(["subscribers/about", "subscribers/app", "subscribers/login", "subscribers/updatePrompt"],
    function (aboutSubscriber, appSubscriber, loginSubscriber, updatePromptSubscriber) {

        "use strict";

        // app
        appSubscriber.init();

        // views
        aboutSubscriber.init();
        loginSubscriber.init();
        updatePromptSubscriber.init();
    });
