/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as Scaler from "../../../src/core/scaler.js";
import { Select } from "../../../src/components/select/select-screen.js";
import { GelGrid } from "../../../src/core/layout/grid/grid.js";
import { createTitles } from "../../../src/components/select/titles.js";
import * as singleItemMode from "../../../src/components/select/single-item-mode.js";

jest.mock("../../../src/components/select/titles.js");
jest.mock("../../../src/components/select/single-item-mode.js");
jest.mock("../../../src/core/screen.js");
jest.mock("../../../src/core/layout/grid/grid.js");
jest.mock("../../../src/core/layout/layout.js", () => ({
    addCustomGroup: jest.fn(),
}));

jest.mock("../../../src/core/state.js", () => ({
    create: jest.fn(() => ({
        getAll: jest.fn(() => []),
        get: jest.fn(() => ({ state: "locked" })),
    })),
}));

describe("Select Screen", () => {
    let characterSprites;
    let fillRectShapeSpy;
    let selectScreen;
    let mockLayout;
    let mockData;
    let mockBounds;
    let mockTextBounds;
    let mockMetrics;
    let mockChoices;
    let mockGelGrid;
    let mockGmi;

    beforeEach(() => {
        mockGmi = { sendStatsEvent: jest.fn() };
        createMockGmi(mockGmi);

        mockGelGrid = {
            choices: jest.fn(() => mockChoices),
            addGridCells: jest.fn(() => []),
            getCurrentPageKey: jest.fn(),
            resize: jest.fn(),
        };
        GelGrid.mockImplementation(() => mockGelGrid);
        singleItemMode.create = jest.fn(() => ({
            shutdown: jest.fn(),
        }));
        singleItemMode.isEnabled = jest.fn();
        mockData = {
            config: {
                theme: {
                    "test-select": {
                        titles: [
                            {
                                type: "image",
                                key: "title",
                            },
                            {
                                type: "text",
                                value: "",
                            },
                            {
                                type: "image",
                                key: "subtitle",
                            },
                            {
                                type: "text",
                                value: "",
                                visible: false,
                            },
                        ],
                        states: {
                            locked: { x: 10, y: 20, asset: "test_asset" },
                        },
                        choices: [
                            { asset: "character1" },
                            { asset: "character2", title: "character_2" },
                            { asset: "character3" },
                        ],
                        rows: 1,
                        columns: 1,
                        ease: "Cubic.easeInOut",
                        duration: 500,
                    },
                    game: {},
                },
            },
            popupScreens: [],
        };
        mockBounds = {
            x: 32,
            y: 32,
            height: 64,
            width: 64,
        };
        mockTextBounds = {
            ...mockBounds,
        };
        mockLayout = {
            buttons: {
                home: {
                    getHitAreaBounds: jest.fn(() => mockBounds),
                    type: "Sprite",
                },
                pause: {
                    getHitAreaBounds: jest.fn(() => mockBounds),
                    type: "Sprite",
                },
                previous: { accessibleElement: { focus: jest.fn() }, getBounds: jest.fn(() => mockBounds) },
                next: { accessibleElement: { focus: jest.fn() }, getBounds: jest.fn(() => mockBounds) },
                continue: {
                    accessibleElement: { update: jest.fn(), focus: jest.fn() },
                    getBounds: jest.fn(() => mockBounds),
                    input: {},
                    on: jest.fn(),
                },
            },
            addCustomGroup: jest.fn(),
            getSafeArea: jest.fn(() => "layout safe area"),
        };
        mockMetrics = {
            isMobile: false,
            buttonPad: 12,
            screenToCanvas: jest.fn(x => x),
        };
        mockChoices = [];
        fillRectShapeSpy = jest.fn();
        selectScreen = new Select();

        const addMocks = screen => {
            screen.setData(mockData);
            screen.transientData = {};
            screen.scene = { key: "test-select", scene: { events: { on: jest.fn() } } };
            screen.game = { canvas: { parentElement: "parent-element" } };
            screen.navigation = { next: jest.fn() };
            screen.setLayout = jest.fn(() => mockLayout);
            screen.add = {
                graphics: jest.fn(() => ({
                    fillRectShape: fillRectShapeSpy,
                    clear: jest.fn(),
                    fillStyle: jest.fn(),
                })),
                text: jest.fn(() => ({
                    ...mockTextBounds,
                    getBounds: jest.fn(() => mockTextBounds),
                })),
                image: jest.fn((x, y, imageName) => imageName),
                sprite: jest.fn((x, y, assetName) => {
                    if (assetName === "test-select.character1") {
                        return characterSprites[0];
                    }
                    if (assetName === "test-select.character2") {
                        return characterSprites[1];
                    }
                    if (assetName === "test-select.character3") {
                        return characterSprites[2];
                    }
                    if (assetName === "test_asset") {
                        return "test-sprite";
                    }
                }),
            };
            screen.events = {
                once: jest.fn(),
            };
            screen.addAnimations = jest.fn();

            screen.context = { theme: mockData.config.theme["test-select"] };

            Object.defineProperty(screen, "layout", {
                get: jest.fn(() => mockLayout),
            });

            screen._data = {
                parentScreens: [],
            };
            screen.scene.run = jest.fn();
            screen.scene.bringToTop = jest.fn();
        };

        addMocks(selectScreen);

        Scaler.getMetrics = jest.fn(() => mockMetrics);
        Scaler.onScaleChange = {
            add: jest.fn(() => ({ unsubscribe: jest.fn() })),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        test("adds a background image", () => {
            selectScreen.create();
            expect(selectScreen.add.image).toHaveBeenCalledWith(0, 0, "test-select.background");
        });

        test("adds animations", () => {
            selectScreen.create();
            jest.spyOn(selectScreen, "addAnimations");
            expect(selectScreen.addAnimations).toHaveBeenCalledTimes(1);
        });

        test("adds the theme", () => {
            selectScreen.create();
            expect(selectScreen.theme).toEqual(mockData.config.theme["test-select"]);
        });

        test("creates titles", () => {
            selectScreen.create();
            expect(createTitles).toHaveBeenCalledTimes(1);
        });

        test("adds GEL buttons to layout when singleItemMode is true", () => {
            singleItemMode.isEnabled = jest.fn(() => true);
            selectScreen.create();
            const expectedButtons = ["home", "pause", "previous", "next", "continue"];
            const expectedAccessibleButtons = ["home", "pause"];
            expect(selectScreen.setLayout).toHaveBeenCalledWith(expectedButtons, expectedAccessibleButtons);
        });

        test("adds GEL buttons to layout when singleItemMode is false", () => {
            singleItemMode.isEnabled = jest.fn(() => false);
            selectScreen.create();
            const expectedButtons = ["home", "pause", "previous", "next"];
            const expectedAccessibleButtons = ["home", "pause", "next", "previous"];
            expect(selectScreen.setLayout).toHaveBeenCalledWith(expectedButtons, expectedAccessibleButtons);
        });

        test("creates a GEL grid", () => {
            const theme = mockData.config.theme["test-select"];
            const expectedGridConfig = {
                choices: theme.choices,
                columns: 1,
                duration: 500,
                ease: "Cubic.easeInOut",
                onTransitionStart: expect.any(Function),
                rows: 1,
                states: {
                    locked: { asset: "test_asset", x: 10, y: 20 },
                },
                tabIndex: 6,
                titles: [
                    { key: "title", type: "image" },
                    { type: "text", value: "" },
                    { key: "subtitle", type: "image" },
                    { type: "text", value: "", visible: false },
                ],
            };
            selectScreen.create();
            expect(GelGrid).toHaveBeenCalledWith(selectScreen, expectedGridConfig);
        });

        test("creates grid cells", () => {
            selectScreen.create();
            expect(mockGelGrid.addGridCells).toHaveBeenCalledWith(selectScreen.theme);
        });

        test("adds grid to layout", () => {
            selectScreen.create();
            expect(selectScreen.layout.addCustomGroup).toHaveBeenCalledWith("grid", mockGelGrid, 6);
        });

        test("adds listener for scaler", () => {
            selectScreen.create();
            expect(Scaler.onScaleChange.add).toHaveBeenCalled();
        });
    });

    describe("events", () => {
        beforeEach(() => {
            jest.spyOn(eventBus, "subscribe");
        });

        test("saves choice to transient data", () => {
            mockChoices = [{ title: "Title 1" }];
            selectScreen.create();

            eventBus.subscribe.mock.calls[0][0].callback();
            expect(selectScreen.transientData["test-select"].choice.title).toBe("Title 1");
        });
    });

    describe("updateStates method", () => {
        test("updates the overlays for cells with matching id", () => {
            const mockCell = {
                button: {
                    config: { id: "id_one" },
                    overlays: { set: jest.fn() },
                    setImage: jest.fn(),
                    input: {},
                    accessibleElement: {
                        update: jest.fn(),
                    },
                },
            };

            selectScreen.create();

            selectScreen._cells = [mockCell];
            selectScreen.states.getAll = () => [{ id: "id_one", state: "locked" }];
            selectScreen.states.get = () => ({ id: "id_one", state: "locked" });

            selectScreen.context.theme.states = {
                locked: { x: 10, y: 20, overlayAsset: "test_asset" },
            };

            selectScreen.updateStates();

            expect(selectScreen._cells[0].button.overlays.set).toHaveBeenCalledWith("state", "test-sprite");
        });

        test("Assigns Phaser properties if properties block exists in config", () => {
            const mockCell = {
                button: {
                    config: { id: "id_one" },
                    overlays: { set: jest.fn() },
                    setImage: jest.fn(),
                    input: {},
                    sprite: {},
                    accessibleElement: {
                        update: jest.fn(),
                    },
                },
            };

            selectScreen.create();

            selectScreen._cells = [mockCell];
            selectScreen.states.getAll = () => [{ id: "id_one", state: "locked" }];

            selectScreen.context.theme.states = {
                locked: { x: 10, y: 20, properties: { testProp: "testValue" } },
            };

            selectScreen.updateStates();

            expect(selectScreen._cells[0].button.sprite.testProp).toBe("testValue");
        });

        test("Adds Aria label if suffix property exists in config", () => {
            const mockCell = {
                button: {
                    config: { id: "id_one", ariaLabel: "testLabel" },
                    overlays: { set: jest.fn() },
                    setImage: jest.fn(),
                    input: {},
                    sprite: {},
                    accessibleElement: {
                        update: jest.fn(),
                    },
                },
            };

            selectScreen.create();

            selectScreen._cells = [mockCell];
            selectScreen.states.getAll = () => [{ id: "id_one", state: "locked" }];

            selectScreen.context.theme.states = {
                locked: { x: 10, y: 20, suffix: "testSuffix" },
            };

            selectScreen.updateStates();

            expect(selectScreen._cells[0].button.config.ariaLabel).toBe("testLabel testSuffix");
        });

        test("updates the image if an asset property is available in the config block", () => {
            const mockCell = {
                button: {
                    config: { id: "id_one" },
                    overlays: { set: jest.fn() },
                    setImage: jest.fn(),
                    input: {},
                    accessibleElement: {
                        update: jest.fn(),
                    },
                },
            };

            selectScreen.create();

            selectScreen._cells = [mockCell];
            selectScreen.states.getAll = () => [{ id: "id_one", state: "locked" }];

            selectScreen.context.theme.states = {
                locked: { x: 10, y: 20, asset: "test_asset" },
            };

            selectScreen.updateStates();

            expect(selectScreen._cells[0].button.setImage).toHaveBeenCalledWith("test_asset");
        });
    });

    describe("resizing button sprites", () => {
        test("", () => {
            selectScreen.create();

            selectScreen._cells = [{ _id: "id_one", overlays: { set: jest.fn() } }];
        });
    });

    describe("onTransitionStart method", () => {
        test("disables the continue button if current cell state is disabled", () => {
            selectScreen.create();
            selectScreen.currentEnabled = jest.fn(() => false);

            const onTransitionStartFn = GelGrid.mock.calls[0][1].onTransitionStart;
            onTransitionStartFn();

            expect(mockLayout.buttons.continue.input.enabled).toBe(false);
            expect(mockLayout.buttons.continue.alpha).toBe(0.5);
        });

        test("enables the continue button if current cell state is enabled", () => {
            selectScreen.create();
            selectScreen.currentEnabled = jest.fn(() => true);

            const onTransitionStartFn = GelGrid.mock.calls[0][1].onTransitionStart;
            onTransitionStartFn();

            expect(mockLayout.buttons.continue.input.enabled).toBe(true);
            expect(mockLayout.buttons.continue.alpha).toBe(1);
        });

        test("does not error if no continue button", () => {
            selectScreen.create();
            delete mockLayout.buttons.continue;
            const onTransitionStartFn = GelGrid.mock.calls[0][1].onTransitionStart;
            expect(onTransitionStartFn).not.toThrow();
        });
    });

    describe("stats", () => {
        beforeEach(() => {
            jest.spyOn(eventBus, "subscribe");
        });

        test("fires a score stat to the GMI with when you select an item", () => {
            mockChoices = [{ title: "character_2" }];
            selectScreen.create();

            eventBus.subscribe.mock.calls[0][0].callback();
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("test", "select", {
                metadata: "ELE=[character_2]",
            });
        });
    });
});
