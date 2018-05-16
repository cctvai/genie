/**
 * The Sequencer provides a way of showing the game screens in the order defined in {@link ./main.js}.
 * It is a singleton, created in {@link core/startup.js} and added to `context.sequencer`. On creation, it adds
 * the screens to the game state, and starts the first one. It also provides a `next()` function to start
 * the next screen.
 *
 * State can also be passed from screen to screen. The state object has transient or persistent state
 * set on it. Transient state is for storing information about the current game, and persistent state will
 * save the data to local storage. This means that if a player has unlocked certain items in a game, they
 * will be remembered for return visits.
 *
 * @module core/sequencer
 */

import _ from "../lib/lodash/lodash.js";
import * as LayoutFactory from "./layout/factory.js";
import * as Screens from "./screens.js";

/**
 * @param  game The instance of Phaser.Game.
 * @param  context The context object.
 * @param  transitions A JSON object with transitions, from the main.js file.
 * @returns {{getTransitions: function}}
 */


export function create(game, context) {
    const layoutFactory = LayoutFactory.create(game);
    const screens = Screens.create({ game, context, layoutFactory }).screens;
    screens.init.next();
    const getTransitions = () => transitions;

    return { getTransitions };
}


