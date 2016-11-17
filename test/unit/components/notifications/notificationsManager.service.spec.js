(function () {
    "use strict";

    describe("A Notification Manager", function () {

        var self;

        beforeAll(function () {
            this.commonAppMockExclusions = ["NotificationsManager"];
        });

        beforeEach(function () {
            self = this;

            // mock dependencies
            this.UrbanAirship = jasmine.createSpyObj("UrbanAirship", ["ready"]);
            this.airShip = jasmine.createSpyObj("airShip", ["getChannelID"]);
            this.AlertsResource = jasmine.createSpyObj("AlertsResource", ["registerUserForNotifications"]);

            module(function ($provide) {
                $provide.value("UrbanAirship", self.UrbanAirship);
                $provide.value("AlertsResource", self.AlertsResource);
            });

            inject(function (_$q_, _$rootScope_, _NotificationsManager_) {
                self.$q = _$q_;
                self.$rootScope = _$rootScope_;
                self.NotificationsManager = _NotificationsManager_;
            });

            // set up spies
            this.resolveHandler = jasmine.createSpy("resolveHandler");
            this.rejectHandler = jasmine.createSpy("rejectHandler");

            this.UrbanAirship.ready.and.returnValue(this.$q.resolve(this.airShip));
        });

        afterEach(function () {
            self = null;
        });

        describe("has a registerUserForNotifications function that", function () {
            beforeEach(function () {
                this.channelId = TestUtils.getRandomStringThatIsAlphaNumeric(50);
                this.airShip.getChannelID.and.callFake(function (success, error) {
                    self.channelIdResolve = success;
                    self.channelIdReject = error;
                });

                this.NotificationsManager.registerUserForNotifications()
                    .then(this.resolveHandler)
                    .catch(this.rejectHandler);

                this.$rootScope.$digest();
            });

            describe("when airship.getChannelID fails", function () {
                beforeEach(function () {
                    this.channelIdResolve();
                    this.$rootScope.$digest();
                });

                it("should resolve", function () {
                    expect(this.resolveHandler).toHaveBeenCalled();
                    expect(this.rejectHandler).not.toHaveBeenCalled();
                });

            });

            describe("when airship.getChannelID succeeds", function () {
                beforeEach(function () {
                    this.registerDeferred = this.$q.defer();
                    this.AlertsResource.registerUserForNotifications.and.returnValue(this.registerDeferred.promise);
                    this.channelIdResolve(this.channelId);
                    this.$rootScope.$digest();
                });

                it("should call AlertsResource.registerUserForNotifications", function () {
                    expect(this.AlertsResource.registerUserForNotifications).toHaveBeenCalledWith(this.channelId);
                });

                describe("when AlertsResource.registerUserForNotifications fails", function () {
                    beforeEach(function () {
                        this.registerDeferred.reject();
                        this.$rootScope.$digest();
                    });

                    it("should resolve", function () {
                        expect(this.resolveHandler).toHaveBeenCalled();
                        expect(this.rejectHandler).not.toHaveBeenCalled();
                    });
                });

                describe("when AlertsResource.registerUserForNotifications succeeds", function () {
                    beforeEach(function () {
                        this.registerDeferred.resolve();
                        this.$rootScope.$digest();
                    });

                    it("should resolve", function () {
                        expect(this.resolveHandler).toHaveBeenCalled();
                        expect(this.rejectHandler).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
}());
