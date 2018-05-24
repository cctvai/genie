import { Screen } from "../../../core/screen.js";
import * as debug from "../../../core/debug.js";
import * as signal from "../../../core/signal-bus.js";

let hasCollided = false;

export class CollisionTest extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.keyLookup = this.scene.keyLookups["collision"];
        const debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        debugKey.onUp.add(() => {
            debug.toggle(this.game);
        });
    }

    create() {
        this.scene.addLayout(["home", "pause", "audioOff", "settings", "continue"]);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.spriteOne = this.game.add.sprite(0, 0, this.keyLookup.basicSprite);
        this.scene.addToBackground(this.spriteOne);
        this.game.physics.arcade.enable(this.spriteOne);
        debug.add(this.spriteOne, "rgba(255,0,0,0.4)", true);
        this.spriteOne.x = -200;

        this.spriteTwo = this.game.add.sprite(0, 0, this.keyLookup.basicSprite);
        this.scene.addToBackground(this.spriteTwo);
        this.game.physics.arcade.enable(this.spriteTwo);
        debug.add(this.spriteTwo, "rgba(255,0,0,0.4)", true);
        this.spriteTwo.x = 200;

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "continue",
            callback: this.navigation.next,
        });
    }

    update() {
        if (!hasCollided) {
            this.spriteOne.x += 1;
            this.spriteTwo.x -= 1;
        } else {
            this.spriteOne.x -= 1;
            this.spriteTwo.x += 1;
        }

        this.game.physics.arcade.collide(this.spriteOne, this.spriteTwo, () => {
            console.log("Collision!");
            hasCollided = true;
        });
    }

    render() {
        debug.render(this.game);
    }
}
