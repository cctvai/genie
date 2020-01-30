/**
 * @module accessibility/accessibilify
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { onScaleChange, getMetrics } from "../scaler.js";
import { accessibleDomElement } from "./accessible-dom-element.js";
import * as a11y from "./accessibility-layer.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../layout/metrics.js";

const CAMERA_SCROLL_X_OFFSET = CANVAS_WIDTH / 2;
const CAMERA_SCROLL_Y_OFFSET = CANVAS_HEIGHT / 2;

export function accessibilify(button, config, gameButton = true) {
    const fallbackNames = { id: button.name, ariaLabel: button.name };
    config = Object.assign(fallbackNames, config);

    let event;
    const sys = button.scene.sys;
    const scene = button.scene;
    const elementId = scene.scene.key + config.id;

    const buttonAction = () => button.emit(Phaser.Input.Events.POINTER_UP, button, sys.input.activePointer, false);
    const mouseOver = () => button.emit(Phaser.Input.Events.POINTER_OVER, button, sys.input.activePointer, false);
    const mouseOut = () => button.emit(Phaser.Input.Events.POINTER_OUT, button, sys.input.activePointer, false);

    const options = {
        id: elementId,
        htmlClass: "gel-button",
        ariaLabel: config.ariaLabel,
        parent: sys.scale.parent,
        onClick: buttonAction,
        onMouseOver: mouseOver,
        onMouseOut: mouseOut,
    };

    const getHitAreaBounds = () => {
        const marginLeft = parseInt(sys.game.canvas.style.marginLeft, 10);
        const marginTop = parseInt(sys.game.canvas.style.marginTop, 10);
        let bounds = button.getHitAreaBounds? button.getHitAreaBounds() : button.getBounds();

        const metrics = getMetrics();

        bounds.x += CAMERA_SCROLL_X_OFFSET;
        bounds.x *= metrics.scale;
        bounds.x += marginLeft;
        bounds.y += CAMERA_SCROLL_Y_OFFSET;
        bounds.y *= metrics.scale;
        bounds.y += marginTop;

        if (gameButton) {
            bounds.width *= metrics.scale;
            bounds.height *= metrics.scale;
        }

        return bounds;
    };

    const assignEvents = () => {
        const _destroy = button.destroy;
        button.destroy = () => {
            teardown();
            return _destroy.apply(button, arguments);
        };
        event = onScaleChange.add(resizeAndRepositionElement);
    };

    const setElementSizeAndPosition = () => {
        if (button.active) {
            const bounds = getHitAreaBounds();
            accessibleElement.position(bounds);
        }
    };

    const accessibleElement = accessibleDomElement(options);
    const resizeAndRepositionElement = fp.debounce(200, setElementSizeAndPosition);

    if (!sys.accessibleButtons) {
        sys.accessibleButtons = [];
    }

    if (gameButton) {
        sys.accessibleButtons.push(button);
    }

    assignEvents();
    resizeAndRepositionElement();

    button.accessibleElement = accessibleElement.el;
    button.elementId = elementId;
    button.elementEvents = accessibleElement.events;

    a11y.addToAccessibleButtons(scene, button);
    a11y.resetElementsInDom(scene);

    const teardown = () => {
        sys.events.off(Phaser.Scenes.Events.UPDATE, update);
        event.unsubscribe();
    };

    const update = () => {
        // TODO investigate if there is a better way to handle this
        // - currently all buttons are hooked into the update method and this is called every frame
        if (accessibleElement.el.getAttribute("aria-label") !== button.config.ariaLabel) {
            accessibleElement.el.setAttribute("aria-label", button.config.ariaLabel);
        }

        if ((button.input && !button.input.enabled) || !button.visible) {
            if (accessibleElement.visible()) {
                accessibleElement.hide();
            }
            return;
        }
        if (!accessibleElement.visible()) {
            accessibleElement.show();
        }
    };

    sys.events.on(Phaser.Scenes.Events.UPDATE, update);

    return button;
}
