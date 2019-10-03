/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { GEL_MIN_ASPECT_RATIO } from "../../core/layout/calculate-metrics.js";

export function createTestHarnessDisplay(scene) {
    let gameAreaGraphics;
    let outerPaddingGraphics;

    console.log("scene", scene)

    if (window.__qaMode) {
        const qaKey = scene.input.keyboard.addKey("q");
        qaKey.on("up", () => toggle(scene));
    }

    function toggle(scene) {
        if (window.__qaMode.testHarnessLayoutDisplayed) {
            hide(scene);
            console.log("Layout Test Harness Hidden"); // eslint-disable-line no-console
        } else {
            show(scene);
            console.log("Layout Test Harness Displayed"); // eslint-disable-line no-console
        }
    }

    function show(scene) {
        drawGameArea(scene);
        drawOuterPadding(scene);
        window.__qaMode.testHarnessLayoutDisplayed = true;
    }

    function drawGameArea(scene) {
        const areaWidth = GEL_MIN_ASPECT_RATIO * scene.game.canvas.height;
        const areaHeight = scene.game.canvas.height;
        gameAreaGraphics = scene.add.graphics({
            fillStyle: { color: 0x32cd32, alpha: 0.5 },
            add: true,
        });

        const rectangle = new Phaser.Geom.Rectangle(-areaWidth * 0.5, -areaHeight * 0.5, areaWidth, areaHeight);
        gameAreaGraphics.fillRectShape(rectangle);
    }

    function drawOuterPadding(scene) {
        const canvas = scene.game.canvas;
        const paddingWidth = getPaddingWidth(canvas);
        const gameLeftEdge = (paddingWidth * 2 - canvas.width) * 0.5;
        const gameTopEdge = (paddingWidth - canvas.height) * 0.5;
        const gameRightEdge = (paddingWidth * 2 - canvas.width) * -0.5;
        const gameBottomEdge = (paddingWidth - canvas.height) * -0.5;
        outerPaddingGraphics = scene.add.graphics({
            fillStyle: { color: 0xffff00, alpha: 0.5 },
            lineStyle: {
                width: paddingWidth,
                color: 0xffff00,
                alpha: 0.5,
            },
            add: true,
        });

        outerPaddingGraphics.strokePoints(
            [
                { x: gameLeftEdge, y: gameTopEdge },
                { x: gameRightEdge, y: gameTopEdge },
                { x: gameRightEdge, y: gameBottomEdge },
                { x: gameLeftEdge, y: gameBottomEdge },
            ],
            true,
            true,
        );
    }

    function hide() {
        gameAreaGraphics.destroy();
        outerPaddingGraphics.destroy();
        window.__qaMode.testHarnessLayoutDisplayed = false;
    }

    function getPaddingWidth(canvas) {
        const gelPaddingWidthPercentage = 0.02;
        return Math.max(canvas.width, canvas.height) * gelPaddingWidthPercentage;
    }
}
