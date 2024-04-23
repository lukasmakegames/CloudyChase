import { BaseScene } from "../scenes/BaseScene";

export class GameBackground extends Phaser.GameObjects.TileSprite {

    static AddToScene(scene: BaseScene) {
        const object = new this(scene);
        scene.add.existing(object);
        object.setDepth(0);

        return object;
    }

    constructor(scene: BaseScene) {
        const { screenHeight, screenWidth } = scene.getScreenSize();
        super(scene, 0, 0, screenWidth, screenHeight, 'bg');

        const bgTexture = scene.sys.textures.get('bg');

        this.setOrigin(0)
            .setScale(screenHeight / bgTexture.getSourceImage().height)
            .setInteractive(); 
    }
}
