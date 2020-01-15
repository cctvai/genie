/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { GelButton } from "./gel-button.js";

export function addGelButton(x, y, metrics, config) {
    const gelButton = new GelButton(this.scene, x, y, metrics, config);
    this.displayList.add(gelButton);
    this.updateList.add(gelButton.sprite);
    return gelButton;
}
