define(["subscribers/about", "subscribers/app", "subscribers/card", "subscribers/contactUs",
        "subscribers/driver", "subscribers/hierarchy", "subscribers/home", "subscribers/invoice", "subscribers/login",
        "subscribers/updatePrompt"],
    function (aboutSubscriber, appSubscriber, cardSubscriber, contactUsSubscriber, driverSubscriber,
              hierarchySubscriber, homeSubscriber, invoiceSubscriber, loginSubscriber, updatePromptSubscriber) {

        "use strict";

        // app
        appSubscriber.init();

        // views
        aboutSubscriber.init();
        cardSubscriber.init();
        contactUsSubscriber.init();
        driverSubscriber.init();
        hierarchySubscriber.init();
        homeSubscriber.init();
        invoiceSubscriber.init();
        loginSubscriber.init();
        updatePromptSubscriber.init();
    });
