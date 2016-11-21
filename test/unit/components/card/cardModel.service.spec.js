(function () {
    "use strict";

    describe("A Card Model Service", function () {

        var card;

        beforeEach(inject(function (CardModel) {
            card = new CardModel();
        }));

        describe("has a getStatusDisplayName function that", function () {

            describe("when the status is ACTIVE", function () {

                beforeEach(function () {
                    card.status = "ACTIVE";
                });

                it("should return 'Active'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Active");
                });
            });

            describe("when the status is SUSPENDED", function () {

                beforeEach(function () {
                    card.status = "SUSPENDED";
                });

                it("should return 'Suspended'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Suspended");
                });
            });

            describe("when the status is TERMINATED", function () {

                beforeEach(function () {
                    card.status = "TERMINATED";
                });

                it("should return 'Terminated'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Terminated");
                });
            });

            describe("when the status is UNKNOWN", function () {

                beforeEach(function () {
                    card.status = "UNKNOWN";
                });

                it("should return 'Unknown'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Unknown");
                });
            });


            describe("when the method is unrecognized", function () {

                beforeEach(function () {
                    card.status = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                });

                it("should return 'Unknown'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Unknown");
                });
            });

            describe("when the method is null", function () {

                beforeEach(function () {
                    card.status = null;
                });

                it("should return 'Unknown'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Unknown");
                });
            });

            describe("when the method is empty", function () {

                beforeEach(function () {
                    card.status = "";
                });

                it("should return 'Unknown'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Unknown");
                });
            });

            describe("when the method is undefined", function () {

                beforeEach(function () {
                    card.status = undefined;
                });

                it("should return 'Unknown'", function () {
                    expect(card.getStatusDisplayName()).toEqual("Unknown");
                });
            });
        });

        describe("has an isActive function that", function () {

            describe("when the Card status is Active", function () {

                beforeEach(function () {
                    card.status = "ACTIVE";
                });

                it("should return true", function () {
                    expect(card.isActive()).toBeTruthy();
                });

            });

            describe("when the Card status is Suspended", function () {

                beforeEach(function () {
                    card.status = "SUSPENDED";
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

            describe("when the Card status is Terminated", function () {

                beforeEach(function () {
                    card.status = "TERMINATED";
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

            describe("when the Card status is Unknown", function () {

                beforeEach(function () {
                    card.status = "UNKNOWN";
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

            describe("when the Card status is null", function () {

                beforeEach(function () {
                    card.status = null;
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

            describe("when the Card status is empty", function () {

                beforeEach(function () {
                    card.status = "";
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

            describe("when the Card status is undefined", function () {

                beforeEach(function () {
                    card.status = undefined;
                });

                it("should return false", function () {
                    expect(card.isActive()).toBeFalsy();
                });

            });

        });

        describe("has an isSuspended function that", function () {

            describe("when the Card status is Active", function () {

                beforeEach(function () {
                    card.status = "ACTIVE";
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

            describe("when the Card status is Suspended", function () {

                beforeEach(function () {
                    card.status = "SUSPENDED";
                });

                it("should return true", function () {
                    expect(card.isSuspended()).toBeTruthy();
                });

            });

            describe("when the Card status is Terminated", function () {

                beforeEach(function () {
                    card.status = "TERMINATED";
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

            describe("when the Card status is Unknown", function () {

                beforeEach(function () {
                    card.status = "UNKNOWN";
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

            describe("when the Card status is null", function () {

                beforeEach(function () {
                    card.status = null;
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

            describe("when the Card status is empty", function () {

                beforeEach(function () {
                    card.status = "";
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

            describe("when the Card status is undefined", function () {

                beforeEach(function () {
                    card.status = undefined;
                });

                it("should return false", function () {
                    expect(card.isSuspended()).toBeFalsy();
                });

            });

        });

        describe("has an isTerminated function that", function () {

            describe("when the Card status is Active", function () {

                beforeEach(function () {
                    card.status = "ACTIVE";
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

            describe("when the Card status is Suspended", function () {

                beforeEach(function () {
                    card.status = "SUSPENDED";
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

            describe("when the Card status is Terminated", function () {

                beforeEach(function () {
                    card.status = "TERMINATED";
                });

                it("should return true", function () {
                    expect(card.isTerminated()).toBeTruthy();
                });

            });

            describe("when the Card status is Unknown", function () {

                beforeEach(function () {
                    card.status = "UNKNOWN";
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

            describe("when the Card status is null", function () {

                beforeEach(function () {
                    card.status = null;
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

            describe("when the Card status is empty", function () {

                beforeEach(function () {
                    card.status = "";
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

            describe("when the Card status is undefined", function () {

                beforeEach(function () {
                    card.status = undefined;
                });

                it("should return false", function () {
                    expect(card.isTerminated()).toBeFalsy();
                });

            });

        });

    });
})();