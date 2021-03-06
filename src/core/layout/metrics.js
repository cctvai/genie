/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

const MOBILE_BREAK_WIDTH = 770;
export const BORDER_PAD_RATIO = 0.02;
export const GEL_MIN_ASPECT_RATIO = 4 / 3;
export const GEL_MAX_ASPECT_RATIO = 7 / 3;
export const CANVAS_WIDTH = 1400;
export const CANVAS_HEIGHT = 600;
export const CAMERA_X = CANVAS_WIDTH / 2;
export const CAMERA_Y = CANVAS_HEIGHT / 2;

const getScale = fp.curry((stageHeight, width, height) =>
    fp.cond([
        [() => width / height >= GEL_MIN_ASPECT_RATIO, () => height / stageHeight],
        [() => width / height < GEL_MIN_ASPECT_RATIO, () => width / (stageHeight * GEL_MIN_ASPECT_RATIO)],
    ])(),
);

export const calculateMetrics = fp.curry((stageHeight, { width, height }) => {
    const scale = getScale(stageHeight, width, height);
    const aspectRatio = fp.clamp(GEL_MIN_ASPECT_RATIO, GEL_MAX_ASPECT_RATIO, width / height);
    const stageWidth = aspectRatio * stageHeight;
    const isMobile = width < MOBILE_BREAK_WIDTH;
    const safeWidth = stageHeight * GEL_MIN_ASPECT_RATIO;
    const screenToCanvas = x => x / scale;

    return {
        width,
        height,
        scale,
        screenToCanvas,
        stageWidth,
        stageHeight,
        borderPad: fp.floor(fp.max([stageWidth, stageHeight]) * BORDER_PAD_RATIO),
        isMobile,
        buttonPad: isMobile ? 22 : 24,
        buttonMin: isMobile ? 42 : 64,
        hitMin: isMobile ? 64 : 70,
        horizontals: {
            left: -stageWidth / 2,
            center: 0,
            right: stageWidth / 2,
        },
        safeHorizontals: {
            left: -safeWidth / 2,
            center: 0,
            right: safeWidth / 2,
        },
        verticals: {
            top: -stageHeight / 2,
            middle: 0,
            bottom: stageHeight / 2,
        },
    };
});
