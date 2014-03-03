define(["subscribers/about", "subscribers/app", "subscribers/contactUs", "subscribers/home", "subscribers/login", "subscribers/updatePrompt"],
    function (aboutSubscriber, appSubscriber, contactUsSubscriber, homeSubscriber, loginSubscriber, updatePromptSubscriber) {

        "use strict";

        // app
        appSubscriber.init();

        // views
        aboutSubscriber.init();
        contactUsSubscriber.init();
        homeSubscriber.init();
        loginSubscriber.init();
        updatePromptSubscriber.init();
    });
