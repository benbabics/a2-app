(function () {
    "use strict";

    describe("An MenuDelegate service", function () {

        var MenuDelegate,
            MenuController,
            ElementUtil,
            sideMenu;

        beforeEach(function () {

            //mock dependencies
            MenuController = jasmine.createSpyObj("MenuController", [
                "closeMenu",
                "goToHome",
                "goToMakePayment",
                "goToPaymentActivity",
                "goToTransactionActivity",
                "goToCards",
                "goToContactUs",
                "goToTermsOfUse",
                "goToPrivacyPolicy",
                "goToLogOut"
            ]);
            ElementUtil = jasmine.createSpyObj("ElementUtil", ["getSideMenu"]);
            sideMenu = jasmine.createSpyObj("sideMenu", ["controller"]);

            //setup mocks
            sideMenu.controller.and.returnValue(MenuController);
            ElementUtil.getSideMenu.and.returnValue(sideMenu);

            module("app.shared");
            module("app.components.menu", function ($provide) {
                $provide.value("MenuController", MenuController);
                $provide.value("ElementUtil", ElementUtil);
            });

            inject(function (_MenuDelegate_) {
                MenuDelegate = _MenuDelegate_;
            });
        });

        describe("has a closeMenu function that", function () {

            beforeEach(function () {
                MenuDelegate.closeMenu();
            });

            it("should call MenuController.closeMenu", function () {
                expect(MenuController.closeMenu).toHaveBeenCalledWith();
            });
        });

        describe("has a goToHome function that", function () {

            beforeEach(function () {
                MenuDelegate.goToHome();
            });

            it("should call MenuController.goToHome", function () {
                expect(MenuController.goToHome).toHaveBeenCalledWith();
            });
        });

        describe("has a goToMakePayment function that", function () {

            beforeEach(function () {
                MenuDelegate.goToMakePayment();
            });

            it("should call MenuController.goToMakePayment", function () {
                expect(MenuController.goToMakePayment).toHaveBeenCalledWith();
            });
        });

        describe("has a goToPaymentActivity function that", function () {

            beforeEach(function () {
                MenuDelegate.goToPaymentActivity();
            });

            it("should call MenuController.goToPaymentActivity", function () {
                expect(MenuController.goToPaymentActivity).toHaveBeenCalledWith();
            });
        });

        describe("has a goToTransactionActivity function that", function () {

            beforeEach(function () {
                MenuDelegate.goToTransactionActivity();
            });

            it("should call MenuController.goToTransactionActivity", function () {
                expect(MenuController.goToTransactionActivity).toHaveBeenCalledWith();
            });
        });

        describe("has a goToCards function that", function () {

            beforeEach(function () {
                MenuDelegate.goToCards();
            });

            it("should call MenuController.goToCards", function () {
                expect(MenuController.goToCards).toHaveBeenCalledWith();
            });
        });

        describe("has a goToContactUs function that", function () {

            beforeEach(function () {
                MenuDelegate.goToContactUs();
            });

            it("should call MenuController.goToContactUs", function () {
                expect(MenuController.goToContactUs).toHaveBeenCalledWith();
            });
        });

        describe("has a goToTermsOfUse function that", function () {

            beforeEach(function () {
                MenuDelegate.goToTermsOfUse();
            });

            it("should call MenuController.goToTermsOfUse", function () {
                expect(MenuController.goToTermsOfUse).toHaveBeenCalledWith();
            });
        });

        describe("has a goToPrivacyPolicy function that", function () {

            beforeEach(function () {
                MenuDelegate.goToPrivacyPolicy();
            });

            it("should call MenuController.goToPrivacyPolicy", function () {
                expect(MenuController.goToPrivacyPolicy).toHaveBeenCalledWith();
            });
        });

        describe("has a goToLogOut function that", function () {

            beforeEach(function () {
                MenuDelegate.goToLogOut();
            });

            it("should call MenuController.goToLogOut", function () {
                expect(MenuController.goToLogOut).toHaveBeenCalledWith();
            });
        });
    });
})();
