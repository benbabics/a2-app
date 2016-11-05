(function () {
    "use strict";

    var CACHE_KEY_GLOBAL = "GLOBAL",
        CACHE_KEY_PREFIX = "CACHE",
        CACHE_KEY_SEPARATOR = ".",
        CACHE_KEY_SHARED = "SHARED";

    describe("A WEX Cache service", function () {

        beforeEach(function () {
            var self = this;

            //mock dependencies:
            self.UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            module(function ($provide) {
                $provide.value("UserManager", self.UserManager);
            });

            inject(function ($localStorage, $q, $rootScope, globals, UserAccountModel, UserModel, WexCache) {
                self.$localStorage = $localStorage;
                self.$q = $q;
                self.$rootScope = $rootScope;
                self.UserAccountModel = UserAccountModel;
                self.UserModel = UserModel;
                self.WexCache = WexCache;

                self.ONLINE_APPLICATION = globals.USER.ONLINE_APPLICATION;
            });

            //mocks:
            this.rejectHandler = jasmine.createSpy("rejectHandler");
            this.resolveHandler = jasmine.createSpy("resolveHandler");
        });

        describe("has a clearPropertyValue function that", function () {

            beforeEach(function () {
                this.propertyKey = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                this.WexCache.storePropertyValue(this.propertyKey, TestUtils.getRandomStringThatIsAlphaNumeric(10));

                this.WexCache.clearPropertyValue(this.propertyKey);
            });

            it("should clear the property from local storage", function () {
                expect(_.get(this.$localStorage, this.WexCache.getPropertyKey(this.propertyKey))).not.toBeDefined();
            });
        });

        describe("has a getPropertyKey function that", function () {

            beforeEach(function () {
                this.options = {};
                this.propertyKey = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    this.user = TestUtils.getRandomUser(this.UserModel, this.UserAccountModel, this.ONLINE_APPLICATION);
                    this.UserManager.getUser.and.returnValue(this.user);
                });

                describe("when given a view name", function () {

                    beforeEach(function () {
                        this.viewName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                        this.options.viewName = this.viewName;
                    });

                    it("should return the expected value", function () {
                        expect(this.WexCache.getPropertyKey(this.propertyKey, this.options)).toEqual([
                            CACHE_KEY_PREFIX,
                            this.user.username,
                            this.viewName.replace(/\./g, "_"),
                            this.propertyKey
                        ].join(CACHE_KEY_SEPARATOR));
                    });
                });

                describe("when NOT given a view name", function () {

                    it("should return the expected value", function () {
                        expect(this.WexCache.getPropertyKey(this.propertyKey, this.options)).toEqual([
                            CACHE_KEY_PREFIX,
                            this.user.username,
                            CACHE_KEY_GLOBAL,
                            this.propertyKey
                        ].join(CACHE_KEY_SEPARATOR));
                    });
                });
            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    this.UserManager.getUser.and.returnValue(null);
                });

                describe("when given a view name", function () {

                    beforeEach(function () {
                        this.viewName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                        this.options.viewName = this.viewName;
                    });

                    it("should return the expected value", function () {
                        expect(this.WexCache.getPropertyKey(this.propertyKey, this.options)).toEqual([
                            CACHE_KEY_PREFIX,
                            CACHE_KEY_SHARED,
                            this.viewName.replace(/\./g, "_"),
                            this.propertyKey
                        ].join(CACHE_KEY_SEPARATOR));
                    });
                });

                describe("when NOT given a view name", function () {

                    it("should return the expected value", function () {
                        expect(this.WexCache.getPropertyKey(this.propertyKey, this.options)).toEqual([
                            CACHE_KEY_PREFIX,
                            CACHE_KEY_SHARED,
                            CACHE_KEY_GLOBAL,
                            this.propertyKey
                        ].join(CACHE_KEY_SEPARATOR));
                    });
                });
            });
        });

        describe("has a mergePropertyValue function value that", function () {

            beforeEach(function () {
                this.options = {};
                this.propertyKey = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when the value is an array", function () {

                beforeEach(function () {
                    this.merge = function (dest, values, uniqueId) {
                        _.forEach(values, function (value, index) {
                            var searchKey,
                                existingValue;

                            if (uniqueId) {
                                searchKey = {};
                                searchKey[uniqueId] = value[uniqueId];
                            }

                            existingValue = _.find(dest, searchKey);

                            if (existingValue) {
                                dest[index] = value;
                            }
                            else {
                                dest.push(value);
                            }
                        });

                        return dest;
                    };

                    this.mockCreator = function () {
                        return {
                            mockValue: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };
                    };

                    this.value = TestUtils.getRandomArray(10, this.mockCreator);
                });

                describe("when given a mergeBy", function () {

                    beforeEach(function () {
                        this.options.mergeBy = "mockValue";
                    });

                    describe("should behave such that", commonTests);
                });

                describe("when NOT given a mergeBy", function () {

                    describe("should behave such that", commonTests);
                });

                function commonTests() {

                    describe("when the value already exists", function () {

                        beforeEach(function () {
                            this.existingValue = TestUtils.getRandomArray(10, this.mockCreator);
                        });

                        describe("when the existing value contains an updated element", function () {

                            beforeEach(function () {
                                this.existingValue.push(this.value[0]);

                                this.WexCache.storePropertyValue(this.propertyKey, this.existingValue);
                            });

                            beforeEach(function () {
                                this.WexCache.mergePropertyValue(this.propertyKey, this.value, this.options);
                            });

                            it("should store the expected value", function () {
                                expect(_.get(this.$localStorage, this.WexCache.getPropertyKey(this.propertyKey)))
                                    .toEqual(this.merge(this.existingValue, this.value, this.options.mergeBy));
                            });
                        });

                        describe("when the existing value does NOT contain an updated element", function () {

                            beforeEach(function () {
                                this.WexCache.storePropertyValue(this.propertyKey, this.existingValue);
                            });

                            beforeEach(function () {
                                this.WexCache.mergePropertyValue(this.propertyKey, this.value, this.options);
                            });

                            it("should store the expected value", function () {
                                expect(_.get(this.$localStorage, this.WexCache.getPropertyKey(this.propertyKey)))
                                    .toEqual(this.merge(this.existingValue, this.value, this.options.mergeBy));
                            });
                        });
                    });

                    describe("when the value does NOT already exist", function () {

                        beforeEach(function () {
                            this.WexCache.mergePropertyValue(this.propertyKey, this.value, this.options);
                        });

                        it("should store the expected value", function () {
                            expect(_.get(this.$localStorage, this.WexCache.getPropertyKey(this.propertyKey)))
                                .toEqual(this.merge([], this.value, this.options.mergeBy));
                        });
                    });
                }
            });

            describe("when the value is an object", function () {

                beforeEach(function () {
                    this.merge = function merge(dest, values) {
                        dest = _.assign(dest, values);
                        return dest;
                    };

                    this.mockCreator = function () {
                        return TestUtils.getRandomMap(10);
                    };

                    this.value = this.mockCreator();
                });

                describe("should behave such that", commonTests);

                function commonTests() {

                    describe("when the value already exists", function () {

                        beforeEach(function () {
                            this.existingValue = this.mockCreator();
                        });

                        describe("when the existing value contains an updated element", function () {

                            beforeEach(function () {
                                _.assign(this.existingValue, this.value);

                                this.WexCache.storePropertyValue(this.propertyKey, this.existingValue);
                            });

                            beforeEach(function () {
                                this.WexCache.mergePropertyValue(this.propertyKey, this.value, this.options);
                            });

                            it("should store the expected value", function () {
                                expect(_.get(this.$localStorage, this.WexCache.getPropertyKey(this.propertyKey)))
                                    .toEqual(this.merge(this.existingValue, this.value));
                            });
                        });

                        describe("when the existing value does NOT contain an updated element", function () {

                            beforeEach(function () {
                                this.WexCache.storePropertyValue(this.propertyKey, this.existingValue);
                            });

                            beforeEach(function () {
                                this.WexCache.mergePropertyValue(this.propertyKey, this.value, this.options);
                            });

                            it("should store the expected value", function () {
                                expect(_.get(this.$localStorage, this.WexCache.getPropertyKey(this.propertyKey)))
                                    .toEqual(this.merge(this.existingValue, this.value));
                            });
                        });
                    });

                    describe("when the value does NOT already exist", function () {

                        beforeEach(function () {
                            this.WexCache.mergePropertyValue(this.propertyKey, this.value, this.options);
                        });

                        it("should store the expected value", function () {
                            expect(_.get(this.$localStorage, this.WexCache.getPropertyKey(this.propertyKey)))
                                .toEqual(this.merge({}, this.value));
                        });
                    });
                }
            });

            describe("when the value is NOT an array or an object", function () {

                beforeEach(function () {
                    this.value = TestUtils.getRandomInteger(0, 100);
                });

                beforeEach(function () {
                    this.WexCache.mergePropertyValue(this.propertyKey, this.value, this.options);
                });

                it("should throw an error", function () {
                    var self = this;

                    expect(function () {
                        self.WexCache.mergePropertyValue(self.propertyKey, self.value, self.options);
                    }).toThrowError("Can't merge cache value: " + this.value + ". Unsupported type.");
                });
            });
        });

        describe("has a readPropertyValue function value that", function () {

            beforeEach(function () {
                this.options = {};
                this.propertyKey = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when the value exists", function () {

                beforeEach(function () {
                    this.WexCache.storePropertyValue(this.propertyKey, TestUtils.getRandomStringThatIsAlphaNumeric(10));
                });

                it("should read the property from local storage", function () {
                    expect(this.WexCache.readPropertyValue(this.propertyKey, this.options))
                        .toEqual(_.get(this.$localStorage, this.WexCache.getPropertyKey(this.propertyKey)));
                });
            });

            describe("when the value does NOT exist", function () {

                describe("when a defaultValue is given", function () {

                    beforeEach(function () {
                        this.options.defaultValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    });

                    it("should return the default value", function () {
                        expect(this.WexCache.readPropertyValue(this.propertyKey, this.options)).toEqual(this.options.defaultValue);
                    });
                });

                describe("when a defaultValue is NOT given", function () {

                    it("should return undefined", function () {
                        expect(this.WexCache.readPropertyValue(this.propertyKey, this.options)).toEqual(undefined);
                    });
                });
            });
        });

        describe("has a storePropertyValue function value that", function () {

            beforeEach(function () {
                this.options = {};
                this.propertyKey = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                this.value = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                this.result = this.WexCache.storePropertyValue(this.propertyKey, this.value, this.options);
            });

            it("should set the property value in local storage", function () {
                expect(_.get(this.$localStorage, this.WexCache.getPropertyKey(this.propertyKey))).toEqual(this.value);
            });

            it("should return the value", function () {
                expect(this.result).toEqual(this.value);
            });
        });

        describe("has a fetchPropertyValue function value that", function () {

            beforeEach(function () {
                this.fetchDataDeferred = this.$q.defer();
                this.fetchData = jasmine.createSpy("fetchData").and.returnValue(this.fetchDataDeferred.promise);

                this.options = {};
                this.propertyKey = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when the value is already cached", function () {

                beforeEach(function () {
                    this.value = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    this.WexCache.storePropertyValue(this.propertyKey, this.value);
                });

                describe("when given a ValueType", function () {

                    beforeEach(function () {
                        this.Model = function () {
                            return {set: _.noop};
                        };

                        this.options.ValueType = this.Model;
                    });

                    beforeEach(function () {
                        this.WexCache.fetchPropertyValue(this.propertyKey, this.fetchData, this.options)
                            .then(this.resolveHandler)
                            .catch(this.rejectHandler);

                        this.$rootScope.$digest();
                    });

                    it("should call fetchData", function () {
                        expect(this.fetchData).toHaveBeenCalledWith();
                    });

                    it("should resolve with the cached value", function () {
                        var expectedValue = new this.Model();
                        expectedValue.set(this.value);

                        expect(this.resolveHandler).toHaveBeenCalledWith(expectedValue);
                    });
                });

                describe("when NOT given a ValueType", function () {

                    beforeEach(function () {
                        this.WexCache.fetchPropertyValue(this.propertyKey, this.fetchData, this.options)
                            .then(this.resolveHandler)
                            .catch(this.rejectHandler);

                        this.$rootScope.$digest();
                    });

                    it("should call fetchData", function () {
                        expect(this.fetchData).toHaveBeenCalledWith();
                    });

                    it("should resolve with the cached value", function () {
                        expect(this.resolveHandler).toHaveBeenCalledWith(this.value);
                    });
                });
            });

            describe("when forceUpdate is set to true", function () {

                beforeEach(function () {
                    this.options.forceUpdate = true;
                });

                beforeEach(function () {
                    this.WexCache.fetchPropertyValue(this.propertyKey, this.fetchData, this.options)
                        .then(this.resolveHandler)
                        .catch(this.rejectHandler);

                    this.$rootScope.$digest();
                });

                describe("should behave such that", notCachedTests);
            });

            describe("when the value is NOT already cached", function () {

                beforeEach(function () {
                    this.WexCache.fetchPropertyValue(this.propertyKey, this.fetchData, this.options)
                        .then(this.resolveHandler)
                        .catch(this.rejectHandler);

                    this.$rootScope.$digest();
                });

                describe("should behave such that", notCachedTests);
            });

            function notCachedTests() {

                it("should call fetchData", function () {
                    expect(this.fetchData).toHaveBeenCalledWith();
                });

                describe("when fetchData succeeds", function () {

                    beforeEach(function () {
                        this.newValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                        this.fetchDataDeferred.resolve(this.newValue);

                        this.$rootScope.$digest();
                    });

                    it("should set the property value in local storage", function () {
                        expect(_.get(this.$localStorage, this.WexCache.getPropertyKey(this.propertyKey))).toEqual(this.newValue);
                    });

                    it("should resolve with the fetched value", function () {
                        expect(this.resolveHandler).toHaveBeenCalledWith(this.newValue);
                    });
                });

                describe("when fetchData fails", function () {

                    beforeEach(function () {
                        this.error = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                        this.fetchDataDeferred.reject(this.error);

                        this.$rootScope.$digest();
                    });

                    it("should reject with the expected error", function () {
                        expect(this.rejectHandler).toHaveBeenCalledWith(this.error);
                    });
                });
            }
        });
    });
})();