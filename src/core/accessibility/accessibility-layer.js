/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Buttons, findButtonByElementId } from "./accessible-buttons.js";
import { hideAndDisableElement } from "./element-manipulator.js";

let _accessibleButtons = {};

const hasAccessibleElement = button => {
    return !!(button.accessibleElement && button.accessibleElement.id);
};

const PARENT_ELEMENT_ID = "accessibility";

export const getAccessibleButtons = visibleLayer => _accessibleButtons[visibleLayer];

export const setup = gameParentElement => {
    const el = document.createElement("div");
    el.id = PARENT_ELEMENT_ID;
    el.setAttribute("role", "application");
    gameParentElement.appendChild(el);
};

export const addToAccessibleButtons = (screen, button) => {
    const visibleLayer = screen.visibleLayer;
    Buttons[button.elementId] = button;

    if (_accessibleButtons[visibleLayer]) {
        _accessibleButtons[visibleLayer].push(button);
    } else {
        _accessibleButtons[visibleLayer] = [button];
    }
};

export const removeFromAccessibleButtons = (screen, button) => {
    const visibleLayer = screen.visibleLayer;

    const idx = _accessibleButtons[visibleLayer].indexOf(button);

    if (idx !== -1) {
        _accessibleButtons[visibleLayer].splice(idx, 1);
    }
};

export const clearAccessibleButtons = screen => {
    if (screen) {
        _accessibleButtons[screen.visibleLayer] = [];
    } else {
        _accessibleButtons = {};
    }
};

export const clearElementsFromDom = () => {
    const parentElement = document.getElementById(PARENT_ELEMENT_ID);
    const childNodes = Array.from(parentElement.childNodes);
    childNodes.forEach(el => {
        if (document.activeElement === el) {
            hideAndDisableElement(el);
        } else {
            el.parentElement.removeChild(el);
        }
    });

    return parentElement;
};

export const setAccessibleLayer = (inputEnabled) => {
    const parentElement = document.getElementById(PARENT_ELEMENT_ID);
    const childNodes = Array.from(parentElement.childNodes);
    childNodes.forEach(el => {
        const button = findButtonByElementId(el.id);
        if(inputEnabled === true) {
            el.classList.remove("hide-focus-ring");
            el.style.cursor = "pointer";
            el.style["z-index"] = 0;
            el.setAttribute("tabindex", "0");
            el.addEventListener("click", button.elementEvents.click);
            el.addEventListener("keyup", button.elementEvents.keyup);
            button.input.enabled = true;
        } else {
            el.setAttribute("aria-label", "");
            el.classList.add("hide-focus-ring");
            el.style.cursor = "default";
            el.style["z-index"] = -1;
            el.setAttribute("tabindex", "-1");
            el.removeEventListener("click", button.elementEvents.click);
            el.removeEventListener("keyup", button.elementEvents.keyup);
            button.input.enabled = false;
        }
    });
}

export const appendElementsToDom = screen => {
    const buttons = getAccessibleButtons(screen.visibleLayer);
    const parentElement = document.getElementById(PARENT_ELEMENT_ID);

    buttons.forEach(button => {
        if (hasAccessibleElement(button)) {
            parentElement.appendChild(button.accessibleElement);
        }
    });
};

export const resetElementsInDom = screen => {
    clearElementsFromDom();
    appendElementsToDom(screen);
};
