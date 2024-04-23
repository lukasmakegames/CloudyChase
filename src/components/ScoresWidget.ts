import { BaseScene } from "../scenes/BaseScene";

export class ScoresWidget extends Phaser.GameObjects.DynamicBitmapText {
    protected static readonly I18NKey = "scoresWidgetText";
    protected static readonly SCORE_INTERPOLATION_KEY = 'score';

    static AddToScene(scene: BaseScene, y: number) {
        const object = new this(scene, y);
        scene.add.existing(object);

        return object;
    }

    protected constructor(scene: BaseScene, y: number) {
        const { screenWidth } = scene.getScreenSize();
        super(scene, screenWidth / 2, y, 'font', ScoresWidget.I18NKey);

        this.setScore(0);
    }

    public setScore(score: number) {
        const newText = score.toString();
        this.setText(newText);
    }
}
