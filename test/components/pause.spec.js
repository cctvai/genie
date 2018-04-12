import fp from "../../src/lib/lodash/fp/fp.js";
import { assert } from "chai";
import * as sinon from "sinon";

import * as Pause from "../../src/components/pause";
import * as signal from "../../src/core/signal-bus.js";

describe("Pause Overlay", () => {
    let mockGame;
    let mockScreen;
    let mockGelButtons;
    let mockLayoutDestroy;
    let backgroundImage;
    let backgroundImageInputEnabled;
    let backgroundImagePriorityID;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        mockGelButtons = {
            buttons: {
                home: { input: { priorityID: 0 } },
                audioOff: { input: { priorityID: 0 } },
                settings: { input: { priorityID: 0 } },
                play: { input: { priorityID: 0 } },
                restart: { input: { priorityID: 0 } },
                howToPlay: { input: { priorityID: 0 } },
            },
            destroy: sandbox.spy(),
        };

        mockLayoutDestroy = { destroy: sandbox.spy() };

        mockScreen = {
            layoutFactory: {
                keyLookups: { pause: { pauseBackground: "pauseBackgroundImage" } },
                addToBackground: sandbox.stub().returns(mockLayoutDestroy),
                addLayout: sandbox.stub().returns(mockGelButtons),
            },
            context: { popupScreens: [] },
            next: sandbox.spy(),
        };

        mockGame = {
            add: { image: sandbox.stub() },
            state: { current: "pauseScreen", states: { pauseScreen: mockScreen } },
            sound: { pauseAll: sandbox.spy(), resumeAll: sandbox.spy() },
            paused: false,
        };
        backgroundImageInputEnabled = sandbox.spy();
        backgroundImagePriorityID = sandbox.spy();
        backgroundImage = {
            inputEnabled: backgroundImageInputEnabled,
            input: {
                priorityID: backgroundImagePriorityID,
            },
        };
        mockGame.add.image.onCall(0).returns(backgroundImage);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("pause functionality", () => {
        beforeEach(() => {
            Pause.create({ game: mockGame });
        });

        it("pauses the sound", () => {
            const pauseSpy = mockGame.sound.pauseAll;
            assert.isTrue(pauseSpy.called);
        });

        it("adds pause to the popup screens", () => {
            assert.deepEqual(mockScreen.context.popupScreens, ["pause"]);
        });

        it("pauses the game", () => {
            assert.isTrue(mockGame.paused);
        });
    });

    describe("assets", () => {
        it("adds a background image", () => {
            Pause.create({ game: mockGame });

            const actualImageCall = mockGame.add.image.getCall(0);
            const expectedImageCall = [0, 0, "pauseBackgroundImage"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = mockScreen.layoutFactory.addToBackground.getCall(0);
            assert.deepEqual(addToBackgroundCall.args, [backgroundImage]);
        });

        it("adds GEL buttons", () => {
            Pause.create({ game: mockGame });
            const actualAddLayoutCall = mockScreen.layoutFactory.addLayout.getCall(0);
            const expectedAddLayoutCall = [
                "pauseHome",
                "audioOff",
                "settings",
                "pausePlay",
                "pauseRestart",
                "howToPlay",
            ];
            assert.deepEqual(actualAddLayoutCall.args[0], expectedAddLayoutCall);
        });

        it("adds a priority ID to each GEL button", () => {
            Pause.create({ game: mockGame });
            fp.forOwn(gelButton => {
                assert.equal(gelButton.input.priorityID, 999);
            }, mockGelButtons.buttons);
        });

        it("ups the priority ID on each GEL button if there are more popup screens", () => {
            mockScreen.context.popupScreens.push("howToPlay");
            Pause.create({ game: mockGame });
            fp.forOwn(gelButton => {
                assert.equal(gelButton.input.priorityID, 1000);
            }, mockGelButtons.buttons);
        });
    });

    describe("signals", () => {
        let signalSpy;

        beforeEach(() => {
            signalSpy = sandbox.spy(signal.bus, "subscribe");
            Pause.create({ game: mockGame });
        });

        it("adds signal subscriptions to all the GEL buttons", () => {
            assert.equal(signalSpy.callCount, 3);
            assert.equal(signalSpy.getCall(0).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(0).args[0].name, "play");
            assert.equal(signalSpy.getCall(1).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(1).args[0].name, "restart");
            assert.equal(signalSpy.getCall(2).args[0].channel, "pause-gel-buttons");
            assert.equal(signalSpy.getCall(2).args[0].name, "home");
        });

        it("destroys the pause screen when the play button is clicked", () => {
            signalSpy.getCall(0).args[0].callback();
            assert.isTrue(mockGelButtons.destroy.called);
            assert.isTrue(mockLayoutDestroy.destroy.called);
            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGame.sound.resumeAll.called);
            assert.deepEqual(mockScreen.context.popupScreens, []);
        });

        it("removes subscribed-to channel for this overlay", () => {
            const signalBusRemoveChannel = sandbox.spy(signal.bus, "removeChannel");
            const destroy = signalSpy.getCall(0).args[0].callback;
            destroy();
            sinon.assert.calledOnce(signalBusRemoveChannel.withArgs("pause-gel-buttons"));
        });

        it("destroys the pause screen when the restart button is clicked", () => {
            signalSpy.getCall(1).args[0].callback();
            assert.isTrue(mockGelButtons.destroy.called);
            assert.isTrue(mockLayoutDestroy.destroy.called);
            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGame.sound.resumeAll.called);
            assert.deepEqual(mockScreen.context.popupScreens, []);
        });

        it("calls the next method with params when the restart button is clicked", () => {
            signalSpy.getCall(1).args[0].callback();
            const actualNextArgs = mockScreen.next.getCall(0).args[0];
            const expectedNextArgs = { transient: { restart: true } };
            assert.deepEqual(actualNextArgs, expectedNextArgs);
        });

        it("destroys the pause screen when the home button is clicked", () => {
            signalSpy.getCall(2).args[0].callback();
            assert.isTrue(mockGelButtons.destroy.called);
            assert.isTrue(mockLayoutDestroy.destroy.called);
            assert.isFalse(mockGame.paused);
            assert.isTrue(mockGame.sound.resumeAll.called);
            assert.deepEqual(mockScreen.context.popupScreens, []);
        });

        it("calls the next method with params when the home button is clicked", () => {
            signalSpy.getCall(2).args[0].callback();
            const actualNextArgs = mockScreen.next.getCall(0).args[0];
            const expectedNextArgs = { transient: { home: true } };
            assert.deepEqual(actualNextArgs, expectedNextArgs);
        });
    });
});