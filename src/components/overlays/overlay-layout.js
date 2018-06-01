/**
 * Overlay Layout
 * @module components/overlays/overlay-layout
 */

import fp from "../../../lib/lodash/fp/fp.js";

/**
 * Provides some shared behaviour common to all overlay screens such as:
 * - Adding a background
 * - Disabling buttons underneath the overlay when the overlay is opened
 * - Restoring buttons underneath the overlay when the overlay is when closed
 * - Moving GEL buttons to the top
 */

export function create(screen, backgroundImage) {
    const backgroundPriorityID = 999;
    const priorityID = backgroundPriorityID + screen.context.popupScreens.length;
    const previousLayouts = screen.scene.getLayouts();
    const accessibleGameButtons = screen.scene.getAccessibleGameButtons();
    const disabledButtons = disableAllButtons();

    return {
        addBackground,
        restoreDisabledButtons,
        moveGelButtonsToTop,
        moveToTop,
    };

    function addBackground(backgroundImage) {
        backgroundImage.inputEnabled = true;
        backgroundImage.input.priorityID = priorityID - 1;
        return screen.scene.addToBackground(backgroundImage);
    }

    function addButtonToDisabledButtons(button, disabledButtons) {
        button.input.enabled = false;
        disabledButtons.push(button);
        button.update();
        return disabledButtons;
    }

    function disableButtons(buttons, disabledButtons) {
        fp.forOwn(button => {
            if (button.input.enabled) {
                disabledButtons = addButtonToDisabledButtons(button, disabledButtons);
            }
        }, buttons);

        return disabledButtons;
    }

    function disableAllButtons() {
        let disabledButtons = [];

        fp.forOwn(layout => {
            disabledButtons = disableButtons(layout.buttons, disabledButtons);
        }, previousLayouts);

        disabledButtons = disableButtons(accessibleGameButtons, disabledButtons);

        return disabledButtons;
    }

    function restoreDisabledButtons() {
        fp.forOwn(button => {
            button.input.enabled = true;
            button.update();
        }, disabledButtons);
    }

    function moveGelButtonsToTop(gelLayout) {
        fp.forOwn(button => {
            button.input.priorityID = priorityID;
            button.parent.updateTransform();
            button.parent.parent.updateTransform();
            button.update();
        }, gelLayout.buttons);
    }

    function moveToTop(item) {
        item.inputEnabled = true;
        item.input.priorityID = priorityID;
    }
}
