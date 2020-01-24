/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { ResultsText } from "./results-text.js";

export class ResultsRow extends Phaser.GameObjects.Container {
    constructor(scene, rowConfig, getDrawArea) {
        super(scene);
        this.rowConfig = rowConfig;
        this.getDrawArea = getDrawArea;
        this.drawRow();
        this.setContainerPosition();
        this.align();
    }

    align() {
        const lastGameObject = this.list.slice(-1)[0];
        const rowWidth = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
        if (this.rowConfig.align === "left") {
            this.list.forEach(gameObject => (gameObject.x += -rowWidth + gameObject.offsetX));
            return;
        }
        if (this.rowConfig.align === "right") {
            this.list.forEach(gameObject => (gameObject.x += gameObject.offsetX));
            return;
        }
        this.list.forEach(gameObject => (gameObject.x -= rowWidth / 2 - gameObject.offsetX));
    }

    addSection(gameObject, offsetX = 0, offsetY = 0) {
        const lastGameObject = this.list.slice(-1)[0];
        gameObject.x = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
        gameObject.y -= gameObject.height / 2 - offsetY;
        gameObject.offsetX = offsetX;
        this.add(gameObject);
    }

    drawRow() {
        this.rowConfig.format &&
            this.rowConfig.format.forEach(object => {
                if (object.type === "text") {
                    this.addSection(new ResultsText(this.scene, object), object.offsetX, object.offsetY);
                }
            });
    }

    getBoundingRect() {
        return this.getDrawArea();
    }

    setContainerPosition() {
        const { centerX, centerY } = this.getDrawArea();
        this.x = centerX;
        this.y = centerY;
    }

    reset() {
        this.setContainerPosition();
    }

    makeAccessible() {}
}
