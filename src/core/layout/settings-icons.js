import { settingsChannel } from "../settings.js";
import { gmi } from "../gmi.js";
import fp from "../../../lib/lodash/fp/fp.js";
import * as signal from "../signal-bus.js";

const fxConfig = {
    title: "FX Off",
    key: "fx-off-icon",
    id: "fx-off",
    signalName: "motion",
    icon: true,
};

const audioConfig = {
    title: "Audio Off",
    key: "audio-off-icon",
    id: "audio-off",
    signalName: "audio",
    icon: true,
};

const createSignals = (group, config) => {
    let icon;

    const callback = bool => {
        if (!bool && !icon) {
            icon = group.addButton(config, 0);
        } else if (bool && icon) {
            group.removeButton(icon);
            icon = undefined;
        }

        group.reset();
    };

    return signal.bus.subscribe({
        channel: settingsChannel,
        name: config.signalName,
        callback,
    });
};

const publish = fp.curry((settings, key) => {
    signal.bus.publish({
        channel: settingsChannel,
        name: key,
        data: settings[key],
    });
});

/**
 * Subscribes two callbacks to the settings signals which show / hide the fx and audio icons
 *
 * @param {String} group - group name e.g: "top-right"
 * @param {Array.<string>} buttonIds - Array of gel button identifiers
 * @returns {{unsubscribe: Function}}
 */
export const create = (group, buttonIds) => {
    let iconSignals = [];

    if (!buttonIds.includes("audioOff")) {
        iconSignals.push(createSignals(group, audioConfig));
    }

    iconSignals.push(createSignals(group, fxConfig));

    const settings = gmi.getAllSettings();

    ["audio", "motion"].forEach(publish(settings));

    return {
        unsubscribe: () => {
            iconSignals.forEach(iconsSignal => iconsSignal.unsubscribe());
        },
    };
};