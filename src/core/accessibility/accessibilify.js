/**
 * @module accessibility/accessibilify
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { onScaleChange } from "../scaler.js";
import { accessibleDomElement } from "./accessible-dom-element.js";
import * as a11y from "./accessibility-layer.js";

const CAMERA_SCROLL_X_OFFSET = -700;
const CAMERA_SCROLL_Y_OFFSET = -300;

export function accessibilify(button, config, gameButton = true) {
    config = Object.assign(
        {
            id: button.name,
            ariaLabel: button.name,
        },
        config,
    );

    let signal;
    const sys = button.scene.sys;
    const scene = button.scene;
    const elementId = scene.scene.key + config.id;
    const accessibleElement = newAccessibleElement();
    const resizeAndRepositionElement = fp.debounce(200, setElementSizeAndPosition);

    if (gameButton) {
        sys.accessibleButtons.push(button);
    }

    assignEvents();
    resizeAndRepositionElement();

    button.update = update;
    button.accessibleElement = accessibleElement.el;
    button.elementId = elementId;
    button.elementEvents = accessibleElement.events;

    a11y.addToAccessibleButtons(scene, button);
    a11y.resetElementsInDom(scene);

    return button;

    function newAccessibleElement() {
        return accessibleDomElement({
            id: elementId,
            htmlClass: "gel-button",
            ariaLabel: config.ariaLabel,
            parent: sys.scale.parent,
            onClick: buttonAction,
            onMouseOver: mouseOver,
            onMouseOut: mouseOut,
        });
    }

    function getHitAreaBounds() {
        const realHeight = sys.game.canvas.height;
        const viewHeight = parseInt(sys.game.canvas.style.height, 10);
        const marginLeft = parseInt(sys.game.canvas.style.marginLeft, 10);
        const marginTop = parseInt(sys.game.canvas.style.marginTop, 10);

        let bounds = button.getBounds();
        bounds.topLeft = button.getTopLeft(bounds.topLeft, true);
        bounds.x -= CAMERA_SCROLL_X_OFFSET;
        bounds.x *= viewHeight / realHeight;
        bounds.x += marginLeft;
        bounds.y -= CAMERA_SCROLL_Y_OFFSET;
        bounds.y *= viewHeight / realHeight;
        bounds.y += marginTop;

        if (button.input.hitArea) {
            bounds.width = button.input.hitArea.width;
            bounds.height = button.input.hitArea.height;
            bounds.x += button.input.hitArea.x;
            bounds.y += button.input.hitArea.y;
        }
        return bounds;
    }

    function setElementSizeAndPosition() {
        if (button.active) {
            const bounds = getHitAreaBounds();
            accessibleElement.position(bounds);
        }
    }

    function assignEvents() {
        const _destroy = button.destroy;
        button.destroy = () => {
            teardown();
            return _destroy.apply(button, arguments);
        };
        signal = onScaleChange.add(resizeAndRepositionElement);
    }

    function teardown() {
        signal.unsubscribe();
    }

    function update() {
        if (!button.input.enabled) {
            if (accessibleElement.visible()) {
                accessibleElement.hide();
            }
            return;
        }

        if (!accessibleElement.visible()) {
            accessibleElement.show();
        }
    }

    function buttonAction() {
        // game.sound.unlock();
        // if (game.sound.context && game.sound.context.state === "suspended") {
        //     game.sound.resumeWebAudio();
        // }
        button.emit(Phaser.Input.Events.POINTER_UP, button, sys.input.activePointer, false);
    }

    function mouseOver() {
        button.emit(Phaser.Input.Events.POINTER_OVER, button, sys.input.activePointer, false);
    }

    function mouseOut() {
        button.emit(Phaser.Input.Events.POINTER_OUT, button, sys.input.activePointer, false);
    }
}
