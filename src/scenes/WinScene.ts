import { ActionButton } from "../components/ActionButton";
import { WIN_SCENE, GAME_SCENE, MAIN_MENU_SCENE } from "../constants/scenes";
import { BaseScene } from "./BaseScene";

export class WinScene extends BaseScene {
    constructor() {
        super(WIN_SCENE);
    }

    public create() {
        const { screenHeight, screenWidth } = this.getScreenSize();

        this.add.bitmapText(screenWidth / 2, screenHeight / 8, 'font', "Congratulations", 64)
            .setOrigin(.5);

        const tryAgainButton = new ActionButton(this, "Play Again", screenWidth / 2, screenHeight / 8 * 7);
        tryAgainButton.onClick(() => {
            this.tryAgain();
        });
        this.add.existing(tryAgainButton);

    }

    public navigateToMenuScene() {
        this.scene.stop();
        this.game.scene.stop(GAME_SCENE);
        this.scene.launch(MAIN_MENU_SCENE);
    }

    public tryAgain() {
        this.scene.stop();
        this.game.scene.stop(GAME_SCENE);
        this.scene.launch(GAME_SCENE);
    }

}
