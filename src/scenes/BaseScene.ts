
export class BaseScene extends Phaser.Scene {
    protected static intlIsInitialized: boolean = false;

    constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config)
    }

    public getScreenSize() {
        const { width: screenWidth, height: screenHeight } = this.game.canvas;
        return { screenHeight, screenWidth };
    }
}
