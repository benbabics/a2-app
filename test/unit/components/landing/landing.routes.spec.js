(function () {
    "use strict";

    describe("A Landing Module Route Config", function () {

        var $q,
            $rootScope,
            $state,
            mockInvoiceSummary = {
                accountNumber     : "account number value",
                availableCredit   : "available credit value",
                closingDate       : "closing date value",
                currentBalance    : "current balance value",
                currentBalanceAsOf: "current balance as of value",
                invoiceId         : "invoice id value",
                invoiceNumber     : "invoice number value",
                minimumPaymentDue : "minimum payment due value",
                paymentDueDate    : "payment due date value"
            },
            mockUser = {
                newField1: "some value",
                newField2: "some other value",
                newField3: "yet another value",
                email    : "email address value",
                firstName: "first name value",
                username : "username value",
                company  : {
                    accountId    : "company account id value",
                    accountNumber: "company account number value",
                    name         : "company name value"
                },
                billingCompany: {
                    accountId    : "billing company account id value",
                    accountNumber: "billing company account number value",
                    name         : "billing company name value"
                }
            },
            InvoiceManager,
            UserManager;

        beforeEach(function () {

            module("app.shared");
            module("app.components.landing");
            module("app.html");

            // mock dependencies
            InvoiceManager = jasmine.createSpyObj("InvoiceManager", ["fetchCurrentInvoiceSummary"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            module(function($provide, sharedGlobals) {
                $provide.value("globals", sharedGlobals);
                $provide.value("InvoiceManager", InvoiceManager);
                $provide.value("UserManager", UserManager);
            });

            inject(function (_$q_, _$rootScope_, _$state_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
            });
        });

        describe("has a landing state that", function () {
            var state,
                stateName = "landing";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/landing");
            });

            it("should define a view on the root view container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/landing");
            });

            describe("when navigated to", function () {

                var fetchCurrentInvoiceSummaryDeferred;

                beforeEach(function () {
                    fetchCurrentInvoiceSummaryDeferred = $q.defer();
                    UserManager.getUser.and.returnValue(mockUser);
                    InvoiceManager.fetchCurrentInvoiceSummary.and.returnValue(fetchCurrentInvoiceSummaryDeferred.promise);

                    $state.go(stateName);
                    fetchCurrentInvoiceSummaryDeferred.resolve(mockInvoiceSummary);
                    $rootScope.$digest();
                });

                it("should call InvoiceManager.fetchCurrentInvoiceSummary with the correct account id", function () {
                    expect(InvoiceManager.fetchCurrentInvoiceSummary).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

            });
        });
    });
})();