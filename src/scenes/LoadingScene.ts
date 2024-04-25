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
        this.load.image('brush', 'assets/images/brush2.png');

        this.load.atlas('other','assets/sprites/other/other.png','assets/sprites/other/other.json');

        this.load.spritesheet('dino', 'assets/sprites/dino/dino.png', { frameWidth: 252, frameHeight: 200 });
        this.load.spritesheet('pipe', 'assets/sprites/pipes/pipes.png', { frameWidth: 52, frameHeight: 320 });

        this.load.audio('wing', 'assets/audio/fireball.ogg');
        this.load.audio('you-win', 'assets/audio/you-win-sequence.ogg');
        this.load.audio('eat', 'assets/audio/eating-chips.ogg');
        this.load.audio('hit', 'assets/audio/ough.ogg');
        this.load.audio('music', 'assets/audio/creepy-devil-dance.ogg');

        


        
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
