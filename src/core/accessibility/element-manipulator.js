/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { findButtonByElementId } from "./accessible-buttons.js";

export const hideAndDisableElement = el => {
    if (!elementHiddenAndDisabled(el)) {
        el.setAttribute("aria-label", "");
        const button = findButtonByElementId(el.id);
        const resetElement = () => resetElementToDefault(el, resetElement);
        el.addEventListener("blur", resetElement);
        el.classList.add("hide-focus-ring");
        el.style.cursor = "default";
        el.style["z-index"] = -1;
        el.removeEventListener("click", button.elementEvents.click);
        el.removeEventListener("keyup", button.elementEvents.keyup);
        setElementAsHiddenAndDisabled(el);
    }
};

const resetElementToDefault = (el, self) => {
    const button = findButtonByElementId(el.id);
    el.parentElement.removeChild(el);
    el.removeEventListener("blur", self);
    el.classList.remove("hide-focus-ring");
    el.style.cursor = "pointer";
    el.style["z-index"] = null;
    el.addEventListener("click", button.elementEvents.click);
    el.addEventListener("keyup", button.elementEvents.keyup);
    unsetElementAsHiddenAndDisabled(el);
};

const elementHiddenAndDisabled = element => {
    return _elementHiddenAndDisabled[element.id];
};

const setElementAsHiddenAndDisabled = element => {
    _elementHiddenAndDisabled[element.id] = true;
};

const unsetElementAsHiddenAndDisabled = element => {
    _elementHiddenAndDisabled[element.id] = false;
};

const _elementHiddenAndDisabled = {};