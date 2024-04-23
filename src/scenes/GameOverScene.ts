import { ActionButton } from "../components/ActionButton";
import { BestScoreService } from "../components/services/BestScoreService";
import { GAME_OVER_SCENE, GAME_SCENE, MAIN_MENU_SCENE } from "../constants/scenes";
import { BaseScene } from "./BaseScene";

export class GameOverScene extends BaseScene {
    constructor() {
        super(GAME_OVER_SCENE);
    }

    public create() {
        const { screenHeight, screenWidth } = this.getScreenSize();

        this.add.bitmapText(screenWidth / 2, screenHeight / 8, 'font', "gameOver", 64)
            .setOrigin(.5);

        const menuButton = new ActionButton(this, "toMenuButton", screenWidth / 3, screenHeight / 8 * 7);
        menuButton.onClick(() => {
            this.navigateToMenuScene();
        });
        this.add.existing(menuButton);

        const tryAgainButton = new ActionButton(this, "tryAgainButton", screenWidth / 3 * 2, screenHeight / 8 * 7);
        tryAgainButton.onClick(() => {
            this.tryAgain();
        });
        this.add.existing(tryAgainButton);

        const currentScore = this.registry.get('score');
        const bestScore = BestScoreService.getInstance().getBestScore();

        // @ts-ignore
        this.add.bitmapText(screenWidth / 6 * 4, screenHeight / 12 * 5, 'font', "scoreLabel", 64, { score: currentScore })
            .setOrigin(.5);
        
         // @ts-ignore
         this.add.bitmapText(screenWidth / 6 * 4, screenHeight / 12 * 7, 'font', "bestScoreLabel", 64, { score: bestScore })
            .setOrigin(.5);

        this._setupMedal();
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

    private _setupMedal() {
        const { screenHeight, screenWidth } = this.getScreenSize();
        const currentScore = this.registry.get('score');

        let medalFrame = 0;
        if (currentScore >= 20) {
            if (currentScore < 30) {
                medalFrame = 3;
            } else if (currentScore < 40) {
                medalFrame = 1;
            } else if (currentScore < 50) {
                medalFrame = 2;
            }
        }

        this.add.image(screenWidth / 6 * 2, screenHeight / 2, 'medal', medalFrame)
            .setOrigin(.5)
            .setScale(3);
    }
}
