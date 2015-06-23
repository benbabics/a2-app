(function () {
    "use strict";

    var Logger,
        $log,
        mockCurrentDate = new Date(),
        expectedTimeStamp = mockCurrentDate.getHours() + ":" +
            mockCurrentDate.getMinutes() + ":" +
            mockCurrentDate.getSeconds() + ":" +
            mockCurrentDate.getMilliseconds();

    describe("A Logger Service", function () {

        beforeEach(function () {
            module("app.shared.logger");

            inject(function (_$log_, _Logger_) {
                $log = _$log_;
                Logger = _Logger_;
            });

            jasmine.clock().mockDate(mockCurrentDate);
        });

        describe("has a debug function that", function () {

            describe("when enabled is false", function () {

                beforeEach(function () {
                    Logger.enabled(false);

                    spyOn($log, "debug");

                    Logger.debug("Test debug message");
                });

                it("should not call $log.debug", function () {
                    expect($log.debug).not.toHaveBeenCalled();
                });

            });

            describe("when enabled is true", function () {

                var message = "Test debug message";

                beforeEach(function () {
                    Logger.enabled(true);

                    spyOn($log, "debug");

                    Logger.debug(message);
                });

                it("should call $log.debug", function () {
                    expect($log.debug).toHaveBeenCalledWith([expectedTimeStamp + ": "] + [ message ]);
                });

            });

        });

        describe("has an error function that", function () {

            describe("when enabled is false", function () {

                beforeEach(function () {
                    Logger.enabled(false);

                    spyOn($log, "error");

                    Logger.error("Test error message");
                });

                it("should not call $log.error", function () {
                    expect($log.error).not.toHaveBeenCalled();
                });

            });

            describe("when enabled is true", function () {

                var message = "Test error message";

                beforeEach(function () {
                    Logger.enabled(true);

                    spyOn($log, "error");

                    Logger.error(message);
                });

                it("should call $log.error", function () {
                    expect($log.error).toHaveBeenCalledWith([expectedTimeStamp + ": "] + [ message ]);
                });

            });

        });

        describe("has an info function that", function () {

            describe("when enabled is false", function () {

                beforeEach(function () {
                    Logger.enabled(false);

                    spyOn($log, "info");

                    Logger.info("Test info message");
                });

                it("should not call $log.info", function () {
                    expect($log.info).not.toHaveBeenCalled();
                });

            });

            describe("when enabled is true", function () {

                var message = "Test info message";

                beforeEach(function () {
                    Logger.enabled(true);

                    spyOn($log, "info");

                    Logger.info(message);
                });

                it("should call $log.info", function () {
                    expect($log.info).toHaveBeenCalledWith([expectedTimeStamp + ": "] + [ message ]);
                });

            });

        });

        describe("has a log function that", function () {

            describe("when enabled is false", function () {

                beforeEach(function () {
                    Logger.enabled(false);

                    spyOn($log, "log");

                    Logger.log("Test log message");
                });

                it("should not call $log.log", function () {
                    expect($log.log).not.toHaveBeenCalled();
                });

            });

            describe("when enabled is true", function () {

                var message = "Test log message";

                beforeEach(function () {
                    Logger.enabled(true);

                    spyOn($log, "log");

                    Logger.log(message);
                });

                it("should call $log.log", function () {
                    expect($log.log).toHaveBeenCalledWith([expectedTimeStamp + ": "] + [ message ]);
                });

            });

        });

        describe("has a warn function that", function () {

            describe("when enabled is false", function () {

                beforeEach(function () {
                    Logger.enabled(false);

                    spyOn($log, "warn");

                    Logger.warn("Test warn message");
                });

                it("should not call $log.warn", function () {
                    expect($log.warn).not.toHaveBeenCalled();
                });

            });

            describe("when enabled is true", function () {

                var message = "Test warn message";

                beforeEach(function () {
                    Logger.enabled(true);

                    spyOn($log, "warn");

                    Logger.warn(message);
                });

                it("should call $log.warn", function () {
                    expect($log.warn).toHaveBeenCalledWith([expectedTimeStamp + ": "] + [ message ]);
                });

            });

        });

    });

})();