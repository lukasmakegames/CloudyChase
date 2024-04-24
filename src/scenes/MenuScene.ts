import { ActionButton } from "../components/ActionButton";
import { GameBackground } from "../components/GameBackground";
import { GAME_SCENE, MAIN_MENU_SCENE } from "../constants/scenes";
import { BaseScene } from "./BaseScene";

export default class MainMenu extends BaseScene {
    constructor() {
        super(MAIN_MENU_SCENE)
    }

    public create() {
        GameBackground.AddToScene(this);

        const { screenHeight, screenWidth } = this.getScreenSize();

        this.add.bitmapText(screenWidth / 2, screenHeight / 5, 'font', 'Cloudy Chase', 128)
            .setOrigin(.5);

        const playGameButton = new ActionButton(this, "Play Game", screenWidth * 0.5, screenHeight / 2)
            .onClick(() => {
                this.StartNewGame();
            });

        this.add.existing(playGameButton);
    }

    protected StartNewGame() {
        this.scene.start(GAME_SCENE)
    }

    protected RemoveAdsAction() {
        
    }
}
