import { LOADING_SCENE, MAIN_MENU_SCENE } from "../constants/scenes";
import { BaseScene } from "./BaseScene";

export class LoadingScene extends BaseScene {
    constructor() {
        super(LOADING_SCENE)
    }

    public preload() {
        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
        this.load.image('bg', 'assets/images/background-night.png');
        this.load.image('landscape', 'assets/images/base.png');
        this.load.image("left_menu_image", "assets/images/main-menu-image.png");
        this.load.image('bird', 'assets/images/avatar.png');
        this.load.image('fireball', 'assets/images/fireball.png');
        this.load.image('food', 'assets/images/food.png');
        this.load.image('ball', 'assets/images/ball.png');
        this.load.image('brush', 'assets/images/brush2.png');

        this.load.spritesheet('dino', 'assets/sprites/dino/dino.png', { frameWidth: 252, frameHeight: 200 });
        this.load.spritesheet('pipe', 'assets/sprites/pipes/pipes.png', { frameWidth: 52, frameHeight: 320 });
        this.load.spritesheet('medal', 'assets/sprites/medals/medals.png', { frameWidth: 44, frameHeight: 44 });

        this.load.audio('wing', 'assets/audio/fireball.mp3');
        this.load.audio('hit', 'assets/audio/ough.ogg');
    }

    protected create() {

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('dino', {
                first: 0,
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        })

        this.toMainMenu();

    }

    protected toMainMenu() {
        this.scene.start(MAIN_MENU_SCENE)
    }
}
