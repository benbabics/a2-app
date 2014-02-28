define(["subscribers/about", "subscribers/app", "subscribers/contactUs", "subscribers/login", "subscribers/updatePrompt"],
    function (aboutSubscriber, appSubscriber, contactUsSubscriber, loginSubscriber, updatePromptSubscriber) {

        "use strict";

        // app
        appSubscriber.init();

        // views
        aboutSubscriber.init();
        contactUsSubscriber.init();
        loginSubscriber.init();
        updatePromptSubscriber.init();
    });
