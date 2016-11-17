(function () {
    "use strict";

    var DataStore,
        collection,
        collections = [
            {
                name: "some collection",
                data: [
                    {
                        "key" : "value"
                    }
                ]
            }
        ],
        Loki;

    describe("A DataStore", function () {

        beforeEach(inject(function (_DataStore_, _Loki_) {
            DataStore = _DataStore_;
            Loki = _Loki_;
        }));

        describe("has a addCollection function that", function () {

            describe("when passed a null collection", function () {

                it("should return null", function () {
                    expect(DataStore.addCollection(null)).toBeNull();
                });
            });

            describe("when passed a collection with no name property", function () {

                it("should return null", function () {
                    expect(DataStore.addCollection({})).toBeNull();
                });
            });

            describe("when passed a valid collection to add", function () {
                beforeEach(function () {
                    collection = {
                        "NAME": "some collection"
                    };
                });

                it("should call Loki.addCollection with some collection.", function () {
                    // TODO figure out how to test this
                });

                it("should return some collection.", function () {
                    // TODO figure out how to test this
                });
            });
        });

        describe("has a getCollection function that", function () {
            beforeEach(function () {
                DataStore.setStoredCollections(collections);
            });

            describe("when passed a null collection", function () {

                it("should return null.", function () {
                    expect(DataStore.getCollection(null)).toBeNull();
                });
            });

            describe("when passed a collection with no name property", function () {

                it("should return null.", function () {
                    expect(DataStore.getCollection({})).toBeNull();
                });
            });

            describe("when passed a collection that does not exist", function () {
                beforeEach(function () {
                    collection = {
                        "NAME" : "A Non Existent Collection Name"
                    };
                });

                it("should return null.", function () {
                    expect(DataStore.getCollection(collection)).toBeNull();
                });
            });

            describe("when passed a collection that does exist", function () {
                beforeEach(function () {
                    collection = {
                        "NAME": "some collection"
                    };
                });

                it("should return some collection.", function () {
                    expect(DataStore.getCollection(collection)).toEqual(collections[0]);
                });
            });
        });

    });

})();
