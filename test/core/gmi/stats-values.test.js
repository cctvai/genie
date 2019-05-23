/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as StatsValues from "../../../src/core/gmi/stats-values.js";

describe("GMI - Stats Values", () => {
    let fakeSettings;
    let fakeVisibleLayer;

    beforeEach(() => {
        fakeSettings = {
            audio: true,
            subtitles: false,
            motion: true,
            gameData: { characterSelected: 1, buttonPressed: 3 },
        };
        fakeVisibleLayer = "visible-layer";
    });

    afterEach(() => jest.clearAllMocks());

    describe("getValues method", () => {
        test("returns values for first click", () => {
            const actualValues = StatsValues.getValues("click", fakeSettings, fakeVisibleLayer);
            const expectedValues = {
                action_name: "game_first_click",
                game_template: "genie",
                game_screen: "visible-layer",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            };
            expect(JSON.stringify(actualValues)).toEqual(JSON.stringify(expectedValues));
        });

        test("returns values when this click isn't the first", () => {
            StatsValues.getValues("click", fakeSettings, fakeVisibleLayer);
            const actualValues = StatsValues.getValues("click", fakeSettings, fakeVisibleLayer);
            const expectedValues = {
                action_name: "game_click",
                game_template: "genie",
                game_screen: "visible-layer",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            };
            expect(actualValues).toEqual(expectedValues);
        });

        test("returns values for the continue stat", () => {
            const actualValues = StatsValues.getValues("continue", fakeSettings, fakeVisibleLayer);
            const expectedValues = {
                action_name: "game_level",
                action_type: "continue",
                game_template: "genie",
                game_screen: "visible-layer",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            };
            expect(actualValues).toEqual(expectedValues);
        });

        test("returns values for the heartbeat stat", () => {
            const actualValues = StatsValues.getValues("heartbeat", fakeSettings, fakeVisibleLayer);
            const expectedValues = {
                action_name: "timer",
                action_type: "heartbeat",
                game_template: "genie",
                game_screen: "visible-layer",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            };
            expect(actualValues).toEqual(expectedValues);
        });

        test("returns values for the game loaded stat", () => {
            const actualValues = StatsValues.getValues("game_loaded", fakeSettings, fakeVisibleLayer);
            const expectedValues = {
                action_name: "game_loaded",
                action_type: true,
                game_template: "genie",
                game_screen: "visible-layer",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            };
            expect(actualValues).toEqual(expectedValues);
        });

        test("returns values for the game complete stat", () => {
            const actualValues = StatsValues.getValues("game_complete", fakeSettings, fakeVisibleLayer);
            const expectedValues = {
                action_name: "game_level",
                action_type: "complete",
                game_template: "genie",
                game_screen: "visible-layer",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            };
            expect(actualValues).toEqual(expectedValues);
        });

        test("returns values for the replay stat", () => {
            const actualValues = StatsValues.getValues("replay", fakeSettings, fakeVisibleLayer);
            const expectedValues = {
                action_name: "game_level",
                action_type: "playagain",
                game_template: "genie",
                game_screen: "visible-layer",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            };
            expect(actualValues).toEqual(expectedValues);
        });
    });
});